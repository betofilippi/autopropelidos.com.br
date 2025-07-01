-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- News table
CREATE TABLE IF NOT EXISTS news (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  url TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL,
  source_logo TEXT,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL,
  category TEXT CHECK (category IN ('regulation', 'safety', 'technology', 'urban_mobility', 'general')) NOT NULL,
  tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  relevance_score NUMERIC DEFAULT 0
);

-- Videos table
CREATE TABLE IF NOT EXISTS videos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  youtube_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  channel_name TEXT NOT NULL,
  channel_id TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration TEXT,
  view_count INTEGER,
  category TEXT CHECK (category IN ('news_report', 'educational', 'analysis', 'review', 'tutorial')) NOT NULL,
  tags TEXT[] DEFAULT '{}',
  transcript TEXT,
  relevance_score NUMERIC DEFAULT 0
);

-- Regulations table
CREATE TABLE IF NOT EXISTS regulations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  city TEXT,
  state TEXT NOT NULL,
  country TEXT DEFAULT 'Brasil',
  regulation_type TEXT CHECK (regulation_type IN ('municipal', 'state', 'federal')) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements JSONB DEFAULT '{}',
  effective_date DATE NOT NULL,
  source_url TEXT,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  category TEXT CHECK (category IN ('electric_bicycle', 'moped', 'self_propelled', 'other')) NOT NULL,
  motor_power_watts INTEGER NOT NULL,
  max_speed_kmh NUMERIC NOT NULL,
  has_pedal_assist BOOLEAN DEFAULT FALSE,
  has_throttle BOOLEAN DEFAULT FALSE,
  width_cm NUMERIC,
  wheelbase_cm NUMERIC,
  weight_kg NUMERIC,
  battery_capacity_wh INTEGER,
  price_brl NUMERIC,
  image_url TEXT,
  manufacturer_url TEXT,
  compliant_996 BOOLEAN DEFAULT FALSE,
  compliance_notes TEXT
);

-- Users table (extends Supabase auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}',
  newsletter_subscribed BOOLEAN DEFAULT FALSE,
  notification_settings JSONB DEFAULT '{}'
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  upvotes INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  answered BOOLEAN DEFAULT FALSE,
  best_answer_id UUID
);

-- Answers table
CREATE TABLE IF NOT EXISTS answers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  content TEXT NOT NULL,
  upvotes INTEGER DEFAULT 0,
  is_best_answer BOOLEAN DEFAULT FALSE
);

-- Add foreign key for best answer
ALTER TABLE questions 
ADD CONSTRAINT fk_best_answer 
FOREIGN KEY (best_answer_id) 
REFERENCES answers(id) 
ON DELETE SET NULL;

-- Analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  user_id UUID REFERENCES users(id),
  session_id TEXT NOT NULL,
  page_url TEXT NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_news_published_at ON news(published_at DESC);
CREATE INDEX idx_news_category ON news(category);
CREATE INDEX idx_news_source ON news(source);
CREATE INDEX idx_videos_published_at ON videos(published_at DESC);
CREATE INDEX idx_videos_category ON videos(category);
CREATE INDEX idx_regulations_location ON regulations(state, city);
CREATE INDEX idx_vehicles_category ON vehicles(category);
CREATE INDEX idx_vehicles_compliant ON vehicles(compliant_996);
CREATE INDEX idx_questions_user ON questions(user_id);
CREATE INDEX idx_questions_category ON questions(category);
CREATE INDEX idx_answers_question ON answers(question_id);
CREATE INDEX idx_analytics_event ON analytics(event_type);
CREATE INDEX idx_analytics_user ON analytics(user_id);

-- Enable Row Level Security
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE regulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access
CREATE POLICY "Public can read news" ON news FOR SELECT USING (true);
CREATE POLICY "Public can read videos" ON videos FOR SELECT USING (true);
CREATE POLICY "Public can read regulations" ON regulations FOR SELECT USING (true);
CREATE POLICY "Public can read vehicles" ON vehicles FOR SELECT USING (true);
CREATE POLICY "Public can read questions" ON questions FOR SELECT USING (true);
CREATE POLICY "Public can read answers" ON answers FOR SELECT USING (true);

-- RLS Policies for authenticated users
CREATE POLICY "Users can read own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can create questions" ON questions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own questions" ON questions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can create answers" ON answers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own answers" ON answers FOR UPDATE USING (auth.uid() = user_id);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();