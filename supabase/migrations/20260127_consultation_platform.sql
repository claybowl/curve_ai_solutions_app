-- =============================================================================
-- CONSULTATION PLATFORM - DATABASE MIGRATION
-- =============================================================================
-- Adds tables for the consultation dashboard platform:
-- - Real-time messaging
-- - E2B sandbox tracking
-- - File uploads
-- - Video call logs
-- - Board room (social lounge)
-- - Whiteboard snapshots
-- - Calendar connections
-- - Consultation summaries
--
-- Prerequisites: consultations table must already exist (from database-migration-production.sql)

-- Enable required extensions (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- 1. CONSULTATION MESSAGES (Private Chat)
-- =============================================================================
-- Stores all private messages exchanged during consultations
-- Supports real-time and async messaging

CREATE TABLE IF NOT EXISTS consultation_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consultation_id UUID NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Message content
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'system', 'file_share', 'code_snippet', 'sandbox_output')),
    
    -- Optional metadata for different message types
    metadata JSONB DEFAULT '{}',
    
    -- Read tracking
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_consultation_messages_consultation_id 
    ON consultation_messages(consultation_id);
CREATE INDEX IF NOT EXISTS idx_consultation_messages_sender_id 
    ON consultation_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_consultation_messages_created_at 
    ON consultation_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consultation_messages_unread 
    ON consultation_messages(consultation_id, is_read) WHERE is_read = false;

-- =============================================================================
-- 2. CONSULTATION SUMMARIES
-- =============================================================================
-- Stores session summaries and notes created by consultants

CREATE TABLE IF NOT EXISTS consultation_summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consultation_id UUID NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Summary content
    summary TEXT,
    notes TEXT,
    action_items JSONB DEFAULT '[]',
    
    -- Key outcomes tracking
    key_decisions TEXT[],
    follow_up_tasks TEXT[],
    resources_shared TEXT[],
    
    -- AI-generated summary (future feature)
    ai_summary TEXT,
    ai_generated_at TIMESTAMP WITH TIME ZONE,
    
    -- Status
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'final', 'archived')),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Unique constraint: one active summary per consultation
CREATE UNIQUE INDEX IF NOT EXISTS idx_consultation_summaries_unique_active
    ON consultation_summaries(consultation_id) 
    WHERE status != 'archived';

CREATE INDEX IF NOT EXISTS idx_consultation_summaries_consultation_id 
    ON consultation_summaries(consultation_id);

-- =============================================================================
-- 3. SANDBOX SESSIONS (E2B Integration)
-- =============================================================================
-- Tracks E2B sandbox instances associated with consultations

CREATE TABLE IF NOT EXISTS sandbox_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consultation_id UUID NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,
    
    -- E2B Instance tracking
    e2b_sandbox_id TEXT NOT NULL,
    e2b_template TEXT DEFAULT 'base',
    
    -- Status and lifecycle
    status TEXT DEFAULT 'creating' CHECK (status IN ('creating', 'running', 'paused', 'stopped', 'error', 'expired')),
    
    -- Control tracking
    current_controller_id UUID REFERENCES auth.users(id),
    control_mode TEXT DEFAULT 'consultant' CHECK (control_mode IN ('consultant', 'client', 'shared')),
    
    -- Session metadata
    environment_config JSONB DEFAULT '{}',
    installed_packages TEXT[],
    
    -- Files created/modified in sandbox
    files_snapshot JSONB DEFAULT '[]',
    
    -- Timing
    timeout_hours INTEGER DEFAULT 24,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Error tracking
    error_message TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sandbox_sessions_consultation_id 
    ON sandbox_sessions(consultation_id);
CREATE INDEX IF NOT EXISTS idx_sandbox_sessions_e2b_sandbox_id 
    ON sandbox_sessions(e2b_sandbox_id);
CREATE INDEX IF NOT EXISTS idx_sandbox_sessions_status 
    ON sandbox_sessions(status);
CREATE INDEX IF NOT EXISTS idx_sandbox_sessions_expires_at 
    ON sandbox_sessions(expires_at) WHERE status = 'running';

-- =============================================================================
-- 4. FILE UPLOADS
-- =============================================================================
-- Tracks files shared during consultations

