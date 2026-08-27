/**
 * BANALIA3D v2 Configuration
 * Update these values to change site-wide branding and contact info
 */

export const SITE = {
  name: 'BANALIA3D',
  tagline: 'Custom 3D Printed Desk & Gaming Accessories',
  description: 'Premium custom 3D printing studio in Noida, India. Fast dispatch, 7-day exchange guarantee.',
  location: 'Noida, Uttar Pradesh, India',
  email: 'govind@banalia3dstudio.com',
  whatsappNumber: '917408647600',
  instagramUrl: 'https://www.instagram.com/banalia3d/',
  youtubeUrl: 'https://www.youtube.com/@Banalia3DStudio',
  amazonUrl: 'https://www.amazon.in',
  meeshoUrl: 'https://www.meesho.com',
}

export const SOCIAL = [
  {
    name: 'Instagram',
    url: SITE.instagramUrl,
    icon: '📷',
  },
  {
    name: 'YouTube',
    url: SITE.youtubeUrl,
    icon: '▶️',
  },
  {
    name: 'WhatsApp',
    url: `https://wa.me/${SITE.whatsappNumber}`,
    icon: '💬',
  },
]

export const STATS = [
  { label: 'Prints Shipped', value: '5,000+' },
  { label: 'Google Rating', value: '4.9★' },
  { label: 'Layer Precision', value: '0.04mm' },
]
