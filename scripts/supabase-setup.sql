-- Fivhter Database Setup Script for Supabase
-- Run these SQL commands in your Supabase SQL Editor

-- Create tables

-- Profiles table to store user information
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Top five lists table
CREATE TABLE public.top_five_lists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- List items table (the individual items in a top five list)
CREATE TABLE public.list_items (
  id SERIAL PRIMARY KEY,
  list_id UUID REFERENCES public.top_five_lists(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  rank INTEGER NOT NULL CHECK (rank BETWEEN 1 AND 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (list_id, rank)
);

-- Comments on lists
CREATE TABLE public.comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  list_id UUID REFERENCES public.top_five_lists(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Votes on lists
CREATE TABLE public.votes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  list_id UUID REFERENCES public.top_five_lists(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (list_id, user_id)
);

-- Create views

-- View to get lists with vote and comment counts
CREATE VIEW public.lists_with_counts AS
SELECT 
  l.*,
  p.username,
  COALESCE(v.vote_count, 0) AS vote_count,
  COALESCE(c.comment_count, 0) AS comment_count
FROM 
  public.top_five_lists l
JOIN 
  public.profiles p ON l.user_id = p.id
LEFT JOIN 
  (SELECT list_id, COUNT(*) AS vote_count FROM public.votes GROUP BY list_id) v ON l.id = v.list_id
LEFT JOIN 
  (SELECT list_id, COUNT(*) AS comment_count FROM public.comments GROUP BY list_id) c ON l.id = c.list_id;

-- Functions

-- Function to create a user profile after signup
CREATE OR REPLACE FUNCTION public.create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create a profile when a user signs up
CREATE TRIGGER create_profile_on_signup
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.create_profile_for_user();

-- RLS (Row Level Security) Policies

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.top_five_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Lists policies
CREATE POLICY "Lists are viewable by everyone" 
ON public.top_five_lists FOR SELECT USING (true);

CREATE POLICY "Users can create their own lists" 
ON public.top_five_lists FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lists" 
ON public.top_five_lists FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lists" 
ON public.top_five_lists FOR DELETE USING (auth.uid() = user_id);

-- List items policies
CREATE POLICY "List items are viewable by everyone" 
ON public.list_items FOR SELECT USING (true);

CREATE POLICY "Users can create items for their own lists" 
ON public.list_items FOR INSERT WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM public.top_five_lists WHERE id = list_id
  )
);

CREATE POLICY "Users can update items for their own lists" 
ON public.list_items FOR UPDATE USING (
  auth.uid() IN (
    SELECT user_id FROM public.top_five_lists WHERE id = list_id
  )
);

CREATE POLICY "Users can delete items from their own lists" 
ON public.list_items FOR DELETE USING (
  auth.uid() IN (
    SELECT user_id FROM public.top_five_lists WHERE id = list_id
  )
);

-- Comments policies
CREATE POLICY "Comments are viewable by everyone" 
ON public.comments FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" 
ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
ON public.comments FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- Votes policies
CREATE POLICY "Votes are viewable by everyone" 
ON public.votes FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create votes" 
ON public.votes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes" 
ON public.votes FOR DELETE USING (auth.uid() = user_id);

-- Give anon and authenticated users access to the public schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Give anon and authenticated users ability to select from public tables
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;

-- Give authenticated users ability to insert, update, and delete in public tables
GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;