CREATE TABLE IF NOT EXISTS consultation_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consultation_id UUID NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,
    uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- File information
    filename TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    storage_provider TEXT DEFAULT 'supabase' CHECK (storage_provider IN ('supabase', 'e2b', 's3')),
    
    -- File metadata
    mime_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    file_hash TEXT,
    
    -- Security
    virus_scanned BOOLEAN DEFAULT false,
    virus_scan_result TEXT,
    scanned_at TIMESTAMP WITH TIME ZONE,
    
    -- Access control
    is_public BOOLEAN DEFAULT false,
    allowed_users UUID[],
    download_count INTEGER DEFAULT 0,
    
    -- Retention
    retention_days INTEGER DEFAULT 90,
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_consultation_files_consultation_id 
    ON consultation_files(consultation_id);
CREATE INDEX IF NOT EXISTS idx_consultation_files_uploaded_by 
    ON consultation_files(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_consultation_files_expires_at 
    ON consultation_files(expires_at) WHERE deleted_at IS NULL;

-- =============================================================================
-- 5. VIDEO CALL LOGS
-- =============================================================================
-- Tracks video call sessions during consultations

CREATE TABLE IF NOT EXISTS video_call_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consultation_id UUID NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,
    
    -- Call participants
    initiated_by UUID NOT NULL REFERENCES auth.users(id),
    participants UUID[] NOT NULL,
    
    -- Call timing
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER,
    
    -- Call features used
    screen_shared BOOLEAN DEFAULT false,
    screen_share_duration_seconds INTEGER DEFAULT 0,
    audio_only BOOLEAN DEFAULT false,
    
    -- Connection quality metrics
    avg_video_quality TEXT CHECK (avg_video_quality IN ('poor', 'fair', 'good', 'excellent')),
    connection_issues JSONB DEFAULT '[]',
    
    -- WebRTC metadata
    ice_candidates_used JSONB DEFAULT '[]',
    signaling_server TEXT,
    
    -- Status
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'ended', 'failed', 'dropped')),
    end_reason TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_video_call_logs_consultation_id 
    ON video_call_logs(consultation_id);
CREATE INDEX IF NOT EXISTS idx_video_call_logs_started_at 
    ON video_call_logs(started_at DESC);

-- =============================================================================
-- 6. BOARD ROOM POSTS (Social Lounge)
-- =============================================================================
-- Social forum for authenticated users in the waiting area

CREATE TABLE IF NOT EXISTS board_room_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Post content
    content TEXT NOT NULL,
    content_type TEXT DEFAULT 'text' CHECK (content_type IN ('text', 'announcement', 'question', 'tip')),
    
    -- Threading support
    reply_to_id UUID REFERENCES board_room_posts(id) ON DELETE CASCADE,
    thread_depth INTEGER DEFAULT 0,
    
    -- Engagement
    like_count INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    
    -- Moderation
    is_pinned BOOLEAN DEFAULT false,
    is_hidden BOOLEAN DEFAULT false,
    hidden_reason TEXT,
    hidden_by UUID REFERENCES auth.users(id),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Retention: posts auto-expire after 30 days
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days')
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_board_room_posts_author_id 
    ON board_room_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_board_room_posts_reply_to_id 
    ON board_room_posts(reply_to_id);
CREATE INDEX IF NOT EXISTS idx_board_room_posts_created_at 
    ON board_room_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_board_room_posts_pinned 
    ON board_room_posts(is_pinned) WHERE is_pinned = true;
CREATE INDEX IF NOT EXISTS idx_board_room_posts_visible 
    ON board_room_posts(created_at DESC) WHERE is_hidden = false;

-- Board room post likes (many-to-many)
CREATE TABLE IF NOT EXISTS board_room_post_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES board_room_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

-- =============================================================================
-- 7. WHITEBOARD SNAPSHOTS
-- =============================================================================
-- Stores collaborative whiteboard state for consultations

CREATE TABLE IF NOT EXISTS whiteboard_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consultation_id UUID NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Whiteboard data (tldraw/excalidraw format)
    snapshot_data JSONB NOT NULL,
    canvas_format TEXT DEFAULT 'tldraw' CHECK (canvas_format IN ('tldraw', 'excalidraw', 'custom')),
    
    -- Snapshot metadata
    name TEXT,
    description TEXT,
    thumbnail_url TEXT,
    
    -- Version tracking
    version INTEGER DEFAULT 1,
    is_current BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_whiteboard_snapshots_consultation_id 
    ON whiteboard_snapshots(consultation_id);
