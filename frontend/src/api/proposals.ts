import api from './axios';
import type { UploadProposalResponse } from '../types';

const LOCAL_KEY = 'ai_rd_proposals';

/** Helper – sort proposal list descending by uploaded_at / _id */
const sortByDateDesc = (list: UploadProposalResponse['proposal'][]): UploadProposalResponse['proposal'][] => {
  return [...list].sort((a, b) => {
    const timeA = a.uploaded_at ? new Date(a.uploaded_at).getTime() : 0;
    const timeB = b.uploaded_at ? new Date(b.uploaded_at).getTime() : 0;
    if (timeA !== timeB) return timeB - timeA;
    return (b._id || '').localeCompare(a._id || '');
  });
};

/** Helper – read cached proposals from localStorage */
const getCached = (): UploadProposalResponse['proposal'][] => {
  try {
    const data = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
    return sortByDateDesc(data);
  } catch {
    return [];
  }
};

/** Helper – persist a new proposal to localStorage */
const cacheProposal = (proposal: UploadProposalResponse['proposal']) => {
  const existing = getCached();
  // Avoid duplicates by _id
  const filtered = existing.filter((p) => p._id !== proposal._id);
  const updated = sortByDateDesc([proposal, ...filtered]);
  localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
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
   * GET /proposal/my-proposals
   * Returns current researcher's submitted proposals.
   */
  getMyProposals: async (): Promise<UploadProposalResponse['proposal'][]> => {
    try {
      const res = await api.get<{ proposals: UploadProposalResponse['proposal'][] }>(
        '/proposal/my-proposals',
      );
      return sortByDateDesc(res.data.proposals);
    } catch {
      return getCached();
    }
  },

  /**
   * GET /proposal/:id
   * Fetch single proposal by ID.
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
   * GET /proposal/all
   * Admin/reviewer endpoint — returns all proposals sorted by uploaded_at descending.
   */
  getAllProposals: async (): Promise<UploadProposalResponse['proposal'][]> => {
    try {
      const res = await api.get<{ proposals: UploadProposalResponse['proposal'][] }>(
        '/proposal/all',
      );
      return sortByDateDesc(res.data.proposals);
    } catch {
      return getCached();
    }
  },

  /**
   * POST /proposal/:id/evaluate
   * Trigger AI re-evaluation for a single proposal.
   */
  reEvaluateProposal: async (id: string): Promise<UploadProposalResponse['proposal']> => {
    const res = await api.post<{ proposal: UploadProposalResponse['proposal'] }>(
      `/proposal/${id}/evaluate`,
    );
    cacheProposal(res.data.proposal);
    return res.data.proposal;
  },

  /**
   * DELETE /proposal/:id
   * Admin: delete a proposal.
   */
  deleteProposal: async (id: string): Promise<{ message: string }> => {
    const res = await api.delete<{ message: string }>(`/proposal/${id}`);
    const existing = getCached();
    const filtered = existing.filter((p) => p._id !== id);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(filtered));
    return res.data;
  },

  /** Clear local cache (used on logout) */
  clearCache: () => {
    localStorage.removeItem(LOCAL_KEY);
  },
};


