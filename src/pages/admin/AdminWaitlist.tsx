import { useEffect } from 'react'
import AdminNavigation from '../../components/AdminNavigation'
import WaitlistManager from '../../components/admin/WaitlistManager'

const AdminWaitlist = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      paddingTop: '64px'
    }}>
      <AdminNavigation />
      <WaitlistManager />
    </div>
  )
}

export default AdminWaitlist
