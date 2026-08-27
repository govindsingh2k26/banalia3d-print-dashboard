import React, { useState } from 'react'
import { PRODUCTS, CATEGORIES } from '../data/products'
import { SITE } from '../data/config'

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredProducts = selectedCategory === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === selectedCategory)

  return (
    <section id="products" className="py-20 md:py-32 bg-[#0A0A0A]/2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black mb-4 text-[#0A0A0A]">
            Featured Products
          </h2>
          <p className="text-[#0A0A0A]/60 max-w-2xl mx-auto">
            Explore our collection of custom 3D printed desk organizers, gaming accessories, and more.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-widest transition ${
                selectedCategory === category
                  ? 'bg-[#0A0A0A] text-[#F6F2ED]'
                  : 'bg-[#E8E3DD] text-[#0A0A0A] hover:bg-[#0A0A0A]/10'
              }`}
            >
              {category === 'all' ? '✨ All' : category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map(product => (
            <div key={product.id} className="group bg-white rounded-lg border border-[#E8E3DD] overflow-hidden hover:shadow-lg transition">
              {/* Product Image */}
              <div className="aspect-square bg-[#0A0A0A]/5 flex items-center justify-center overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23e8e3dd%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2212%22 fill=%22%230a0a0a%22 text-anchor=%22middle%22 dy=%22.3em%22%3E3D Print%3C/text%3E%3C/svg%3E'
                  }}
                />
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-black text-[#0A0A0A]">{product.name}</h3>
                  <span className="text-xs font-mono bg-[#E8E3DD] px-2 py-1 rounded text-[#0A0A0A]">
                    {product.category}
                  </span>
                </div>
                <p className="text-sm text-[#0A0A0A]/60 mb-4">{product.description}</p>

                {/* Price & Tags */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-black text-[#0A0A0A]">{product.priceEstimate}</span>
                  <div className="flex gap-1 flex-wrap justify-end">
                    {product.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-xs text-[#0A0A0A]/50 font-mono">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-2">
                  <a
                    href={`https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(product.whatsappMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 bg-[#0A0A0A] text-[#F6F2ED] font-bold text-xs rounded hover:opacity-80 transition text-center"
                  >
                    Order
                  </a>
                  {product.amazonUrl && (
                    <a
                      href={product.amazonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 bg-[#E8E3DD] text-[#0A0A0A] font-bold text-xs rounded hover:bg-[#0A0A0A]/10 transition text-center"
                    >
                      Amazon
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
