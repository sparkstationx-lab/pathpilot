import { StudentProfile, Opportunity, AIMatchAnalysis, AIApplicationMaterials } from '../types';

const MATCH_CACHE_KEY = 'autonomous_career_agent_matches';
const APPLICATION_CACHE_KEY = 'autonomous_career_agent_applications';

export function getCachedMatch(opportunityId: string): AIMatchAnalysis | null {
  try {
    const raw = sessionStorage.getItem(MATCH_CACHE_KEY);
    if (!raw) return null;
    const cache = JSON.parse(raw);
    return cache[opportunityId] || null;
  } catch (e) {
    return null;
  }
}

export function saveCachedMatch(opportunityId: string, analysis: AIMatchAnalysis): void {
  try {
    const raw = sessionStorage.getItem(MATCH_CACHE_KEY);
    const cache = raw ? JSON.parse(raw) : {};
    cache[opportunityId] = analysis;
    sessionStorage.setItem(MATCH_CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.error('Failed to save match to cache:', e);
  }
}

export function getCachedApplication(opportunityId: string): AIApplicationMaterials | null {
  try {
    const raw = sessionStorage.getItem(APPLICATION_CACHE_KEY);
    if (!raw) return null;
    const cache = JSON.parse(raw);
    return cache[opportunityId] || null;
  } catch (e) {
    return null;
  }
}

export function saveCachedApplication(opportunityId: string, materials: AIApplicationMaterials): void {
  try {
    const raw = sessionStorage.getItem(APPLICATION_CACHE_KEY);
    const cache = raw ? JSON.parse(raw) : {};
    cache[opportunityId] = materials;
    sessionStorage.setItem(APPLICATION_CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.error('Failed to save application materials to cache:', e);
  }
}

export async function generateApplicationMaterials(
  profile: StudentProfile,
  opportunity: Opportunity,
  forceRefresh = false
): Promise<AIApplicationMaterials> {
  if (!forceRefresh) {
    const cached = getCachedApplication(opportunity.id);
    if (cached) return cached;
  }

  try {
    const response = await fetch('/api/generate-application', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ profile, opportunity }),
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    const data = await response.json();
    const result: AIApplicationMaterials = {
      opportunityId: opportunity.id,
      resumeSummary: data.resumeSummary || '',
      coverLetter: data.coverLetter || '',
      applicationEmail: {
        subject: data.applicationEmail?.subject || `Application: ${opportunity.title} - ${profile.fullName || 'Applicant'}`,
        body: data.applicationEmail?.body || '',
      },
      generatedAt: data.generatedAt || new Date().toISOString(),
      isAiGenerated: !!data.isAiGenerated,
    };

    saveCachedApplication(opportunity.id, result);
    return result;
  } catch (error: any) {
    console.error('Error generating AI application materials:', error);
    throw new Error(error.message || 'Unable to generate application materials right now. Please try again.');
  }
}

export async function analyzeOpportunityFit(
  profile: StudentProfile,
  opportunity: Opportunity,
  forceRefresh = false
): Promise<AIMatchAnalysis> {
  if (!forceRefresh) {
    const cached = getCachedMatch(opportunity.id);
    if (cached) return cached;
  }

  try {
    const response = await fetch('/api/match-opportunity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ profile, opportunity }),
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    const data = await response.json();
    const result: AIMatchAnalysis = {
      opportunityId: opportunity.id,
      matchScore: typeof data.matchScore === 'number' ? data.matchScore : 75,
      eligibility: data.eligibility || 'Eligible for Application',
      skillMatch: Array.isArray(data.skillMatch) ? data.skillMatch : [],
      careerRelevance: data.careerRelevance || '',
      reasons: Array.isArray(data.reasons) ? data.reasons : [],
      skillGaps: Array.isArray(data.skillGaps) ? data.skillGaps : [],
      analyzedAt: data.analyzedAt || new Date().toISOString(),
      isAiGenerated: !!data.isAiGenerated,
    };

    saveCachedMatch(opportunity.id, result);
    return result;
  } catch (error: any) {
    console.error('Error fetching AI opportunity match:', error);
    throw new Error(error.message || 'Unable to connect to AI match service. Please try again.');
  }
}
