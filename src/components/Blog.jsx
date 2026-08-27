import React from 'react'
import { BLOG_POSTS } from '../data/blog'

export default function Blog() {
  return (
    <section id="blog" className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black mb-4 text-[#0A0A0A]">
            Blog & Inspiration
          </h2>
          <p className="text-[#0A0A0A]/60 max-w-2xl mx-auto">
            Learn tips, tricks, and inspiration for creating your perfect custom 3D printed setup.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map(post => (
            <article key={post.id} className="group bg-white rounded-lg border border-[#E8E3DD] overflow-hidden hover:shadow-lg transition">
              {/* Featured Image */}
              <div className="aspect-video bg-[#0A0A0A]/5 overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23e8e3dd%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2212%22 fill=%22%230a0a0a%22 text-anchor=%22middle%22 dy=%22.3em%22%3E%3C/text%3E%3C/svg%3E'
                  }}
                />
              </div>

              {/* Post Content */}
              <div className="p-6">
                {/* Meta */}
                <div className="flex items-center gap-2 mb-3 text-xs font-mono text-[#0A0A0A]/50 uppercase tracking-widest">
                  <span className="bg-[#E8E3DD] px-2 py-1 rounded">{post.category}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-black text-[#0A0A0A] mb-2 leading-snug">
                  {post.title}
                </h3>

                {/* Summary */}
                <p className="text-sm text-[#0A0A0A]/60 mb-4">{post.summary}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {post.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-xs text-[#0A0A0A]/40 font-mono">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Read More Link */}
                <a
                  href={`#blog/${post.slug}`}
                  className="text-sm font-bold text-[#0A0A0A] hover:opacity-60 transition inline-flex items-center gap-1"
                >
                  Read More →
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
