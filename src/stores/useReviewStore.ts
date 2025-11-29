import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Review {
  id: string
  productId: string
  rating: number // 1-5
  title: string
  content: string
  author: string
  date: Date
  helpfulCount: number
  verified: boolean
}

interface ReviewStore {
  reviews: Review[]
  addReview: (review: Omit<Review, 'id' | 'date' | 'helpfulCount'>) => void
  getReviewsByProduct: (productId: string) => Review[]
  markHelpful: (reviewId: string) => void
  getAverageRating: (productId: string) => number
  getRatingDistribution: (productId: string) => Record<number, number>
}

const useReviewStore = create<ReviewStore>()(
  persist(
    (set, get) => ({
      reviews: [
        {
          id: '1',
          productId: '1',
          rating: 5,
          title: 'Absolutely stunning piece!',
          content: 'The craftsmanship is incredible. The denim feels premium and the fit is perfect. Kobby truly creates wearable art. I wore this to a festival in Bangkok and received so many compliments!',
          author: 'Sarah M.',
          date: new Date('2024-10-15'),
          helpfulCount: 12,
          verified: true
        },
        {
          id: '2',
          productId: '1',
          rating: 4,
          title: 'Great quality, runs slightly large',
          content: 'Love the design and the story behind it. The fabric quality is excellent. Only note is that it runs a bit large, so consider sizing down if you prefer a more fitted look.',
          author: 'Miguel R.',
          date: new Date('2024-10-20'),
          helpfulCount: 8,
          verified: true
        },
        {
          id: '3',
          productId: '1',
          rating: 5,
          title: 'More than just clothing',
          content: 'When you buy from Khardingclassics, you\'re not just getting clothes - you\'re getting a piece of art with soul. The attention to detail and the cultural influences make this truly unique.',
          author: 'Elena K.',
          date: new Date('2024-11-01'),
          helpfulCount: 15,
          verified: true
        },
        {
          id: '4',
          productId: '2',
          rating: 5,
          title: 'Festival perfect!',
          content: 'Wore this to a kizomba festival and it was absolutely perfect. Comfortable, stylish, and got so many people asking where I got it. The vibe is exactly what I was looking for.',
          author: 'James D.',
          date: new Date('2024-09-28'),
          helpfulCount: 9,
          verified: true
        },
        {
          id: '5',
          productId: '3',
          rating: 4,
          title: 'Beautiful craftsmanship',
          content: 'The quality is outstanding and you can really feel the care that went into making this. It\'s unique and stands out from typical fast fashion. Worth every penny.',
          author: 'Priya S.',
          date: new Date('2024-11-05'),
          helpfulCount: 6,
          verified: true
        }
      ],

      addReview: (reviewData) => {
        const newReview: Review = {
          ...reviewData,
          id: Date.now().toString(),
          date: new Date(),
          helpfulCount: 0
        }
        set((state) => ({
          reviews: [...state.reviews, newReview]
        }))
      },

      getReviewsByProduct: (productId) => {
        return get().reviews
          .filter(review => review.productId === productId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      },

      markHelpful: (reviewId) => {
        set((state) => ({
          reviews: state.reviews.map(review =>
            review.id === reviewId
              ? { ...review, helpfulCount: review.helpfulCount + 1 }
              : review
          )
        }))
      },

      getAverageRating: (productId) => {
        const productReviews = get().getReviewsByProduct(productId)
        if (productReviews.length === 0) return 0
        const sum = productReviews.reduce((acc, review) => acc + review.rating, 0)
        return sum / productReviews.length
      },

      getRatingDistribution: (productId) => {
        const productReviews = get().getReviewsByProduct(productId)
        const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        productReviews.forEach(review => {
          distribution[review.rating]++
        })
        return distribution
      }
    }),
    {
      name: 'khardingclassics-reviews',
      partialize: (state) => ({
        reviews: state.reviews
      })
    }
  )
)

export default useReviewStore
