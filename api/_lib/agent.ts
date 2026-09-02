import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Lazy-initialize Gemini client
let aiClient: GoogleGenAI | null = null;
export function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// In-memory cache for fast responses & deduplicating AI calls
const analysisMemoryCache = new Map<string, any>();
const applicationMemoryCache = new Map<string, any>();

// Helper function to sleep
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to call Gemini with retry and model fallback on 503 / 429 / UNAVAILABLE
export async function generateContentWithRetry(
  ai: GoogleGenAI,
  prompt: string,
  schema: any,
  modelsToTry: string[] = ['gemini-3.7-flash', 'gemini-flash-latest']
): Promise<string> {
  let lastError: any = null;

  for (const model of modelsToTry) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: model,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: schema,
          },
        });

        if (response.text && response.text.trim()) {
          return response.text.trim();
        }
      } catch (err: any) {
        lastError = err;
        const errMsg = err?.message || String(err);
        const isTransient =
          errMsg.includes('503') ||
          errMsg.includes('UNAVAILABLE') ||
          errMsg.includes('high demand') ||
          errMsg.includes('429') ||
          errMsg.includes('RESOURCE_EXHAUSTED') ||
          errMsg.includes('500');

        if (isTransient && attempt === 0) {
          await sleep(600);
          continue;
        }
        break;
      }
    }
  }

  throw lastError || new Error('All Gemini models unavailable');
}

// Fallback matching algorithm when Gemini API key is not present or API call errors
export function calculateFallbackAnalysis(profile: any, opportunity: any) {
  const studentSkills = (profile.skills || []).map((s: string) => s.toLowerCase());
  const requiredSkills = (opportunity.requiredSkills || []).map((s: string) => s.toLowerCase());
  const preferredSkills = (opportunity.preferredSkills || []).map((s: string) => s.toLowerCase());

  const matchedRequired = (opportunity.requiredSkills || []).filter((s: string) =>
    studentSkills.some((st: string) => st.includes(s.toLowerCase()) || s.toLowerCase().includes(st))
  );

  const matchedPreferred = (opportunity.preferredSkills || []).filter((s: string) =>
    studentSkills.some((st: string) => st.includes(s.toLowerCase()) || s.toLowerCase().includes(st))
  );

  const missingSkills = (opportunity.requiredSkills || []).filter(
    (s: string) => !matchedRequired.includes(s)
  );

  const totalRequired = Math.max(requiredSkills.length, 1);
  const requiredMatchRatio = matchedRequired.length / totalRequired;
  const preferredMatchRatio = (matchedPreferred.length) / Math.max(preferredSkills.length, 1);

  // Score calculation: 65% required skills, 20% preferred skills, 15% goal alignment
  let score = Math.round(requiredMatchRatio * 65 + preferredMatchRatio * 20 + 10);
  if (profile.careerGoal && opportunity.title?.toLowerCase().includes(profile.careerGoal.toLowerCase().slice(0, 5))) {
    score = Math.min(score + 10, 96);
  }
  score = Math.max(Math.min(score, 98), 45);

  let eligibility = 'Eligible for Application';
  if (missingSkills.length === 0) {
    eligibility = 'Highly Eligible — Meets Core Prerequisites';
  } else if (missingSkills.length <= 1) {
    eligibility = 'Eligible — Minor Skill Gap Identified';
  } else {
    eligibility = 'Review Needed — Prerequisites Recommended';
  }

  const allMatched = [...matchedRequired, ...matchedPreferred];
  const finalSkillsMatch = allMatched.length > 0 ? allMatched : ['Foundational STEM Coursework', 'Academic Interest'];
  const finalGaps = missingSkills.length > 0 ? missingSkills : ['Advanced Domain Frameworks'];

  const reasons = [
    `Strong alignment with your background in ${profile.fieldOfStudy || profile.branchField || 'STEM/Computer Science'}.`,
    `Direct relevance to your stated goal of becoming a ${profile.careerGoal || 'technology professional'}.`,
    `Opportunity provides hands-on growth in ${opportunity.requiredSkills?.[0] || 'core engineering'} and industry workflows.`,
  ];

  return {
    matchScore: score,
    eligibility: eligibility,
    skillMatch: finalSkillsMatch,
    careerRelevance: `This opportunity directly supports your objective in ${profile.careerGoal || opportunity.field} by offering direct practical application and industry mentorship.`,
    reasons: reasons,
    skillGaps: finalGaps,
    isAiGenerated: false,
  };
}

