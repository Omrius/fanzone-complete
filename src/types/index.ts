export interface User {
  id: string
  email: string
  username: string
  avatar_url?: string
  bio?: string
  role: 'fan' | 'creator'
  stripe_onboarding_complete?: boolean
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

export interface Event {
  id: string
  creator_id: string
  title: string
  description: string
  category: 'sport' | 'concert' | 'karaoke' | 'gaming' | 'art' | 'culture' | 'food' | 'business' | 'other'
  country: string
  city: string
  event_date: string
  cover_image?: string
  ticket_price: number
  organizer_fee_paid: boolean
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  created_at: string
  creator?: User
}

export interface EventSupport {
  id: string
  event_id: string
  user_id: string
  amount: number
  type: 'support' | 'sponsor'
  message?: string
  status: 'pending' | 'completed' | 'failed'
  stripe_payment_intent_id?: string
  created_at: string
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
  type: 'tip_received' | 'tip_sent' | 'subscription' | 'payout' | 'event_organizer' | 'event_support' | 'event_sponsor'
  amount: number
  description: string
  status: 'pending' | 'completed' | 'failed'
  created_at: string
}
