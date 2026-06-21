import { motion } from 'framer-motion'
import { BLOG_POSTS } from '../data/blog'

const CATEGORY_COLORS = {
  '3D Printing Tips': { bg: 'rgba(0,212,255,0.1)', text: '#00d4ff', border: 'rgba(0,212,255,0.2)' },
  'Product Guides': { bg: 'rgba(124,58,237,0.1)', text: '#a78bfa', border: 'rgba(124,58,237,0.2)' },
  'Custom Gift Ideas': { bg: 'rgba(244,63,94,0.1)', text: '#f87171', border: 'rgba(244,63,94,0.2)' },
  'Home Decor Inspiration': { bg: 'rgba(34,197,94,0.1)', text: '#4ade80', border: 'rgba(34,197,94,0.2)' },
}

function BlogCard({ post, index }) {
  const color = CATEGORY_COLORS[post.category] || CATEGORY_COLORS['3D Printing Tips']

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="card-glow group rounded-2xl overflow-hidden cursor-pointer"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      {/* Post header banner */}
      <div
        className="h-32 flex items-center justify-center text-5xl relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${color.bg}, rgba(3,3,8,0.8))` }}
      >
        <span className="select-none">{post.emoji}</span>
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.1), rgba(124,58,237,0.1))' }}
        />
      </div>

      <div className="p-6">
        {/* Category + meta */}
        <div className="flex items-center gap-3 mb-3">
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: color.bg, color: color.text, border: `1px solid ${color.border}` }}
          >
            {post.category}
          </span>
          <span className="text-xs text-white/30">{post.readTime}</span>
        </div>

        <h3 className="text-base font-bold text-white mb-2 leading-snug group-hover:text-cyan-400 transition-colors line-clamp-2">
          {post.title}
        </h3>

        <p className="text-sm text-white/45 mb-5 line-clamp-2 leading-relaxed">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xs text-white/30">{post.date}</span>
          <a
            href={post.url && post.url.startsWith('http') ? post.url : `/?post=${post.id}`}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            {...(post.url && post.url.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            Read more →
          </a>
        </div>
      </div>
    </motion.article>
  )
}

export default function Blog() {
  const featured = BLOG_POSTS.slice(0, 3)
  const rest = BLOG_POSTS.slice(3)

  return (
    <section id="blog" className="relative bg-[#030308]">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div
        className="aurora"
        style={{ width: 400, height: 400, background: 'rgba(0,212,255,0.04)', top: 0, right: '10%' }}
      />

      <div className="section-container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="section-label">Blog & Resources</div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: 'Orbitron' }}>
            3D Printing <span className="neon-text">Insights</span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Tips, guides, and inspiration from our studio — designed to help you get the most from custom 3D printing.
          </p>
        </motion.div>

        {/* Featured posts (top 3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {featured.map((post, i) => (
            <BlogCard key={post.id} post={post} index={i} />
          ))}
        </div>

        {/* Remaining posts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post, i) => (
            <BlogCard key={post.id} post={post} index={i + 3} />
          ))}
        </div>

        {/* SEO topics note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-white/30 text-sm mb-4">Topics we cover:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['3D Printing Tips', 'Product Guides', 'Custom Gift Ideas', 'Home Decor Inspiration', 'Material Science', 'CAD Design', 'Behind the Scenes'].map((tag) => (
              <span key={tag} className="text-xs px-3 py-1.5 rounded-full glass text-white/40">
                #{tag.replace(/\s+/g, '')}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
