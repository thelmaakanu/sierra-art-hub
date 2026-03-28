
-- Artworks table
CREATE TABLE public.artworks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'Painting',
  image_url TEXT,
  sold BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.artworks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view artworks" ON public.artworks FOR SELECT TO public USING (true);
CREATE POLICY "Artists can insert own artworks" ON public.artworks FOR INSERT TO authenticated WITH CHECK (auth.uid() = artist_id);
CREATE POLICY "Artists can update own artworks" ON public.artworks FOR UPDATE TO authenticated USING (auth.uid() = artist_id);
CREATE POLICY "Artists can delete own artworks" ON public.artworks FOR DELETE TO authenticated USING (auth.uid() = artist_id);

-- Exhibition tickets table
CREATE TABLE public.exhibition_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exhibition_title TEXT NOT NULL,
  buyer_id UUID NOT NULL,
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  total_price NUMERIC NOT NULL DEFAULT 0,
  purchased_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.exhibition_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tickets" ON public.exhibition_tickets FOR SELECT TO authenticated USING (auth.uid() = buyer_id);
CREATE POLICY "Users can buy tickets" ON public.exhibition_tickets FOR INSERT TO authenticated WITH CHECK (auth.uid() = buyer_id);

-- Exhibition join requests (artist wants to join an exhibition)
CREATE TABLE public.exhibition_join_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exhibition_id TEXT NOT NULL,
  artist_id UUID NOT NULL,
  artist_name TEXT NOT NULL,
  portfolio_link TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.exhibition_join_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Artists can create join requests" ON public.exhibition_join_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = artist_id);
CREATE POLICY "Artists can view own requests" ON public.exhibition_join_requests FOR SELECT TO authenticated USING (auth.uid() = artist_id);
CREATE POLICY "Admins can view all requests" ON public.exhibition_join_requests FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update requests" ON public.exhibition_join_requests FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Host exhibition requests
CREATE TABLE public.host_exhibition_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  exhibition_idea TEXT NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.host_exhibition_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create host requests" ON public.host_exhibition_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own host requests" ON public.host_exhibition_requests FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all host requests" ON public.host_exhibition_requests FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Community posts
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view posts" ON public.posts FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated users can create posts" ON public.posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can delete own posts" ON public.posts FOR DELETE TO authenticated USING (auth.uid() = author_id);

-- Comments
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view comments" ON public.comments FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated users can create comments" ON public.comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can delete own comments" ON public.comments FOR DELETE TO authenticated USING (auth.uid() = author_id);

-- Likes
CREATE TABLE public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, post_id),
  UNIQUE(user_id, comment_id)
);

ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view likes" ON public.likes FOR SELECT TO public USING (true);
CREATE POLICY "Users can like" ON public.likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike" ON public.likes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Contact form submissions
CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact form" ON public.contact_submissions FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Admins can view submissions" ON public.contact_submissions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at on artworks
CREATE TRIGGER update_artworks_updated_at
  BEFORE UPDATE ON public.artworks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