// Fallback application generator based strictly on student's verified profile data
export function calculateFallbackApplication(profile: any, opportunity: any) {
  const studentSkills = (profile.skills || []).length > 0
    ? profile.skills.slice(0, 5).join(', ')
    : 'core computing and analytical problem-solving';

  const matchedSkills = (profile.skills || []).filter((s: string) =>
    (opportunity.requiredSkills || []).some((req: string) =>
      req.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(req.toLowerCase())
    )
  );

  const keySkills = matchedSkills.length > 0
    ? matchedSkills.slice(0, 4).join(', ')
    : studentSkills;

  const projectText = (profile.projects || []).length > 0
    ? profile.projects.join(' and ')
    : 'practical coursework and lab implementations';

  const studentName = profile.fullName || 'Student Applicant';
  const degreeInfo = `${profile.currentYear || '3rd Year'} ${profile.educationDegree || 'Undergraduate'} student in ${profile.branchField || 'Computer Science & Engineering'}`;

  const resumeSummary = `Motivated ${degreeInfo} with demonstrated skills in ${keySkills}. Eager to leverage hands-on project experience in ${projectText} and a strong commitment to learning to contribute effectively to the ${opportunity.title} role at ${opportunity.organization}.`;

  const coverLetter = `Dear Hiring Team at ${opportunity.organization},

I am writing to formally express my interest in the ${opportunity.title} position. As a ${degreeInfo}, I have cultivated a strong foundation in ${studentSkills}, with particular enthusiasm for ${opportunity.field}.

Throughout my academic coursework and project work—including ${projectText}—I have focused on building practical, structured solutions and collaborating effectively. My profile directly aligns with your requirements in ${keySkills}, and my long-term goal of becoming a ${profile.careerGoal || 'technology professional'} motivates me to deliver rigorous, dependable work.

I am inspired by ${opportunity.organization}'s work and would be thrilled to bring my proactive attitude, technical foundation, and dedication to your team. Thank you for considering my application, and I look forward to discussing how I can contribute.

Sincerely,
${studentName}`;

  const applicationEmail = {
    subject: `Application for ${opportunity.title} - ${studentName}`,
    body: `Dear ${opportunity.organization} Hiring Team,

I hope this email finds you well.

I am writing to submit my application for the ${opportunity.title} opening at ${opportunity.organization}. I am currently a ${degreeInfo}, with strong competencies in ${keySkills}.

I have attached my updated resume and portfolio for your consideration, detailing my academic background and key project work including ${projectText}. I would welcome the opportunity to discuss how my skill set and enthusiasm can support your team's objectives.

Thank you very much for your time and consideration.

Warm regards,

${studentName}
${profile.educationDegree || 'Undergraduate'} | ${profile.branchField || 'Computer Science'}`,
  };

  return {
    opportunityId: opportunity.id,
    resumeSummary,
    coverLetter,
    applicationEmail,
    generatedAt: new Date().toISOString(),
    isAiGenerated: false,
  };
}

