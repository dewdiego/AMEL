export interface BlogPost {
  id: string;
  title: string;
  body: string;
  image_url: string | null;
  published: boolean;
  created_at: string;
}

export interface QuoteRequest {
  id: string;
  nombre: string;
  email: string;
  telefono: string | null;
  direccion: string | null;
  mensaje: string | null;
  status: string;
  created_at: string;
}
