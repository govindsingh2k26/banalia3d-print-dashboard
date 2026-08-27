import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Products from './components/Products'
import Blog from './components/Blog'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-[#F6F2ED] text-[#0A0A0A]">
      <Navbar />
      <main>
        <Hero />
        <Products />
        <Blog />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
