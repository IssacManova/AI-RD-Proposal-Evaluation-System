import api from './axios';
import type { UploadProposalResponse } from '../types';

const LOCAL_KEY = 'ai_rd_proposals';

/** Helper – read cached proposals from localStorage */
const getCached = (): UploadProposalResponse['proposal'][] => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
  } catch {
    return [];
  }
};

/** Helper – persist a new proposal to localStorage */
const cacheProposal = (proposal: UploadProposalResponse['proposal']) => {
  const existing = getCached();
  // Avoid duplicates by _id
  const filtered = existing.filter((p) => p._id !== proposal._id);
  localStorage.setItem(LOCAL_KEY, JSON.stringify([proposal, ...filtered]));
};

export const proposalsApi = {
  /**
   * POST /proposal/upload  (LIVE — researcher role required)
   * Accepts multipart/form-data with title, domain, file.
   * Caches the result in localStorage for listing/detail views.
   */
  upload: async (
    title: string,
    domain: string,
    file: File,
    onUploadProgress?: (pct: number) => void,
  ): Promise<UploadProposalResponse> => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('domain', domain);
    formData.append('file', file);

    const res = await api.post<UploadProposalResponse>('/proposal/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (onUploadProgress && e.total) {
          onUploadProgress(Math.round((e.loaded * 100) / e.total));
        }
      },
    });

    // Cache locally so listing/detail pages can read it
    cacheProposal(res.data.proposal);
    return res.data;
  },

  /**
   * GET /proposal/my-proposals  (NOT YET IMPLEMENTED IN BACKEND)
   * Falls back to localStorage cache.
   */
  getMyProposals: async (): Promise<UploadProposalResponse['proposal'][]> => {
    try {
      const res = await api.get<{ proposals: UploadProposalResponse['proposal'][] }>(
        '/proposal/my-proposals',
      );
      return res.data.proposals;
    } catch {
      // Backend endpoint not yet available — return cached data
      return getCached();
    }
  },

  /**
   * GET /proposal/:id  (NOT YET IMPLEMENTED IN BACKEND)
   * Falls back to localStorage cache lookup.
   */
  getProposalById: async (id: string): Promise<UploadProposalResponse['proposal'] | null> => {
    try {
      const res = await api.get<{ proposal: UploadProposalResponse['proposal'] }>(
        `/proposal/${id}`,
      );
      return res.data.proposal;
    } catch {
      return getCached().find((p) => p._id === id) ?? null;
    }
  },

  /**
   * GET /proposal/all  (NOT YET IMPLEMENTED IN BACKEND)
   * Admin/reviewer endpoint — returns all proposals.
   */
  getAllProposals: async (): Promise<UploadProposalResponse['proposal'][]> => {
    try {
      const res = await api.get<{ proposals: UploadProposalResponse['proposal'][] }>(
        '/proposal/all',
      );
      return res.data.proposals;
    } catch {
      return getCached();
    }
  },

  /** Clear local cache (used on logout) */
  clearCache: () => {
    localStorage.removeItem(LOCAL_KEY);
  },
};
