import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase.ts';
import type { BlogPost } from '@/types';
import { Newspaper, ChevronDown } from 'lucide-react';

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data, error: queryError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false });

        if (queryError) throw queryError;
        setPosts(data ?? []);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section id="blog" className="bg-gray-50 py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-blue-900 mb-3">
            <Newspaper className="w-5 h-5" />
            <span className="text-xs tracking-[2px] uppercase font-bold">Blog de novedades</span>
          </div>
          <div className="w-16 h-0.5 bg-blue-900 mx-auto mb-6" />
          <p className="text-sm text-gray-500 max-w-lg mx-auto">
            Novedades y temas de interés para propietarios e inquilinos.
          </p>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-blue-900 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <p className="text-center text-sm text-gray-500 py-12">
            No se pudieron cargar las novedades. Intentá de nuevo más tarde.
          </p>
        )}

        {!loading && !error && posts.length === 0 && (
          <p className="text-center text-sm text-gray-500 py-12">
            Todavía no hay novedades publicadas.
          </p>
        )}

        {!loading && !error && posts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => {
              const isOpen = expanded === post.id;
              return (
                <article
                  key={post.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col"
                >
                  {post.image_url ? (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full aspect-video object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full aspect-video bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center">
                      <Newspaper className="w-10 h-10 text-white/40" />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <p className="text-xs text-gray-400 mb-2">
                      {new Date(post.created_at).toLocaleDateString('es-AR', {
                        day: 'numeric', month: 'long', year: 'numeric',
                      })}
                    </p>
                    <h3 className="text-base font-semibold text-blue-900 uppercase leading-snug mb-3">
                      {post.title}
                    </h3>
                    <p
                      className={`text-sm text-gray-600 leading-relaxed ${
                        isOpen ? '' : 'line-clamp-4'
                      }`}
                    >
                      {post.body}
                    </p>
                    <button
                      onClick={() => setExpanded(isOpen ? null : post.id)}
                      className="flex items-center gap-1 mt-4 text-xs font-semibold text-blue-900 hover:text-blue-700 transition-colors self-start"
                    >
                      {isOpen ? 'Leer menos' : 'Leer más'}
                      <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
