// Shared admin page styles for consistent white theme
export const adminPageStyles = {
  container: {
    minHeight: '100vh',
    background: '#f9fafb',
    color: '#111827',
    paddingTop: '64px'
  },

  header: {
    padding: '40px',
    borderBottom: '1px solid #e5e7eb',
    background: '#ffffff'
  },

  title: {
    fontSize: '32px',
    fontWeight: '100',
    letterSpacing: '0.2em',
    marginBottom: '8px',
    color: '#111827'
  },

  subtitle: {
    fontSize: '12px',
    color: '#6b7280',
    letterSpacing: '0.1em'
  },

  section: {
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '24px'
  },

  sectionTitle: {
    fontSize: '14px',
    fontWeight: '600',
    letterSpacing: '0.05em',
    marginBottom: '20px',
    color: '#111827'
  },

  input: {
    width: '100%',
    padding: '10px 14px',
    background: '#ffffff',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#111827',
    transition: 'all 0.3s'
  },

  inputFocus: {
    borderColor: '#3b82f6',
    outline: 'none',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
  },

  label: {
    display: 'block',
    marginBottom: '6px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#374151',
    letterSpacing: '0.025em'
  },

  button: {
    padding: '10px 24px',
    background: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    letterSpacing: '0.025em',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },

  buttonSecondary: {
    padding: '10px 24px',
    background: 'transparent',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    letterSpacing: '0.025em',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },

  card: {
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '16px',
    transition: 'all 0.3s'
  },

  cardHover: {
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
  },

  badge: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '500',
    letterSpacing: '0.025em'
  },

  badgeSuccess: {
    background: '#d1fae5',
    color: '#065f46'
  },

  badgeWarning: {
    background: '#fed7aa',
    color: '#92400e'
  },

  badgeError: {
    background: '#fee2e2',
    color: '#991b1b'
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse' as const
  },

  tableHeader: {
    background: '#f9fafb',
    borderBottom: '2px solid #e5e7eb',
    padding: '12px',
    textAlign: 'left' as const,
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.05em',
    color: '#374151',
    textTransform: 'uppercase' as const
  },

  tableCell: {
    padding: '12px',
    borderBottom: '1px solid #f3f4f6',
    fontSize: '14px',
    color: '#111827'
  }
}