import { useState } from 'react'
import { Facebook, Twitter, MessageCircle, Link as LinkIcon } from 'lucide-react'
import { useToast } from './Toast'

interface ShareButtonsProps {
  url: string
  title: string
  description?: string
  image?: string
}

const ShareButtons = ({ url, title, description, image }: ShareButtonsProps) => {
  const { addToast } = useToast()
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  // Full URL for sharing
  const shareUrl = window.location.origin + url

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        })
      } catch (err) {
        // User cancelled or error occurred
        console.log('Share cancelled')
      }
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      addToast('success', 'Link copied to clipboard')
    } catch (err) {
      addToast('error', 'Failed to copy link')
    }
  }

  const shareButtons = [
    {
      name: 'Facebook',
      icon: <Facebook size={20} />,
      onClick: () => {
        const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        window.open(fbUrl, '_blank', 'width=600,height=400')
      },
    },
    {
      name: 'Twitter',
      icon: <Twitter size={20} />,
      onClick: () => {
        const text = `${title}${description ? ' - ' + description : ''}`
        const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`
        window.open(twitterUrl, '_blank', 'width=600,height=400')
      },
    },
    {
      name: 'Pinterest',
      icon: (
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
        </svg>
      ),
      onClick: () => {
        const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(title)}${image ? `&media=${encodeURIComponent(image)}` : ''}`
        window.open(pinterestUrl, '_blank', 'width=600,height=400')
      },
    },
    {
      name: 'WhatsApp',
      icon: <MessageCircle size={20} />,
      onClick: () => {
        const text = `${title}${description ? ' - ' + description : ''}`
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`
        window.open(whatsappUrl, '_blank')
      },
    },
    {
      name: 'Copy Link',
      icon: <LinkIcon size={20} />,
      onClick: handleCopyLink,
    },
  ]

  // Use native share on mobile if available
  if (typeof navigator !== 'undefined' && 'share' in navigator && isMobile) {
    return (
      <button
        onClick={handleNativeShare}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 24px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#fff',
          fontSize: '11px',
          letterSpacing: '0.1em',
          cursor: 'pointer',
          transition: 'all 0.3s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
        }}
      >
        <LinkIcon size={16} />
        SHARE
      </button>
    )
  }

  return (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      {shareButtons.map((button) => (
        <button
          key={button.name}
          onClick={button.onClick}
          title={button.name}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '44px',
            height: '44px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.6)',
            cursor: 'pointer',
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
            e.currentTarget.style.color = '#fff'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
            e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
          }}
        >
          {button.icon}
        </button>
      ))}
    </div>
  )
}

export default ShareButtons
