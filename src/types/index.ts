export interface User {
  id: string
  email: string
  username: string
  avatar_url?: string
  bio?: string
  role: 'fan' | 'creator'
  created_at: string
}

export interface Creator {
  id: string
  user_id: string
  display_name: string
  avatar_url?: string
  cover_url?: string
  bio: string
  category: string
  subscriber_count: number
  total_earnings: number
  is_verified: boolean
}

export interface Post {
  id: string
  creator_id: string
  content: string
  media_urls?: string[]
  is_premium: boolean
  price?: number
  likes_count: number
  comments_count: number
  created_at: string
}

export interface Tip {
  id: string
  fan_id: string
  creator_id: string
  amount: number
  message?: string
  is_anonymous: boolean
  status: 'pending' | 'completed' | 'failed'
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  type: 'tip_received' | 'tip_sent' | 'subscription' | 'payout'
  amount: number
  description: string
  status: 'pending' | 'completed' | 'failed'
  created_at: string
}