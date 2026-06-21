import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Products from './components/Products'
import CustomDesign from './components/CustomDesign'
import Blog from './components/Blog'
import BlogPost from './components/BlogPost'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'
import FloatingWhatsApp from './components/FloatingWhatsApp'
import { BLOG_POSTS } from './data/blog'

export default function App() {
  const [currentPostId, setCurrentPostId] = useState(null)

  useEffect(() => {
    const parsePostId = () => {
      const params = new URLSearchParams(window.location.search)
      setCurrentPostId(params.get('post'))
    }

    parsePostId()
    window.addEventListener('popstate', parsePostId)
    return () => {
      window.removeEventListener('popstate', parsePostId)
    }
  }, [])

  const activePost = currentPostId ? BLOG_POSTS.find((post) => post.id === currentPostId) : null
  const isBlogPostRoute = Boolean(activePost)

  return (
    <div className="bg-[#030308] text-white overflow-x-hidden">
      <Navbar />
      {isBlogPostRoute ? (
        <BlogPost post={activePost} />
      ) : (
        <>
          <Hero />
          <Products />
          <CustomDesign />
          <Blog />
          <About />
          <Contact />
        </>
      )}
      <Footer />
      <FloatingWhatsApp />
    </div>
  )
}
