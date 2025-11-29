/**
 * Reusable Style Constants
 * Extracted common inline styles to reduce duplication
 */

import type { CSSProperties } from 'react'
import { BORDER_RADIUS, SPACING, FONT_SIZE, LETTER_SPACING, OPACITY } from '../constants'

// ============================================================================
// CONTAINERS
// ============================================================================

export const containerStyle: CSSProperties = {
  minHeight: '100vh',
  background: 'var(--bg-primary)',
  color: 'var(--text-primary)',
  paddingTop: '64px'
}

export const maxWidthContainer: CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 24px'
}

export const centeredContainer: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh'
}

// ============================================================================
// SECTIONS
// ============================================================================

export const sectionStyle: CSSProperties = {
  marginBottom: '24px',
  padding: '20px',
  background: 'var(--bg-tertiary)',
  border: '1px solid var(--border-primary)',
  borderRadius: BORDER_RADIUS.NONE
}

export const cardStyle: CSSProperties = {
  background: 'var(--bg-tertiary)',
  border: '1px solid var(--border-primary)',
  borderRadius: BORDER_RADIUS.MD,
  padding: '16px',
  transition: 'all 0.3s ease'
}

export const glassCard: CSSProperties = {
  background: 'var(--bg-hover)',
  border: '1px solid var(--border-secondary)',
  backdropFilter: 'blur(20px)',
  borderRadius: BORDER_RADIUS.MD,
  padding: '20px'
}

// ============================================================================
// INPUTS
// ============================================================================

export const inputStyle: CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  background: 'var(--input-bg)',
  border: '1px solid var(--border-secondary)',
  borderRadius: BORDER_RADIUS.MD,
  color: 'var(--text-primary)',
  fontSize: FONT_SIZE.MD,
  fontFamily: 'inherit',
  transition: 'all 0.3s'
}

export const inputFocusStyle: CSSProperties = {
  borderColor: 'rgba(255, 255, 255, 0.2)',
  outline: 'none'
}

export const inputErrorStyle: CSSProperties = {
  borderColor: '#ef4444'
}

export const labelStyle: CSSProperties = {
  display: 'block',
  marginBottom: SPACING.SM,
  fontSize: FONT_SIZE.SM,
  fontWeight: '400',
  letterSpacing: LETTER_SPACING.NORMAL,
  color: 'var(--text-secondary)',
  textTransform: 'uppercase'
}

export const errorMessageStyle: CSSProperties = {
  color: '#ef4444',
  fontSize: FONT_SIZE.SM,
  marginTop: '4px'
}

// ============================================================================
// BUTTONS
// ============================================================================

export const buttonBaseStyle: CSSProperties = {
  padding: '12px 24px',
  border: 'none',
  borderRadius: BORDER_RADIUS.NONE,
  fontSize: FONT_SIZE.MD,
  fontWeight: '300',
  letterSpacing: LETTER_SPACING.WIDER,
  textTransform: 'uppercase',
  cursor: 'pointer',
  transition: 'all 0.3s',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: SPACING.SM
}

export const primaryButtonStyle: CSSProperties = {
  ...buttonBaseStyle,
  background: 'var(--accent-primary)',
  color: 'var(--bg-primary)'
}

export const secondaryButtonStyle: CSSProperties = {
  ...buttonBaseStyle,
  background: 'transparent',
  color: 'var(--text-primary)',
  border: '1px solid var(--border-hover)'
}

export const outlineButtonStyle: CSSProperties = {
  ...buttonBaseStyle,
  background: 'transparent',
  border: '1px solid var(--border-primary)',
  color: 'var(--text-muted)'
}

export const disabledButtonStyle: CSSProperties = {
  opacity: OPACITY.VISIBLE,
  cursor: 'not-allowed'
}

export const buttonFullWidthStyle: CSSProperties = {
  width: '100%'
}

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const headingStyle: CSSProperties = {
  fontSize: FONT_SIZE.XL,
  fontWeight: '200',
  letterSpacing: LETTER_SPACING.WIDEST,
  color: 'var(--text-primary)'
}

export const subheadingStyle: CSSProperties = {
  fontSize: FONT_SIZE.LG,
  fontWeight: '300',
  letterSpacing: LETTER_SPACING.WIDE,
  color: 'var(--text-primary)'
}

export const sectionTitleStyle: CSSProperties = {
  fontSize: FONT_SIZE.XS,
  fontWeight: '300',
  letterSpacing: LETTER_SPACING.WIDER,
  color: 'var(--text-secondary)',
  textTransform: 'uppercase'
}

export const bodyTextStyle: CSSProperties = {
  fontSize: FONT_SIZE.BASE,
  lineHeight: '1.6',
  color: 'var(--text-secondary)'
}

export const mutedTextStyle: CSSProperties = {
  fontSize: FONT_SIZE.SM,
  color: 'var(--text-muted)'
}

// ============================================================================
// LAYOUT
// ============================================================================

export const flexRowStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center'
}

export const flexColumnStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column'
}

export const flexCenterStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}

