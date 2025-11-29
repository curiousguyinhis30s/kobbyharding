import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ContactSubmission {
  id: string
  name: string
  email: string
  subject: string
  message: string
  timestamp: string
  status: 'new' | 'read' | 'replied'
}

interface ContactStore {
  submissions: ContactSubmission[]
  addSubmission: (submission: Omit<ContactSubmission, 'id' | 'timestamp' | 'status'>) => string
  updateStatus: (id: string, status: ContactSubmission['status']) => void
  getSubmission: (id: string) => ContactSubmission | undefined
  getAllSubmissions: () => ContactSubmission[]
  getSubmissionsByStatus: (status: ContactSubmission['status']) => ContactSubmission[]
}

const useContactStore = create<ContactStore>()(
  persist(
    (set, get) => ({
      submissions: [],

      addSubmission: (submission) => {
        const id = `CONTACT-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
        const newSubmission: ContactSubmission = {
          ...submission,
          id,
          timestamp: new Date().toISOString(),
          status: 'new'
        }

        set((state) => ({
          submissions: [newSubmission, ...state.submissions]
        }))

        return id
      },

      updateStatus: (id, status) => {
        set((state) => ({
          submissions: state.submissions.map(sub =>
            sub.id === id ? { ...sub, status } : sub
          )
        }))
      },

      getSubmission: (id) => {
        return get().submissions.find(sub => sub.id === id)
      },

      getAllSubmissions: () => {
        return get().submissions
      },

      getSubmissionsByStatus: (status) => {
        return get().submissions.filter(sub => sub.status === status)
      }
    }),
    {
      name: 'contact-submissions-storage'
    }
  )
)

export default useContactStore
