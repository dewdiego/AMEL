/*
# Create blog_posts and quote_requests tables (single-tenant, no auth)

1. New Tables
- `blog_posts`: stores blog/novedades articles visible on the public site.
  - id (uuid, primary key)
  - title (text, not null) — article title
  - body (text, not null) — article content
  - image_url (text) — optional cover image URL
  - published (boolean, default true) — only published posts show on the site
  - created_at (timestamptz, default now())
- `quote_requests`: stores contact form submissions from the "Solicitar presupuesto" form.
  - id (uuid, primary key)
  - nombre (text, not null) — name of the requester
  - email (text, not null) — email contact
  - telefono (text) — optional phone
  - direccion (text) — optional building address
  - mensaje (text) — optional extra message
  - status (text, default 'pendiente') — tracking status: pendiente, contactado, cerrado
  - created_at (timestamptz, default now())

2. Security
- Enable RLS on both tables.
- blog_posts: allow anon + authenticated to read published posts; only authenticated can insert/update/delete (admin manages content).
- quote_requests: allow anon + authenticated to insert (public form submissions); only authenticated can read/update/delete (admin reviews submissions).
*/

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  image_url text,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- blog_posts: public read of published posts
DROP POLICY IF EXISTS "anon_read_published_posts" ON blog_posts;
CREATE POLICY "anon_read_published_posts" ON blog_posts FOR SELECT
  TO anon, authenticated USING (published = true);

-- blog_posts: authenticated can insert
DROP POLICY IF EXISTS "auth_insert_posts" ON blog_posts;
CREATE POLICY "auth_insert_posts" ON blog_posts FOR INSERT
  TO authenticated WITH CHECK (true);

-- blog_posts: authenticated can update
DROP POLICY IF EXISTS "auth_update_posts" ON blog_posts;
CREATE POLICY "auth_update_posts" ON blog_posts FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- blog_posts: authenticated can delete
DROP POLICY IF EXISTS "auth_delete_posts" ON blog_posts;
CREATE POLICY "auth_delete_posts" ON blog_posts FOR DELETE
  TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  email text NOT NULL,
  telefono text,
  direccion text,
  mensaje text,
  status text NOT NULL DEFAULT 'pendiente',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

-- quote_requests: public can insert (form submissions)
DROP POLICY IF EXISTS "anon_insert_quote" ON quote_requests;
CREATE POLICY "anon_insert_quote" ON quote_requests FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- quote_requests: authenticated can read (admin review)
DROP POLICY IF EXISTS "auth_read_quotes" ON quote_requests;
CREATE POLICY "auth_read_quotes" ON quote_requests FOR SELECT
  TO authenticated USING (true);

-- quote_requests: authenticated can update
DROP POLICY IF EXISTS "auth_update_quotes" ON quote_requests;
CREATE POLICY "auth_update_quotes" ON quote_requests FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- quote_requests: authenticated can delete
DROP POLICY IF EXISTS "auth_delete_quotes" ON quote_requests;
CREATE POLICY "auth_delete_quotes" ON quote_requests FOR DELETE
  TO authenticated USING (true);
