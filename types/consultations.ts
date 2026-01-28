/**
 * Types for consultation system (V2 Schema)
 */

export interface Consultation {
  id: string
  user_id: string
  subject: string
  description: string
  consultation_type?: 'strategy' | 'implementation' | 'assessment' | 'training' | 'other'
  urgency: 'low' | 'medium' | 'high' | 'critical'
  company_size?: string
  industry?: string
  budget_range?: string
  timeline?: string
  current_ai_usage?: string
  specific_challenges?: string
  status: 'pending' | 'in_review' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  assigned_consultant_id?: string
  priority_score: number
  preferred_contact_method?: 'email' | 'phone' | 'video' | 'in_person'
  preferred_times?: any // JSONB
  scheduled_at?: string
  consultation_notes?: string
  follow_up_required: boolean
  follow_up_date?: string
  created_at: string
  updated_at: string
}

// Extended interfaces for API responses
export interface ConsultationWithDetails extends Consultation {
  user?: {
    id: string
    first_name?: string
    last_name?: string
    email: string
    company_name?: string
    phone?: string
  }
  assigned_consultant?: {
    id: string
    first_name?: string
    last_name?: string
    email: string
  }
}

// Summary/list types
export interface ConsultationSummary {
  id: string
  subject: string
  consultation_type?: 'strategy' | 'implementation' | 'assessment' | 'training' | 'other'
  urgency: 'low' | 'medium' | 'high' | 'critical'
  status: 'pending' | 'in_review' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  user_name?: string
  company_name?: string
  assigned_consultant_name?: string
  priority_score: number
  created_at: string
  scheduled_at?: string
}

// Form data types
export interface ConsultationFormData {
  subject: string
  description: string
  consultation_type?: 'strategy' | 'implementation' | 'assessment' | 'training' | 'other'
  urgency?: 'low' | 'medium' | 'high' | 'critical'
  company_size?: string
  industry?: string
  budget_range?: string
  timeline?: string
  current_ai_usage?: string
  specific_challenges?: string
  preferred_contact_method?: 'email' | 'phone' | 'video' | 'in_person'
  preferred_times?: any
}

export interface ConsultationUpdateFormData {
  status?: 'pending' | 'in_review' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  assigned_consultant_id?: string
  priority_score?: number
  scheduled_at?: string
  consultation_notes?: string
  follow_up_required?: boolean
  follow_up_date?: string
}

// Filter types
export interface ConsultationFilter {
  user_id?: string
  consultation_type?: 'strategy' | 'implementation' | 'assessment' | 'training' | 'other'
  urgency?: 'low' | 'medium' | 'high' | 'critical'
  status?: 'pending' | 'in_review' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  assigned_consultant_id?: string
  industry?: string
  date_from?: string
  date_to?: string
  search_term?: string
  limit?: number
  offset?: number
  sortBy?: 'created_at' | 'scheduled_at' | 'priority_score' | 'urgency'
  sortDirection?: 'asc' | 'desc'
}

// Stats types
export interface ConsultationStats {
  total_consultations: number
  pending_consultations: number
  in_progress_consultations: number
  completed_consultations: number
  cancelled_consultations: number
  average_resolution_time: number // in days
  status_breakdown: {
    status: string
    count: number
    percentage: number
  }[]
  type_breakdown: {
    consultation_type: string
    count: number
  }[]
  urgency_breakdown: {
    urgency: string
    count: number
  }[]
  consultant_workload: {
    consultant_id: string
    consultant_name: string
    active_consultations: number
    completed_consultations: number
  }[]
}

// Priority and urgency helpers
export const CONSULTATION_PRIORITIES = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4
} as const

export const CONSULTATION_STATUS_COLORS = {
  pending: 'yellow',
  in_review: 'blue',
  scheduled: 'purple',
  in_progress: 'orange',
  completed: 'green',
  cancelled: 'red'
} as const

export const CONSULTATION_URGENCY_COLORS = {
  low: 'green',
  medium: 'yellow',
  high: 'orange',
  critical: 'red'
} as const

// =============================================================================
// CONSULTATION PLATFORM TYPES (V2.1)
// =============================================================================

/**
 * Private messages exchanged during consultations
 */
export interface ConsultationMessage {
  id: string
  consultation_id: string
  sender_id: string
  content: string
  message_type: 'text' | 'system' | 'file_share' | 'code_snippet' | 'sandbox_output'
  metadata?: Record<string, unknown>
  is_read: boolean
  read_at?: string
  created_at: string
  updated_at: string
}

export interface ConsultationMessageWithSender extends ConsultationMessage {
  sender?: {
    id: string
    first_name?: string
    last_name?: string
    email: string
    avatar_url?: string
  }
}

/**
 * Session summaries created by consultants
 */
export interface ConsultationSessionSummary {
  id: string
  consultation_id: string
  created_by: string
  summary?: string
  notes?: string
  action_items: Array<{
    item: string
    completed?: boolean
    due_date?: string
  }>
  key_decisions?: string[]
  follow_up_tasks?: string[]
  resources_shared?: string[]
  ai_summary?: string
  ai_generated_at?: string
  status: 'draft' | 'final' | 'archived'
  created_at: string
  updated_at: string
}

/**
 * E2B sandbox sessions
 */
