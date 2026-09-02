import { StudentProfile, Opportunity, AIMatchAnalysis } from '../types';

/**
 * Normalizes text for keyword and substring matching
 */
function normalize(str: string): string {
  return (str || '')
    .toLowerCase()
    .replace(/[^\w\s+#.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Checks if two skill terms match using semantic synonyms and substring overlap
 */
function isSkillMatch(studentSkill: string, reqSkill: string): boolean {
  const s = normalize(studentSkill);
  const r = normalize(reqSkill);

  if (!s || !r) return false;
  if (s === r) return true;
  if (s.includes(r) || r.includes(s)) return true;

  // Synonyms and related tech mappings
  const techEquivalents: [string[], string[]][] = [
    [['react', 'react.js', 'reactjs', 'frontend', 'ui'], ['react', 'react.js', 'frontend web development']],
    [['python', 'python 3', 'django', 'fastapi'], ['python', 'backend']],
    [['javascript', 'js', 'typescript', 'ts', 'es6'], ['javascript', 'typescript', 'web development']],
    [['node', 'node.js', 'nodejs', 'express', 'express.js'], ['node.js', 'backend', 'rest apis']],
    [['sql', 'postgresql', 'mysql', 'database', 'rdbms'], ['sql', 'database management', 'postgresql', 'mysql']],
    [['aws', 'cloud', 'gcp', 'azure', 'cloud architecture'], ['aws', 'cloud computing', 'cloud infrastructure']],
    [['ml', 'machine learning', 'deep learning', 'ai', 'artificial intelligence', 'nlp'], ['machine learning', 'artificial intelligence', 'data science', 'deep learning']],
    [['data structures', 'algorithms', 'dsa', 'problem solving'], ['data structures', 'algorithms', 'system design']],
    [['git', 'github', 'version control', 'ci/cd'], ['git', 'version control', 'software engineering']],
    [['rest apis', 'api design', 'graphql', 'http'], ['rest apis', 'api integration', 'web services']],
    [['docker', 'kubernetes', 'devops', 'linux'], ['docker', 'devops', 'containerization']],
    [['figma', 'ui/ux', 'user experience', 'design'], ['ui/ux design', 'figma', 'product design']],
  ];

  for (const [groupA, groupB] of techEquivalents) {
    const inA = groupA.some((t) => s.includes(t) || t.includes(s));
    const inB = groupB.some((t) => r.includes(t) || t.includes(r));
    if (inA && inB) return true;
  }

  return false;
}

/**
 * Fully client-side weighted matching engine for PathPilot Opportunity Analysis:
 * - Skills: 40%
 * - Career Goal: 30%
 * - Interests: 20%
 * - Eligibility: 10%
 */
export function calculateOpportunityMatch(
  profile: StudentProfile,
  opportunity: Opportunity
): AIMatchAnalysis {
  const studentSkills = (profile.skills || []).map((s) => s.trim()).filter(Boolean);
  const studentInterests = (profile.interests || []).map((i) => i.trim()).filter(Boolean);
  const studentGoal = profile.careerGoal || '';
  const studentDegree = profile.educationDegree || '';
  const studentBranch = profile.branchField || '';
  const studentYear = profile.currentYear || '';

  const reqSkills = opportunity.requiredSkills || [];
  const prefSkills = opportunity.preferredSkills || [];
  const eligibilityCriteria = opportunity.eligibilityCriteria || [];

  // =========================================================================
  // 1. SKILLS CALCULATION (Weight: 40%)
  // =========================================================================
  const matchedReqSkills: string[] = [];
  const missingReqSkills: string[] = [];
  const matchedPrefSkills: string[] = [];
  const missingPrefSkills: string[] = [];

  for (const req of reqSkills) {
    const isMatched = studentSkills.some((st) => isSkillMatch(st, req));
    if (isMatched) {
      matchedReqSkills.push(req);
    } else {
      missingReqSkills.push(req);
    }
  }

  for (const pref of prefSkills) {
    const isMatched = studentSkills.some((st) => isSkillMatch(st, pref));
    if (isMatched) {
      matchedPrefSkills.push(pref);
    } else {
      missingPrefSkills.push(pref);
    }
  }

  const reqRatio = reqSkills.length > 0 ? matchedReqSkills.length / reqSkills.length : 0.85;
  const prefRatio = prefSkills.length > 0 ? matchedPrefSkills.length / prefSkills.length : reqRatio;

  // 75% of skills component is from required skills, 25% from preferred
  const skillsScoreRatio = reqRatio * 0.75 + prefRatio * 0.25;
  const skillsScore = Math.min(40, Math.max(0, skillsScoreRatio * 40));

  // Build displayable skill match list
  const combinedSkillMatch = [...matchedReqSkills, ...matchedPrefSkills];
  const skillMatch =
    combinedSkillMatch.length > 0
      ? combinedSkillMatch
      : studentSkills.slice(0, 3).length > 0
      ? studentSkills.slice(0, 3)
      : ['Fundamental Engineering & Problem Solving'];

  // Build displayable skill gaps
  const skillGaps =
    missingReqSkills.length > 0
      ? missingReqSkills
      : missingPrefSkills.length > 0
      ? missingPrefSkills.slice(0, 2)
      : [];

  // =========================================================================
  // 2. CAREER GOAL CALCULATION (Weight: 30%)
  // =========================================================================
  const normGoal = normalize(studentGoal);
  const normTitle = normalize(opportunity.title);
  const normField = normalize(opportunity.field);
  const normSummary = normalize(opportunity.summary);
  const normDesc = normalize(opportunity.description);
  const normBranch = normalize(studentBranch);

  let careerGoalRatio = 0.6; // baseline

  // Key tokens from career goal
  const goalTokens = normGoal.split(' ').filter((w) => w.length > 2 && !['and', 'for', 'the', 'with'].includes(w));
  const tokenMatches = goalTokens.filter(
    (t) => normTitle.includes(t) || normField.includes(t) || normSummary.includes(t)
  );

  if (goalTokens.length > 0 && tokenMatches.length >= 2) {
    careerGoalRatio = 0.96;
  } else if (goalTokens.length > 0 && tokenMatches.length === 1) {
    careerGoalRatio = 0.88;
  } else if (normField.includes(normBranch) || normBranch.includes(normField) || normSummary.includes(normBranch)) {
    careerGoalRatio = 0.82;
  } else if (normTitle.includes('software') || normTitle.includes('developer') || normTitle.includes('engineer') || normTitle.includes('intern')) {
    careerGoalRatio = 0.76;
  } else {
    careerGoalRatio = 0.65;
  }

  const careerGoalScore = Math.min(30, Math.max(0, careerGoalRatio * 30));

  let careerRelevance = '';
  if (careerGoalRatio >= 0.9) {
    careerRelevance = `Directly aligns with your career goal of becoming a ${studentGoal || opportunity.field}. Working as a ${opportunity.title} at ${opportunity.organization} provides high-impact industry experience directly in ${opportunity.field}.`;
  } else if (careerGoalRatio >= 0.8) {
    careerRelevance = `Strongly reinforces your trajectory toward ${studentGoal || opportunity.field} by offering practical exposure to ${opportunity.field} workflows, team problem solving, and production standards.`;
  } else {
    careerRelevance = `Complements your aspiration in ${studentGoal || opportunity.field} by broadening your professional foundation and multidisciplinary experience in ${opportunity.field}.`;
  }

  // =========================================================================
  // 3. INTERESTS CALCULATION (Weight: 20%)
  // =========================================================================
  const matchedInterests: string[] = [];
  const fullOppText = `${normTitle} ${normField} ${normSummary} ${normDesc} ${reqSkills.map(normalize).join(' ')}`;

  for (const interest of studentInterests) {
    const normInt = normalize(interest);
    const intTokens = normInt.split(' ').filter((w) => w.length > 2);
    const hasMatch = intTokens.some((t) => fullOppText.includes(t));
    if (hasMatch) {
      matchedInterests.push(interest);
    }
  }

  let interestsRatio = 0.55;
  if (studentInterests.length === 0) {
    interestsRatio = 0.75; // neutral if not specified
  } else if (matchedInterests.length >= 2) {
    interestsRatio = 1.0;
  } else if (matchedInterests.length === 1) {
    interestsRatio = 0.85;
  } else {
    interestsRatio = 0.62;
  }

  const interestsScore = Math.min(20, Math.max(0, interestsRatio * 20));

  // =========================================================================
  // 4. ELIGIBILITY CALCULATION (Weight: 10%)
  // =========================================================================
  const normCritText = eligibilityCriteria.map(normalize).join(' ');
  const normYear = normalize(studentYear);
  const normDegree = normalize(studentDegree);

  let eligibilityRatio = 0.85;
  let eligibility = 'Eligible for Application';

  const matchesYear =
    normCritText.includes(normYear) ||
    normCritText.includes('undergraduate') ||
    normCritText.includes('bachelor') ||
    normCritText.includes('b.tech') ||
    normCritText.includes('all years') ||
    normCritText.includes('enrolled') ||
    normCritText.includes('students');

  const matchesDegree =
    normCritText.includes(normDegree) ||
    normCritText.includes('stem') ||
    normCritText.includes('engineering') ||
    normCritText.includes('computer science') ||
    normCritText.includes('technical discipline') ||
    normCritText.includes('related field') ||
    normCritText.includes('open to all');

  if (matchesYear && matchesDegree) {
    eligibility = 'Eligible — Meets all core academic and year prerequisites';
    eligibilityRatio = 1.0;
  } else if (matchesYear || matchesDegree) {
    eligibility = 'Eligible — Meets primary enrollment requirements';
    eligibilityRatio = 0.9;
  } else {
    eligibility = 'Eligible — Verify specific departmental or graduation criteria';
    eligibilityRatio = 0.75;
  }

  const eligibilityScore = Math.min(10, Math.max(0, eligibilityRatio * 10));

  // =========================================================================
  // 5. TOTAL WEIGHTED SCORE (0 to 100)
  // =========================================================================
  const rawTotal = skillsScore + careerGoalScore + interestsScore + eligibilityScore;
  const matchScore = Math.min(99, Math.max(45, Math.round(rawTotal)));

  // =========================================================================
  // 6. WHY RECOMMENDED REASONS
  // =========================================================================
  const reasons: string[] = [];

  if (matchedReqSkills.length > 0) {
    reasons.push(
      `Strong technical overlap: Your skills in ${matchedReqSkills.slice(0, 3).join(', ')} match key role requirements.`
    );
  } else if (skillMatch.length > 0) {
    reasons.push(
      `Provides an immediate platform to utilize and advance your skills in ${skillMatch.slice(0, 2).join(' and ')}.`
    );
  }

  reasons.push(
    `Directly advances your career path toward ${studentGoal || opportunity.field} through hands-on responsibilities at ${opportunity.organization}.`
  );

  if (matchedInterests.length > 0) {
    reasons.push(
      `Strong domain synergy with your declared interest in ${matchedInterests.slice(0, 2).join(' & ')}.`
    );
  } else {
    reasons.push(
      `Aligns with your academic background in ${studentBranch || studentDegree || 'Engineering / STEM'}.`
    );
  }

  reasons.push(
    `${opportunity.category} offering ${opportunity.benefitsOrAward} with ${opportunity.type.toLowerCase()} workplace flexibility.`
  );

  return {
    opportunityId: opportunity.id,
    matchScore,
    eligibility,
    skillMatch,
    careerRelevance,
    reasons,
    skillGaps,
    analyzedAt: new Date().toISOString(),
    isAiGenerated: true,
  };
}