CREATE INDEX IF NOT EXISTS idx_whiteboard_snapshots_current 
    ON whiteboard_snapshots(consultation_id, is_current) WHERE is_current = true;

-- =============================================================================
-- 8. CALENDAR CONNECTIONS
-- =============================================================================
-- Stores OAuth tokens for Google/Outlook calendar integration

CREATE TABLE IF NOT EXISTS calendar_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Provider details
    provider TEXT NOT NULL CHECK (provider IN ('google', 'outlook', 'apple')),
    provider_account_id TEXT,
    provider_email TEXT,
    
    -- OAuth tokens (encrypted at rest via Supabase)
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    token_type TEXT DEFAULT 'Bearer',
    
    -- Token expiry
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Sync settings
    sync_enabled BOOLEAN DEFAULT true,
    calendars_synced TEXT[],
    last_synced_at TIMESTAMP WITH TIME ZONE,
    sync_error TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Unique constraint: one connection per provider per user
    UNIQUE(user_id, provider)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_calendar_connections_user_id 
    ON calendar_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_connections_expires_at 
    ON calendar_connections(expires_at);

-- =============================================================================
-- 9. PRESENCE TRACKING (for Board Room online status)
-- =============================================================================
-- Tracks user online/offline status for real-time features

CREATE TABLE IF NOT EXISTS user_presence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    
    -- Status
    status TEXT DEFAULT 'offline' CHECK (status IN ('online', 'away', 'busy', 'offline')),
    status_message TEXT,
    
    -- Location tracking
    current_page TEXT,
    current_consultation_id UUID REFERENCES consultations(id),
    
    -- Activity
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Device info
    device_type TEXT,
    browser TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for online users query
CREATE INDEX IF NOT EXISTS idx_user_presence_status 
    ON user_presence(status) WHERE status != 'offline';
CREATE INDEX IF NOT EXISTS idx_user_presence_last_seen 
    ON user_presence(last_seen_at DESC);

-- =============================================================================
-- 10. TRIGGERS FOR AUTOMATIC TIMESTAMPS
-- =============================================================================

-- Apply updated_at trigger to new tables
DO $$
BEGIN
    -- consultation_messages
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_consultation_messages_updated_at') THEN
        CREATE TRIGGER update_consultation_messages_updated_at 
            BEFORE UPDATE ON consultation_messages
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- consultation_summaries
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_consultation_summaries_updated_at') THEN
        CREATE TRIGGER update_consultation_summaries_updated_at 
            BEFORE UPDATE ON consultation_summaries
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- sandbox_sessions
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_sandbox_sessions_updated_at') THEN
        CREATE TRIGGER update_sandbox_sessions_updated_at 
            BEFORE UPDATE ON sandbox_sessions
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- board_room_posts
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_board_room_posts_updated_at') THEN
        CREATE TRIGGER update_board_room_posts_updated_at 
            BEFORE UPDATE ON board_room_posts
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- calendar_connections
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_calendar_connections_updated_at') THEN
        CREATE TRIGGER update_calendar_connections_updated_at 
            BEFORE UPDATE ON calendar_connections
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- user_presence
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_presence_updated_at') THEN
        CREATE TRIGGER update_user_presence_updated_at 
            BEFORE UPDATE ON user_presence
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- =============================================================================
-- 11. ROW LEVEL SECURITY POLICIES
-- =============================================================================

-- Enable RLS on all new tables
ALTER TABLE consultation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE sandbox_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_room_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_room_post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE whiteboard_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_presence ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- CONSULTATION MESSAGES POLICIES
-- -----------------------------------------------------------------------------
-- Users can view/send messages in their own consultations

CREATE POLICY "Users view messages in own consultations" 
    ON consultation_messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM consultations c 
            WHERE c.id = consultation_id 
            AND (c.user_id = auth.uid() OR c.assigned_consultant_id = auth.uid())
        )
    );

CREATE POLICY "Users send messages in own consultations" 
    ON consultation_messages FOR INSERT
    WITH CHECK (
        sender_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM consultations c 
            WHERE c.id = consultation_id 
            AND (c.user_id = auth.uid() OR c.assigned_consultant_id = auth.uid())
        )
    );