export const flexBetweenStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}

export const gridTwoColumns: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: SPACING.LG
}

export const gridThreeColumns: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: SPACING.LG
}

// ============================================================================
// BORDERS & DIVIDERS
// ============================================================================

export const borderTopStyle: CSSProperties = {
  borderTop: '1px solid var(--border-primary)'
}

export const borderBottomStyle: CSSProperties = {
  borderBottom: '1px solid var(--border-primary)'
}

export const dividerStyle: CSSProperties = {
  height: '1px',
  background: 'var(--border-primary)',
  margin: `${SPACING.XL} 0`
}

// ============================================================================
// HEADERS
// ============================================================================

export const headerStyle: CSSProperties = {
  borderBottom: '1px solid var(--border-primary)',
  background: 'var(--overlay)',
  backdropFilter: 'blur(8px)'
}

export const headerContainerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '64px',
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 24px'
}

// ============================================================================
// NAVIGATION
// ============================================================================

export const navLinkStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: SPACING.SM,
  color: 'var(--text-muted)',
  background: 'none',
  border: 'none',
  fontSize: FONT_SIZE.BASE,
  fontWeight: '300',
  letterSpacing: LETTER_SPACING.WIDE,
  cursor: 'pointer',
  transition: 'all 0.3s',
  textDecoration: 'none'
}

export const navLinkActiveStyle: CSSProperties = {
  color: 'var(--text-primary)'
}

// ============================================================================
// MODALS & OVERLAYS
// ============================================================================

export const overlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.8)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
}

export const modalStyle: CSSProperties = {
  background: '#ffffff',
  borderRadius: BORDER_RADIUS.LG,
  padding: SPACING.XXL,
  maxWidth: '500px',
  width: '90%',
  maxHeight: '90vh',
  overflowY: 'auto',
  position: 'relative'
}

export const modalHeaderStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: SPACING.XL
}

// ============================================================================
// BADGES & TAGS
// ============================================================================

export const badgeStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '4px 12px',
  borderRadius: BORDER_RADIUS.XL,
  fontSize: FONT_SIZE.XS,
  fontWeight: '500',
  letterSpacing: LETTER_SPACING.NORMAL
}

export const successBadgeStyle: CSSProperties = {
  ...badgeStyle,
  background: 'rgba(34, 197, 94, 0.1)',
  color: '#22c55e',
  border: '1px solid rgba(34, 197, 94, 0.3)'
}

export const errorBadgeStyle: CSSProperties = {
  ...badgeStyle,
  background: 'rgba(239, 68, 68, 0.1)',
  color: '#ef4444',
  border: '1px solid rgba(239, 68, 68, 0.3)'
}

export const warningBadgeStyle: CSSProperties = {
  ...badgeStyle,
  background: 'rgba(249, 115, 22, 0.1)',
  color: '#f97316',
  border: '1px solid rgba(249, 115, 22, 0.3)'
}

export const infoBadgeStyle: CSSProperties = {
  ...badgeStyle,
  background: 'rgba(59, 130, 246, 0.1)',
  color: '#3b82f6',
  border: '1px solid rgba(59, 130, 246, 0.3)'
}

// ============================================================================
// IMAGES
// ============================================================================

export const imageStyle: CSSProperties = {
  width: '100%',
  height: 'auto',
  objectFit: 'cover',
  display: 'block'
}

export const roundedImageStyle: CSSProperties = {
  ...imageStyle,
  borderRadius: BORDER_RADIUS.MD
}

export const circularImageStyle: CSSProperties = {
  ...imageStyle,
  borderRadius: BORDER_RADIUS.ROUND,
  aspectRatio: '1/1'
}

// ============================================================================
// LOADING & SKELETON
// ============================================================================

export const skeletonStyle: CSSProperties = {
  background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite'
}

export const spinnerStyle: CSSProperties = {
  animation: 'spin 1s linear infinite'
}

// ============================================================================
// UTILITY CLASSES
// ============================================================================

export const truncateStyle: CSSProperties = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
}

export const noScrollbarStyle: CSSProperties = {
  scrollbarWidth: 'none',
  msOverflowStyle: 'none'
}

export const smoothScrollStyle: CSSProperties = {
  scrollBehavior: 'smooth'
}

// ============================================================================
// ANIMATIONS (CSS-in-JS)
// ============================================================================

export const fadeInAnimation: CSSProperties = {
  animation: 'fadeIn 0.3s ease-in-out'
}

export const slideUpAnimation: CSSProperties = {
  animation: 'slideUp 0.3s ease-out'
}

// ============================================================================
// HOVER STATES (helpers for applying in components)
// ============================================================================

export const buttonHoverState = {
  transform: 'translateY(-2px)',
  boxShadow: '0 10px 30px rgba(255, 255, 255, 0.1)'
}

export const cardHoverState = {
  transform: 'translateY(-4px)',
  borderColor: 'rgba(255, 255, 255, 0.2)',
  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)'
}

export const linkHoverState = {
  color: '#ffffff',
  transform: 'translateX(4px)'
}