// Core Match Opportunity Handler Logic
export async function handleMatchOpportunity(body: any) {
  const { profile, opportunity } = body || {};

  if (!opportunity) {
    throw { status: 400, message: 'Opportunity data is required.' };
  }

  const studentProfile = profile || {
    fullName: 'Student Applicant',
    educationDegree: 'Undergraduate',
    branchField: 'Computer Science & Engineering',
    currentYear: '3rd Year',
    skills: ['Python', 'Data Structures', 'Git'],
    interests: ['Software Development', 'AI'],
    careerGoal: 'Software Engineer',
    projects: ['Web Application Project'],
    certifications: [],
  };

  const ai = getGeminiClient();

  if (!ai) {
    const fallback = calculateFallbackAnalysis(studentProfile, opportunity);
    return {
      ...fallback,
      analyzedAt: new Date().toISOString(),
      opportunityId: opportunity.id,
      note: 'Analyzed using local matching engine (Gemini API key not configured).',
    };
  }

  const cacheKey = `${opportunity.id}_${studentProfile.fullName}_${(studentProfile.skills || []).join(',')}_${studentProfile.careerGoal}`;
  if (analysisMemoryCache.has(cacheKey)) {
    return analysisMemoryCache.get(cacheKey);
  }

  try {
    const prompt = `You are the core intelligence of "Autonomous AI Career Agent", a personal career assistant for students.
Analyze how well this student's career profile fits the specific opportunity.

STUDENT PROFILE:
- Name: ${studentProfile.fullName || 'Student'}
- Degree: ${studentProfile.educationDegree || 'Undergraduate'}
- Field / Major: ${studentProfile.branchField || studentProfile.fieldOfStudy || 'STEM / Computer Science'}
- Academic Year: ${studentProfile.currentYear || '3rd Year'}
- Skills: ${(studentProfile.skills || []).join(', ') || 'General STEM skills'}
- Interests: ${(studentProfile.interests || []).join(', ') || 'Technology, Software'}
- Career Goal: ${studentProfile.careerGoal || 'Software Engineer / Technologist'}
- Projects: ${(studentProfile.projects || []).join('; ') || 'Academic coursework projects'}
- Certifications: ${(studentProfile.certifications || []).join('; ') || 'None listed'}

OPPORTUNITY:
- Title: ${opportunity.title}
- Organization: ${opportunity.organization}
- Category: ${opportunity.category}
- Required Skills: ${(opportunity.requiredSkills || []).join(', ')}
- Preferred Skills: ${(opportunity.preferredSkills || []).join(', ')}
- Eligibility Criteria: ${(opportunity.eligibilityCriteria || []).join('; ')}
- Field: ${opportunity.field}
- Summary: ${opportunity.summary}

TASK:
Evaluate the fit realistically and objectively.
Return structured analysis:
1. matchScore: Integer 0 to 100 based on skill match, education fit, and career goal alignment.
2. eligibility: Short status sentence (e.g., "Fully Eligible", "Eligible with Recommended Preparation", "Partially Eligible").
3. skillMatch: List of concrete matching skills, frameworks, or strengths the student already has for this role.
4. careerRelevance: 1-2 sentence explanation of how this opportunity furthers the student's career goal.
5. reasons: 2 to 3 concise, bulleted reasons why this opportunity is recommended for them.
6. skillGaps: List of specific missing skills, tools, or prerequisite gaps they should address.`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        matchScore: {
          type: Type.INTEGER,
          description: 'Match score between 0 and 100 based on skill overlap and eligibility',
        },
        eligibility: {
          type: Type.STRING,
          description: 'Eligibility assessment (e.g. Fully Eligible, Eligible with Minor Skill Gaps)',
        },
        skillMatch: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'List of matched skills that the student possesses',
        },
        careerRelevance: {
          type: Type.STRING,
          description: 'Explanation of how this opportunity aligns with the student career goal',
        },
        reasons: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Key reasons why this opportunity is recommended for the student',
        },
        skillGaps: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Specific missing skills, tools, or qualifications the student should develop',
        },
      },
      required: ['matchScore', 'eligibility', 'skillMatch', 'careerRelevance', 'reasons', 'skillGaps'],
    };

    const responseText = await generateContentWithRetry(ai, prompt, schema);
    const parsedData = JSON.parse(responseText);

    const result = {
      opportunityId: opportunity.id,
      matchScore: Math.min(Math.max(parsedData.matchScore || 75, 10), 100),
      eligibility: parsedData.eligibility || 'Eligible for Application',
      skillMatch: parsedData.skillMatch || [],
      careerRelevance: parsedData.careerRelevance || '',
      reasons: parsedData.reasons || [],
      skillGaps: parsedData.skillGaps || [],
      analyzedAt: new Date().toISOString(),
      isAiGenerated: true,
    };

    analysisMemoryCache.set(cacheKey, result);
    return result;
  } catch (err: any) {
    console.warn('Gemini API match analysis temporary issue, utilizing resilient fallback engine:', err?.message || err);
    const fallback = calculateFallbackAnalysis(studentProfile, opportunity);
    const result = {
      ...fallback,
      opportunityId: opportunity.id,
      analyzedAt: new Date().toISOString(),
      fallbackDueToError: true,
    };
    analysisMemoryCache.set(cacheKey, result);
    return result;
  }
}