CREATE POLICY "Users update own messages" 
    ON consultation_messages FOR UPDATE
    USING (sender_id = auth.uid());

CREATE POLICY "Admins full access to messages" 
    ON consultation_messages FOR ALL
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
    );

-- -----------------------------------------------------------------------------
-- CONSULTATION SUMMARIES POLICIES
-- -----------------------------------------------------------------------------

CREATE POLICY "Participants view consultation summaries" 
    ON consultation_summaries FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM consultations c 
            WHERE c.id = consultation_id 
            AND (c.user_id = auth.uid() OR c.assigned_consultant_id = auth.uid())
        )
    );

CREATE POLICY "Consultants manage summaries for assigned consultations" 
    ON consultation_summaries FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM consultations c 
            WHERE c.id = consultation_id 
            AND c.assigned_consultant_id = auth.uid()
        )
    );

CREATE POLICY "Admins full access to summaries" 
    ON consultation_summaries FOR ALL
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
    );

-- -----------------------------------------------------------------------------
-- SANDBOX SESSIONS POLICIES
-- -----------------------------------------------------------------------------

CREATE POLICY "Participants view sandbox sessions" 
    ON sandbox_sessions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM consultations c 
            WHERE c.id = consultation_id 
            AND (c.user_id = auth.uid() OR c.assigned_consultant_id = auth.uid())
        )
    );

CREATE POLICY "Consultants manage sandbox sessions" 
    ON sandbox_sessions FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM consultations c 
            WHERE c.id = consultation_id 
            AND c.assigned_consultant_id = auth.uid()
        )
    );

CREATE POLICY "Clients can update control when granted" 
    ON sandbox_sessions FOR UPDATE
    USING (
        current_controller_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM consultations c 
            WHERE c.id = consultation_id 
            AND c.user_id = auth.uid()
            AND control_mode = 'client'
        )
    );

CREATE POLICY "Admins full access to sandbox sessions" 
    ON sandbox_sessions FOR ALL
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
    );

-- -----------------------------------------------------------------------------
-- CONSULTATION FILES POLICIES
-- -----------------------------------------------------------------------------

CREATE POLICY "Participants view consultation files" 
    ON consultation_files FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM consultations c 
            WHERE c.id = consultation_id 
            AND (c.user_id = auth.uid() OR c.assigned_consultant_id = auth.uid())
        )
    );

CREATE POLICY "Participants upload files to consultations" 
    ON consultation_files FOR INSERT
    WITH CHECK (
        uploaded_by = auth.uid() AND
        EXISTS (
            SELECT 1 FROM consultations c 
            WHERE c.id = consultation_id 
            AND (c.user_id = auth.uid() OR c.assigned_consultant_id = auth.uid())
        )
    );

CREATE POLICY "Uploaders can update own files" 
    ON consultation_files FOR UPDATE
    USING (uploaded_by = auth.uid());

CREATE POLICY "Admins full access to files" 
    ON consultation_files FOR ALL
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
    );

-- -----------------------------------------------------------------------------
-- VIDEO CALL LOGS POLICIES
-- -----------------------------------------------------------------------------

CREATE POLICY "Participants view call logs" 
    ON video_call_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM consultations c 
            WHERE c.id = consultation_id 
            AND (c.user_id = auth.uid() OR c.assigned_consultant_id = auth.uid())
        )
    );

CREATE POLICY "Participants log calls" 
    ON video_call_logs FOR INSERT
    WITH CHECK (
        initiated_by = auth.uid() AND
        EXISTS (
            SELECT 1 FROM consultations c 
            WHERE c.id = consultation_id 
            AND (c.user_id = auth.uid() OR c.assigned_consultant_id = auth.uid())
        )
    );

CREATE POLICY "Call initiator can update log" 
    ON video_call_logs FOR UPDATE
    USING (initiated_by = auth.uid());

CREATE POLICY "Admins full access to call logs" 
    ON video_call_logs FOR ALL
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
    );

-- -----------------------------------------------------------------------------
-- BOARD ROOM POSTS POLICIES
-- -----------------------------------------------------------------------------

CREATE POLICY "Authenticated users view visible board room posts" 
    ON board_room_posts FOR SELECT
    USING (
        auth.uid() IS NOT NULL AND
        (is_hidden = false OR author_id = auth.uid())
    );