export interface SandboxSession {
  id: string
  consultation_id: string
  e2b_sandbox_id: string
  e2b_template: string
  status: 'creating' | 'running' | 'paused' | 'stopped' | 'error' | 'expired'
  current_controller_id?: string
  control_mode: 'consultant' | 'client' | 'shared'
  environment_config: Record<string, unknown>
  installed_packages?: string[]
  files_snapshot: Array<{
    path: string
    size?: number
    modified_at?: string
  }>
  timeout_hours: number
  last_activity_at: string
  expires_at?: string
  error_message?: string
  created_at: string
  updated_at: string
}

export type SandboxControlMode = SandboxSession['control_mode']
export type SandboxStatus = SandboxSession['status']

/**
 * Files shared during consultations
 */
export interface ConsultationFile {
  id: string
  consultation_id: string
  uploaded_by: string
  filename: string
  original_filename: string
  storage_path: string
  storage_provider: 'supabase' | 'e2b' | 's3'
  mime_type: string
  file_size: number
  file_hash?: string
  virus_scanned: boolean
  virus_scan_result?: string
  scanned_at?: string
  is_public: boolean
  allowed_users?: string[]
  download_count: number
  retention_days: number
  expires_at?: string
  created_at: string
  deleted_at?: string
}

export interface ConsultationFileWithUploader extends ConsultationFile {
  uploader?: {
    id: string
    first_name?: string
    last_name?: string
    email: string
  }
}

/**
 * Video call logs
 */
export interface VideoCallLog {
  id: string
  consultation_id: string
  initiated_by: string
  participants: string[]
  started_at: string
  ended_at?: string
  duration_seconds?: number
  screen_shared: boolean
  screen_share_duration_seconds: number
  audio_only: boolean
  avg_video_quality?: 'poor' | 'fair' | 'good' | 'excellent'
  connection_issues: Array<{
    timestamp: string
    issue: string
    resolved?: boolean
  }>
  ice_candidates_used: unknown[]
  signaling_server?: string
  status: 'active' | 'ended' | 'failed' | 'dropped'
  end_reason?: string
  created_at: string
}

/**
 * Board Room (social lounge) posts
 */
export interface BoardRoomPost {
  id: string
  author_id: string
  content: string
  content_type: 'text' | 'announcement' | 'question' | 'tip'
  reply_to_id?: string
  thread_depth: number
  like_count: number
  reply_count: number
  is_pinned: boolean
  is_hidden: boolean
  hidden_reason?: string
  hidden_by?: string
  created_at: string
  updated_at: string
  expires_at: string
}

export interface BoardRoomPostWithAuthor extends BoardRoomPost {
  author?: {
    id: string
    first_name?: string
    last_name?: string
    email: string
    avatar_url?: string
  }
  replies?: BoardRoomPostWithAuthor[]
  user_has_liked?: boolean
}

export interface BoardRoomPostLike {
  id: string
  post_id: string
  user_id: string
  created_at: string
}

/**
 * Whiteboard snapshots
 */
export interface WhiteboardSnapshot {
  id: string
  consultation_id: string
  created_by: string
  snapshot_data: Record<string, unknown>
  canvas_format: 'tldraw' | 'excalidraw' | 'custom'
  name?: string
  description?: string
  thumbnail_url?: string
  version: number
  is_current: boolean
  created_at: string
}

/**
 * Calendar connections
 */
export interface CalendarConnection {
  id: string
  user_id: string
  provider: 'google' | 'outlook' | 'apple'
  provider_account_id?: string
  provider_email?: string
  access_token: string
  refresh_token?: string
  token_type: string
  expires_at?: string
  sync_enabled: boolean
  calendars_synced?: string[]
  last_synced_at?: string
  sync_error?: string
  created_at: string
  updated_at: string
}

export type CalendarProvider = CalendarConnection['provider']

/**
 * User presence for real-time features
 */
export interface UserPresence {
  id: string
  user_id: string
  status: 'online' | 'away' | 'busy' | 'offline'
  status_message?: string
  current_page?: string
  current_consultation_id?: string
  last_seen_at: string
  last_activity_at: string
  device_type?: string
  browser?: string
  created_at: string
  updated_at: string
}

export interface UserPresenceWithProfile extends UserPresence {
  user?: {
    id: string
    first_name?: string
    last_name?: string
    email: string
    avatar_url?: string
  }
}

export type UserStatus = UserPresence['status']

// =============================================================================
// FORM DATA TYPES
// =============================================================================

export interface SendMessageInput {
  consultation_id: string
  content: string
  message_type?: ConsultationMessage['message_type']
  metadata?: Record<string, unknown>
}

export interface CreateSandboxInput {
  consultation_id: string
  template?: string
  environment_config?: Record<string, unknown>
  timeout_hours?: number
}

export interface CreateBoardRoomPostInput {
  content: string
  content_type?: BoardRoomPost['content_type']
  reply_to_id?: string
}

export interface CreateSummaryInput {
  consultation_id: string
  summary?: string
  notes?: string
  action_items?: ConsultationSessionSummary['action_items']
  key_decisions?: string[]
  follow_up_tasks?: string[]
  resources_shared?: string[]
}

export interface UpdatePresenceInput {
  status?: UserPresence['status']
  status_message?: string
  current_page?: string
  current_consultation_id?: string
}

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

export interface ConsultationRoomData {
  consultation: ConsultationWithDetails
  messages: ConsultationMessageWithSender[]
  files: ConsultationFileWithUploader[]
  sandbox?: SandboxSession
  whiteboard?: WhiteboardSnapshot
  summary?: ConsultationSessionSummary
  video_call?: VideoCallLog
}

export interface BoardRoomData {
  posts: BoardRoomPostWithAuthor[]
  online_users: UserPresenceWithProfile[]
  pinned_posts: BoardRoomPostWithAuthor[]
}