// Core Generate Application Handler Logic
export async function handleGenerateApplication(body: any) {
  const { profile, opportunity } = body || {};

  if (!opportunity) {
    throw { status: 400, message: 'Opportunity data is required.' };
  }

  const studentProfile = profile || {
    fullName: 'Student Applicant',
    educationDegree: 'Undergraduate',
    branchField: 'Computer Science & Engineering',
    currentYear: '3rd Year',
    skills: ['Python', 'Data Structures', 'Git'],
    interests: ['Software Development', 'AI'],
    careerGoal: 'Software Engineer',
    projects: ['Web Application Project'],
    certifications: [],
  };

  const ai = getGeminiClient();

  if (!ai) {
    const fallback = calculateFallbackApplication(studentProfile, opportunity);
    return fallback;
  }

  const cacheKey = `${opportunity.id}_${studentProfile.fullName}_${(studentProfile.skills || []).join(',')}_${studentProfile.careerGoal}`;
  if (applicationMemoryCache.has(cacheKey)) {
    return applicationMemoryCache.get(cacheKey);
  }

  try {
    const prompt = `You are PathPilot's Autonomous AI Career Application Assistant for students.
Your task is to generate professional, tailored, student-appropriate job application materials for a student applying to a specific opportunity.

CRITICAL INSTRUCTIONS & STRICT BOUNDARIES:
1. Base all generated text STRICTLY and EXCLUSIVELY on the student's actual provided profile details and the opportunity requirements.
2. DO NOT invent fake past employers, fictitious internships, made-up metrics (like "increased revenue by 40%"), non-existent certificates, or unlisted technical skills.
3. Reference the student's actual academic background (${studentProfile.educationDegree} in ${studentProfile.branchField}, ${studentProfile.currentYear}), their actual listed skills, and their real projects.
4. Tone must be professional, enthusiastic, articulate, and appropriate for an ambitious early-career student or new graduate.

STUDENT PROFILE (SOURCE OF TRUTH):
- Full Name: ${studentProfile.fullName || 'Student Applicant'}
- Education Degree: ${studentProfile.educationDegree || 'Undergraduate'}
- Field / Branch: ${studentProfile.branchField || 'Computer Science & Engineering'}
- Academic Year: ${studentProfile.currentYear || '3rd Year'}
- Skills: ${(studentProfile.skills || []).join(', ') || 'Computer Science fundamentals'}
- Interests: ${(studentProfile.interests || []).join(', ') || 'Technology & Software'}
- Target Career Goal: ${studentProfile.careerGoal || 'Software Engineer'}
- Projects: ${(studentProfile.projects || []).join('; ') || 'Coursework projects'}
- Certifications: ${(studentProfile.certifications || []).join('; ') || 'None listed'}

TARGET OPPORTUNITY:
- Title: ${opportunity.title}
- Organization: ${opportunity.organization}
- Category: ${opportunity.category}
- Field: ${opportunity.field}
- Required Skills: ${(opportunity.requiredSkills || []).join(', ')}
- Preferred Skills: ${(opportunity.preferredSkills || []).join(', ')}
- Location & Type: ${opportunity.location} (${opportunity.type})
- Summary: ${opportunity.summary}
- Description: ${opportunity.description}

GENERATE:
1. "resumeSummary": A high-impact, professional 2-3 sentence summary tailored for the header of a student resume for this role.
2. "coverLetter": A complete, polished 3-4 paragraph cover letter addressed to the hiring team at ${opportunity.organization}. Connect the student's verified background and projects to the role's needs.
3. "applicationEmail": An object with:
   - "subject": A crisp, professional email subject line for the application.
   - "body": A courteous, concise 2-3 paragraph application email with salutation, key qualifications summary, mention of attached resume/portfolio, and professional sign-off.`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        resumeSummary: {
          type: Type.STRING,
          description: 'A 2-3 sentence tailored professional resume summary using verified student data',
        },
        coverLetter: {
          type: Type.STRING,
          description: 'A full 3-4 paragraph formal cover letter for this opportunity',
        },
        applicationEmail: {
          type: Type.OBJECT,
          properties: {
            subject: {
              type: Type.STRING,
              description: 'Professional subject line for application email',
            },
            body: {
              type: Type.STRING,
              description: 'Polished body text for the outreach/application email',
            },
          },
          required: ['subject', 'body'],
        },
      },
      required: ['resumeSummary', 'coverLetter', 'applicationEmail'],
    };

    const responseText = await generateContentWithRetry(ai, prompt, schema);
    const parsedData = JSON.parse(responseText);

    const result = {
      opportunityId: opportunity.id,
      resumeSummary: parsedData.resumeSummary || '',
      coverLetter: parsedData.coverLetter || '',
      applicationEmail: {
        subject: parsedData.applicationEmail?.subject || `Application: ${opportunity.title} - ${studentProfile.fullName}`,
        body: parsedData.applicationEmail?.body || '',
      },
      generatedAt: new Date().toISOString(),
      isAiGenerated: true,
    };

    applicationMemoryCache.set(cacheKey, result);
    return result;
  } catch (err: any) {
    console.warn('Gemini API application generation temporary issue, utilizing resilient fallback engine:', err?.message || err);
    const fallback = calculateFallbackApplication(studentProfile, opportunity);
    const result = {
      ...fallback,
      fallbackDueToError: true,
    };
    applicationMemoryCache.set(cacheKey, result);
    return result;
  }
}
