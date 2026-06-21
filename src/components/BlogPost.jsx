import { useEffect, useMemo, useState } from 'react'

const DEFAULT_IMAGE = 'https://banalia3dstudio.com/favicon.svg'

function setMetaTag(name, content, isProperty = false) {
  if (!content) return
  const selector = isProperty ? `meta[property='${name}']` : `meta[name='${name}']`
  let tag = document.head.querySelector(selector)
  if (!tag) {
    tag = document.createElement('meta')
    if (isProperty) {
      tag.setAttribute('property', name)
    } else {
      tag.setAttribute('name', name)
    }
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function setLinkRel(rel, href) {
  if (!href) return
  let link = document.head.querySelector(`link[rel='${rel}']`)
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', rel)
    document.head.appendChild(link)
  }
  link.setAttribute('href', href)
}

export default function BlogPost({ post }) {
  const [remoteContent, setRemoteContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const externalUrl = post.url && post.url.startsWith('http')
  const canonicalUrl = externalUrl
    ? post.url
    : `${window.location.origin}/?post=${post.id}`
  const pageDescription = post.excerpt || `Read ${post.title} on BANALIA3D STUDIO.`

  useEffect(() => {
    let isMounted = true
    if (!post.content) {
      fetch('/posts.json')
        .then((res) => res.json())
        .then((posts) => {
          if (!isMounted) return
          const match = posts.find((item) => item.id === post.id)
          if (match?.content) {
            setRemoteContent(match.content)
          }
        })
        .catch((err) => {
          if (!isMounted) return
          setError(err)
        })
        .finally(() => {
          if (!isMounted) return
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
    return () => {
      isMounted = false
    }
  }, [post])

  useEffect(() => {
    document.title = `${post.title} | BANALIA3D STUDIO`
    setMetaTag('description', pageDescription)
    setMetaTag('og:title', `${post.title} | BANALIA3D STUDIO`, true)
    setMetaTag('og:description', pageDescription, true)
    setMetaTag('og:url', canonicalUrl, true)
    setMetaTag('og:type', 'article', true)
    setMetaTag('twitter:title', `${post.title} | BANALIA3D STUDIO`)
    setMetaTag('twitter:description', pageDescription)
    setMetaTag('twitter:card', 'summary_large_image')
    setLinkRel('canonical', canonicalUrl)
  }, [post, pageDescription, canonicalUrl])

  const contentHtml = useMemo(() => {
    if (post.content) return post.content
    if (remoteContent) return remoteContent
    if (loading) return '<p>Loading content...</p>'
    if (error) return '<p>Unable to load the blog content right now.</p>'
    return externalUrl
      ? '<p>The full article is published on Blogger. Click the button below to read the complete post.</p>'
      : '<p>Full article content for this post is not yet available in-app. Check back soon or contact us for more details.</p>'
  }, [post, remoteContent, loading, error, externalUrl])

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: pageDescription,
    image: DEFAULT_IMAGE,
    author: {
      '@type': 'Person',
      name: 'BANALIA3D STUDIO',
    },
    publisher: {
      '@type': 'Organization',
      name: 'BANALIA3D STUDIO',
      logo: {
        '@type': 'ImageObject',
        url: DEFAULT_IMAGE,
      },
    },
    datePublished: post.date,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    keywords: post.keywords || '',
  }

  return (
    <main className="min-h-screen py-20 lg:py-24">
      <div className="section-container">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 text-sm text-cyan-300 font-semibold uppercase tracking-[0.24em]">
            {post.category}
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/50 mb-10">
            <span>{post.date}</span>
            <span>•</span>
            <span>{post.readTime || 'Read time: 5 min'}</span>
          </div>

          <div className="mb-10 prose prose-invert max-w-none text-white/80">
            <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <a
              href={externalUrl ? post.url : canonicalUrl}
              className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              {...(externalUrl ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {externalUrl ? 'Read full post on Blogger' : 'View canonical article URL'}
            </a>
            <a
              href="/?"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/80 transition hover:bg-white/10"
            >
              ← Back to home
            </a>
          </div>
        </div>
      </div>

      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </main>
  )
}
