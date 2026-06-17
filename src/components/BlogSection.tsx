import { useState } from 'react';
import { BLOG_POSTS } from '../data/blog';
import { BlogPost } from '../types';
import { Compass, Calendar, Clock, ArrowRight, Search, Sparkles, X, ChevronRight, MessageSquare } from 'lucide-react';

export default function BlogSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [readingPost, setReadingPost] = useState<BlogPost | null>(null);

  const categories = ['All', '3D Printing Tips', 'Product Guides', 'Custom Gift Ideas', 'Home Decor Inspiration'];

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  // Safe internal parser for blog post content
  const renderBlogPostLines = (text: string) => {
    return text.split('\n').map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-2" />;
      
      if (trimmed.startsWith('### ')) {
        return <h3 key={idx} className="text-xl md:text-2xl font-bold font-display text-white mt-6 mb-3 border-l-4 border-l-cyan-400 pl-3">{trimmed.replace('### ', '')}</h3>;
      }
      if (trimmed.startsWith('#### ')) {
        return <h4 key={idx} className="text-base md:text-lg font-bold font-display text-cyan-400 mt-4 mb-2">{trimmed.replace('#### ', '')}</h4>;
      }
      if (trimmed.startsWith('- ')) {
        return (
          <div key={idx} className="flex items-start gap-2.5 my-1.5 ml-4 text-xs md:text-sm text-gray-300 leading-relaxed">
            <span className="text-cyan-400 font-bold">•</span>
            <span>{trimmed.replace('- ', '')}</span>
          </div>
        );
      }
      if (/^\d+\.\s/.test(trimmed)) {
        return (
          <div key={idx} className="flex items-start gap-2.5 my-1.5 ml-4 text-xs md:text-sm text-gray-300 leading-relaxed">
            <span className="text-purple-400 font-mono font-bold">{trimmed.match(/^\d+\.\s/)?.[0]}</span>
            <span>{trimmed.replace(/^\d+\.\s/, '')}</span>
          </div>
        );
      }
      return <p key={idx} className="text-xs md:text-sm text-gray-300 leading-relaxed mb-4">{trimmed}</p>;
    });
  };

  return (
    <section id="blog" className="py-24 relative overflow-hidden bg-transparent">
      
      {/* Background radial highlight */}
      <div className="absolute top-[30%] left-[-15%] w-96 h-96 rounded-full bg-cyan-500/2 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-xs font-mono text-cyan-400 mb-4 uppercase tracking-[3px]">
            <Compass className="w-4 h-4" />
            <span>SEO POSTING INTEGRATOR</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold font-display text-white tracking-tight leading-tight">
            Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-red-500">Knowledge Dock</span>
          </h2>
          <p className="mt-4 text-sm md:text-base text-gray-400 max-w-2xl mx-auto">
            Fresh articles, calibration tutorials, customized design handbooks, and inspiration posts. Automatically indexed to boost Banalia3D on Google Search rankings.
          </p>
        </div>

        {/* SEARCH & CATEGORY SELECTOR */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 glass-panel p-4 rounded-2xl border border-white/10 bg-[#050505]/40 backdrop-blur-md">
          
          {/* Search Input bar */}
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              id="blog-search-input"
              type="text"
              placeholder="Search keyword or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            />
          </div>

          {/* Categoric select pills */}
          <div className="flex flex-wrap gap-1.5 justify-center md:justify-end">
            {categories.map((cat) => (
              <button
                key={cat}
                id={`blog-cat-${cat.toLowerCase().replace(/[^a-z]/g, '')}`}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  activeCategory === cat 
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-400/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>

        </div>

        {/* BLOG GRID */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                id={`blog-article-card-${post.id}`}
                className="glass-panel p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md flex flex-col justify-between hover:border-cyan-400/20 transition-all duration-300 relative group overflow-hidden"
              >
                <div className="space-y-4">
                  {/* Category, Date & Read Time row */}
                  <div className="flex items-center gap-3 text-[10px] font-mono text-gray-500">
                    <span className="text-cyan-400 font-bold uppercase tracking-wider">{post.category}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.publishedDate}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold font-display text-white group-hover:text-cyan-400 transition-colors tracking-wide leading-tight mt-1">
                    {post.title}
                  </h3>
                  
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {post.summary}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {post.tags.map(tag => (
                      <span key={tag} className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-400">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-gray-500">Banalia3D Editorial Core</span>
                  
                  <button
                    id={`btn-read-post-${post.id}`}
                    onClick={() => setReadingPost(post)}
                    className="text-xs font-mono text-cyan-400 font-bold hover:text-white transition-colors flex items-center gap-1 group/btn"
                  >
                    <span>READ FULL IN-LINE POST</span>
                    <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 glass-panel rounded-3xl border border-dashed border-white/10">
            <p className="text-gray-400 font-mono text-sm">NO BLOG POSTS FOUND MATCHING "{searchQuery}"</p>
            <button
               id="btn-blog-reset-filter"
               onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
               className="mt-4 px-4 py-2 bg-white/5 hover:bg-white/10 text-xs font-mono text-cyan-400 rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>

      {/* FULL POST POPUP MODAL (Glassmorphism layout) */}
      {readingPost && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 backdrop-blur-xl bg-[#050505]/70 overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-black/90 border border-white/10 rounded-3xl shadow-2xl overflow-hidden glass-panel my-8 max-h-[90vh] flex flex-col animate-scale-up">
            
            {/* Header image banner */}
            <div className="relative h-48 md:h-64 shrink-0 bg-gray-900 overflow-hidden">
              <img
                src={readingPost.imageUrl}
                alt={readingPost.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-transparent" />
              
              <button
                id="btn-close-blog-modal"
                onClick={() => setReadingPost(null)}
                className="absolute top-4 right-4 p-2 rounded-full glass-panel border border-white/10 text-gray-400 hover:text-white hover:bg-red-500/20 active:scale-95 transition-all"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable post content context */}
            <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6">
              
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-gray-400 border-b border-white/5 pb-4">
                  <span className="text-cyan-400 font-bold uppercase tracking-widest">{readingPost.category}</span>
                  <span>•</span>
                  <span>{readingPost.publishedDate}</span>
                  <span>•</span>
                  <span>{readingPost.readTime}</span>
                </div>

                <h2 className="text-2xl md:text-4xl font-extrabold font-display text-white tracking-wide leading-tight">
                  {readingPost.title}
                </h2>

                <p className="text-xs md:text-sm text-cyan-400/90 font-mono italic p-3 bg-cyan-400/5 rounded-xl border border-cyan-400/10">
                  {readingPost.summary}
                </p>
              </div>

              {/* Decoded rich lines */}
              <div className="prose prose-invert max-w-none">
                {renderBlogPostLines(readingPost.content)}
              </div>

              {/* Bottom tags */}
              <div className="flex flex-wrap gap-2 pt-6 border-t border-white/5">
                {readingPost.tags.map(tag => (
                  <span key={tag} className="text-xs font-mono px-3 py-1 rounded bg-white/5 border border-white/5 text-gray-400">
                    #{tag}
                  </span>
                ))}
              </div>

            </div>

            {/* Sticky dialog footer with direct order call */}
            <div className="p-4 bg-black/40 border-t border-white/10 backdrop-blur-md shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-[11px] font-mono text-gray-400">Want to buy the featured premium materials?</span>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  id="btn-modal-close-fallback"
                  onClick={() => setReadingPost(null)}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono font-bold text-gray-400 hover:text-white transition-all text-center cursor-pointer"
                >
                  DISMISS CODE
                </button>
                <a
                  id="btn-modal-wa-click"
                  href={`https://wa.me/917408647600?text=${encodeURIComponent(`Hi Banalia3D! I read your post "${readingPost.title}" and want to discuss custom printing options.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial px-6 py-2.5 bg-gradient-to-r from-cyan-400 to-red-500 hover:from-cyan-500 hover:to-red-600 rounded-xl text-xs font-mono font-bold text-white shadow-xl text-center flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>DISCUSS IN WHATSAPP</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
