import { loadStripe } from '@stripe/stripe-js'

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
export const stripePromise = loadStripe(stripePublishableKey)

export const PLATFORM_FEE_PERCENT = 0.15

export function calculatePlatformFee(amount: number): number {
  return Math.round(amount * PLATFORM_FEE_PERCENT * 100) / 100
}

export function calculateCreatorEarnings(amount: number): number {
  return Math.round(amount * (1 - PLATFORM_FEE_PERCENT) * 100) / 100
}