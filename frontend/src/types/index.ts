// ─── Auth ───────────────────────────────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface RegisterResponse {
  message: string;
}

// ─── User ────────────────────────────────────────────────────────────────────
export type UserRole = 'researcher' | 'reviewer' | 'admin';

export interface AuthUser {
  email: string;
  role: UserRole;
  name?: string;
}

export interface User {
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
  created_at?: string;
  status?: 'active' | 'inactive';
}

// ─── Evaluation ──────────────────────────────────────────────────────────────
export interface Evaluation {
  summary: string;
  novelty_score: number;
  methodology_score: number;
  feasibility_score: number;
  clarity_score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  overall_recommendation: string;
  overall_score: number;
  overall_percentage: number;
  error?: string;
}

// ─── Similarity ──────────────────────────────────────────────────────────────
export interface SimilarityMatch {
  _id: string;
  title: string;
  similarity_score: number;
}

// ─── Format Check ────────────────────────────────────────────────────────────
export interface FormatCheckSection {
  id: string;
  label: string;
  found: boolean;
  required: boolean;
}

export interface FormatCheck {
  format_standard?: string;
  is_valid: boolean;
  score: number;           // 0-100
  total_sections: number;
  found_count: number;
  missing_count: number;
  sections: FormatCheckSection[];
}

// ─── Notifications ───────────────────────────────────────────────────────────
export interface AppNotification {
  _id: string;
  user_email: string;
  title: string;
  message: string;
  proposal_id: string;
  type: string;
  read: boolean;
  created_at: string;
}

export interface NotificationsResponse {
  notifications: AppNotification[];
  unread_count: number;
}

// ─── Proposal ────────────────────────────────────────────────────────────────
export interface Proposal {
  _id: string;
  title: string;
  domain: string;
  filename: string;
  file_path: string;
  researcher_email: string;
  uploaded_at: string;
  extracted_text: string;
  evaluation: Evaluation;
  similarity: SimilarityMatch[];
  similarity_score: number | null;
  human_review?: HumanReview;
  format_check?: FormatCheck;
}

export interface UploadProposalResponse {
  message: string;
  proposal: Proposal;
}

export interface UploadProposalRequest {
  title: string;
  domain: string;
  file: File;
}

// ─── Human Review ────────────────────────────────────────────────────────────
export interface HumanReview {
  reviewer_email: string;
  novelty_score: number;
  methodology_score: number;
  feasibility_score: number;
  clarity_score: number;
  comments: string;
  final_recommendation: RecommendationStatus;
  reviewed_at?: string;
}

// ─── Recommendation Status ───────────────────────────────────────────────────
export type RecommendationStatus =
  | 'accept'
  | 'accept_with_revisions'
  | 'revise'
  | 'reject'
  | 'pending';

// ─── Pipeline Stage ──────────────────────────────────────────────────────────
export type PipelineStageStatus = 'waiting' | 'active' | 'complete' | 'error';

export interface PipelineStage {
  id: string;
  label: string;
  status: PipelineStageStatus;
}

// ─── Dashboard Stats ─────────────────────────────────────────────────────────
export interface ResearcherStats {
  total_proposals: number;
  evaluated_proposals: number;
  pending_evaluations: number;
  average_score: number;
}

export interface ReviewerStats {
  assigned_proposals: number;
  pending_reviews: number;
  completed_reviews: number;
  average_score: number;
}

export interface AdminStats {
  total_users: number;
  researchers: number;
  reviewers: number;
  total_proposals: number;
  evaluated_proposals: number;
  pending_reviews: number;
}
