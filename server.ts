import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
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

// Fallback matching algorithm when Gemini API key is not present or API call errors
function calculateFallbackAnalysis(profile: any, opportunity: any) {
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
  if (profile.careerGoal && opportunity.title.toLowerCase().includes(profile.careerGoal.toLowerCase().slice(0, 5))) {
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

// API Route: AI Opportunity Match Analysis
app.post('/api/match-opportunity', async (req, res) => {
  const { profile, opportunity } = req.body;

  if (!opportunity) {
    return res.status(400).json({ error: 'Opportunity data is required.' });
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

  // If no Gemini client is available, return calculated fallback
  if (!ai) {
    const fallback = calculateFallbackAnalysis(studentProfile, opportunity);
    return res.json({
      ...fallback,
      analyzedAt: new Date().toISOString(),
      opportunityId: opportunity.id,
      note: 'Analyzed using local matching engine (Gemini API key not configured).',
    });
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

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
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
        },
      },
    });

    const responseText = response.text ? response.text.trim() : '';
    const parsedData = JSON.parse(responseText);

    return res.json({
      opportunityId: opportunity.id,
      matchScore: Math.min(Math.max(parsedData.matchScore || 75, 10), 100),
      eligibility: parsedData.eligibility || 'Eligible for Application',
      skillMatch: parsedData.skillMatch || [],
      careerRelevance: parsedData.careerRelevance || '',
      reasons: parsedData.reasons || [],
      skillGaps: parsedData.skillGaps || [],
      analyzedAt: new Date().toISOString(),
      isAiGenerated: true,
    });
  } catch (err: any) {
    console.error('Error calling Gemini API for opportunity match:', err);
    // Graceful fallback on API error
    const fallback = calculateFallbackAnalysis(studentProfile, opportunity);
    return res.json({
      ...fallback,
      opportunityId: opportunity.id,
      analyzedAt: new Date().toISOString(),
      fallbackDueToError: true,
      errorMessage: err.message || 'Gemini service temporary issue',
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Autonomous AI Career Agent API' });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Autonomous AI Career Agent server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