CREATE POLICY "Authenticated users create posts" 
    ON board_room_posts FOR INSERT
    WITH CHECK (
        auth.uid() IS NOT NULL AND
        author_id = auth.uid()
    );

CREATE POLICY "Authors can update own posts" 
    ON board_room_posts FOR UPDATE
    USING (author_id = auth.uid());

CREATE POLICY "Authors can delete own posts" 
    ON board_room_posts FOR DELETE
    USING (author_id = auth.uid());

CREATE POLICY "Admins full access to board room" 
    ON board_room_posts FOR ALL
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
    );

-- Board room likes
CREATE POLICY "Authenticated users view likes" 
    ON board_room_post_likes FOR SELECT
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users manage own likes" 
    ON board_room_post_likes FOR ALL
    USING (user_id = auth.uid());

-- -----------------------------------------------------------------------------
-- WHITEBOARD SNAPSHOTS POLICIES
-- -----------------------------------------------------------------------------

CREATE POLICY "Participants view whiteboard snapshots" 
    ON whiteboard_snapshots FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM consultations c 
            WHERE c.id = consultation_id 
            AND (c.user_id = auth.uid() OR c.assigned_consultant_id = auth.uid())
        )
    );

CREATE POLICY "Participants create whiteboard snapshots" 
    ON whiteboard_snapshots FOR INSERT
    WITH CHECK (
        created_by = auth.uid() AND
        EXISTS (
            SELECT 1 FROM consultations c 
            WHERE c.id = consultation_id 
            AND (c.user_id = auth.uid() OR c.assigned_consultant_id = auth.uid())
        )
    );

CREATE POLICY "Admins full access to whiteboards" 
    ON whiteboard_snapshots FOR ALL
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
    );

-- -----------------------------------------------------------------------------
-- CALENDAR CONNECTIONS POLICIES
-- -----------------------------------------------------------------------------

CREATE POLICY "Users manage own calendar connections" 
    ON calendar_connections FOR ALL
    USING (user_id = auth.uid());

CREATE POLICY "Admins view all calendar connections" 
    ON calendar_connections FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
    );

-- -----------------------------------------------------------------------------
-- USER PRESENCE POLICIES
-- -----------------------------------------------------------------------------

CREATE POLICY "Authenticated users view presence" 
    ON user_presence FOR SELECT
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users manage own presence" 
    ON user_presence FOR ALL
    USING (user_id = auth.uid());

-- =============================================================================
-- 12. HELPER FUNCTIONS
-- =============================================================================

-- Function to update reply count on board room posts
CREATE OR REPLACE FUNCTION update_board_room_reply_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.reply_to_id IS NOT NULL THEN
        UPDATE board_room_posts 
        SET reply_count = reply_count + 1 
        WHERE id = NEW.reply_to_id;
    ELSIF TG_OP = 'DELETE' AND OLD.reply_to_id IS NOT NULL THEN
        UPDATE board_room_posts 
        SET reply_count = GREATEST(reply_count - 1, 0) 
        WHERE id = OLD.reply_to_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger for reply count
DROP TRIGGER IF EXISTS board_room_reply_count_trigger ON board_room_posts;
CREATE TRIGGER board_room_reply_count_trigger
    AFTER INSERT OR DELETE ON board_room_posts
    FOR EACH ROW EXECUTE FUNCTION update_board_room_reply_count();

-- Function to update like count on board room posts
CREATE OR REPLACE FUNCTION update_board_room_like_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE board_room_posts 
        SET like_count = like_count + 1 
        WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE board_room_posts 
        SET like_count = GREATEST(like_count - 1, 0) 
        WHERE id = OLD.post_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger for like count
DROP TRIGGER IF EXISTS board_room_like_count_trigger ON board_room_post_likes;
CREATE TRIGGER board_room_like_count_trigger
    AFTER INSERT OR DELETE ON board_room_post_likes
    FOR EACH ROW EXECUTE FUNCTION update_board_room_like_count();

-- =============================================================================
-- 13. MIGRATION COMPLETE
-- =============================================================================

SELECT 'Consultation platform migration completed successfully. Created tables: consultation_messages, consultation_summaries, sandbox_sessions, consultation_files, video_call_logs, board_room_posts, board_room_post_likes, whiteboard_snapshots, calendar_connections, user_presence.' as migration_status;
