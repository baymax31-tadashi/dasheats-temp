'use client'

import useSWR from 'swr'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, Trash2, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'

interface Review {
  id: string
  customerName: string
  itemName: string
  rating: number
  comment: string
  createdAt: string
}

interface ReviewStats {
  averageRating: number
  totalReviews: number
  reviews: Review[]
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function Reviews() {
  const { data: stats } = useSWR<ReviewStats>('/api/admin/reviews', fetcher, {
    refreshInterval: 15000
  })

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        toast.success('Review deleted successfully!')
      } else {
        toast.error('Failed to delete review')
      }
    } catch {
      toast.error('Failed to delete review')
    }
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-1 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="h-40" />
          </Card>
        ))}
      </div>
    )
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'bg-green-100 text-green-800'
    if (rating >= 3.5) return 'bg-blue-100 text-blue-800'
    if (rating >= 2.5) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-2">
                {stats.averageRating.toFixed(1)}
              </div>
              <div className="flex items-center justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(stats.averageRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : i < stats.averageRating
                        ? 'fill-yellow-200 text-yellow-400'
                        : 'text-muted-foreground'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">Average Rating</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-2">
                {stats.totalReviews}
              </div>
              <p className="text-sm text-muted-foreground">Total Reviews</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews List */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.reviews.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground font-medium">No reviews yet</p>
              <p className="text-sm text-muted-foreground mt-1">Reviews from customers will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.reviews.map((review) => (
                <div 
                  key={review.id} 
                  className="p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium">{review.customerName}</p>
                      <p className="text-sm text-muted-foreground">{review.itemName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getRatingColor(review.rating)}>
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        {review.rating}
                      </Badge>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleDeleteReview(review.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {review.comment && (
                    <p className="text-sm text-muted-foreground mb-2">
                      "{review.comment}"
                    </p>
                  )}

                  <p className="text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()} at{' '}
                    {new Date(review.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
