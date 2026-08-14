-- Selfish app database schema
-- Run with: supabase db push

-- Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  birth_date DATE,
  memory_enabled BOOLEAN DEFAULT FALSE,
  intensity_preference TEXT DEFAULT 'warm' CHECK (intensity_preference IN ('soft', 'warm', 'bold')),
  self_feeling TEXT CHECK (self_feeling IN ('soft', 'playful', 'bold')),
  self_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Personas (seeded, admin-managed)
CREATE TABLE IF NOT EXISTS personas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  voice_id TEXT,
  system_prompt TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scenarios (seeded)
CREATE TABLE IF NOT EXISTS scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  persona_id UUID REFERENCES personas(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  opening_line TEXT NOT NULL,
  intensity TEXT DEFAULT 'warm' CHECK (intensity IN ('soft', 'warm', 'bold')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Whisper sessions
CREATE TABLE IF NOT EXISTS whisper_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  persona_id UUID REFERENCES personas(id),
  scenario_id UUID REFERENCES scenarios(id),
  intensity TEXT DEFAULT 'warm',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  message_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

-- Messages
CREATE TABLE IF NOT EXISTS whisper_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES whisper_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  audio_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions (synced from RevenueCat)
CREATE TABLE IF NOT EXISTS subscriptions (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'free' CHECK (status IN ('free', 'active', 'expired', 'trial')),
  product_id TEXT,
  expires_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE whisper_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE whisper_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view own sessions" ON whisper_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own sessions" ON whisper_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own messages" ON whisper_messages FOR SELECT USING (
  session_id IN (SELECT id FROM whisper_sessions WHERE user_id = auth.uid())
);
CREATE POLICY "Users can view own subscription" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
