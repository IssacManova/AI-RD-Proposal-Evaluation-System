import api from './axios';
import type { HumanReview } from '../types';

export const evaluationsApi = {
  /**
   * POST /evaluation/:id/review  (NOT YET IMPLEMENTED IN BACKEND)
   * Reviewer submits their human evaluation scores and recommendation.
   */
  submitReview: async (proposalId: string, review: HumanReview): Promise<{ message: string }> => {
    const res = await api.post<{ message: string }>(
      `/evaluation/${proposalId}/review`,
      review,
    );
    return res.data;
  },
};
