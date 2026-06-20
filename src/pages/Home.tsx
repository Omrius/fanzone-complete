import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { 
  Zap, Calendar, MapPin, ChevronRight, Music, Trophy, Mic, Gamepad2, 
  Palette, Utensils, Briefcase, Globe, Users, Heart, Star, ArrowDown
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useTranslation } from 'react-i18next'
import type { Event } from '../types'

const EVENT_CATEGORIES = [
  { id: 'sport', label: 'Sport', icon: Trophy, color: 'from-orange-500 to-red-500', bg: 'bg-orange-500/20' },
  { id: 'concert', label: 'Concert', icon: Music, color: 'from-purple-500 to-pink-500', bg: 'bg-purple-500/20' },
  { id: 'karaoke', label: 'Karaoke', icon: Mic, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/20' },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2, color: 'from-green-500 to-emerald-500', bg: 'bg-green-500/20' },
  { id: 'art', label: 'Art', icon: Palette, color: 'from-pink-500 to-rose-500', bg: 'bg-pink-500/20' },
  { id: 'culture', label: 'Culture', icon: Globe, color: 'from-amber-500 to-orange-500', bg: 'bg-amber-500/20' },
  { id: 'food', label: 'Food', icon: Utensils, color: 'from-red-500 to-orange-500', bg: 'bg-red-500/20' },
  { id: 'business', label: 'Business', icon: Briefcase, color: 'from-indigo-500 to-blue-500', bg: 'bg-indigo-500/20' },
]

const HERO_VIDEO = 'https://cdn.coverr.co/videos/coverr-neon-lights-in-the-city-4867/1080p.mp4'

export default function Home() {
  const { isAuthenticated } = useAuth()
  const { t } = useTranslation()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [userCountry, setUserCountry] = useState('FR')
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 200])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  useEffect(() => {
    detectCountry()
    fetchEvents()
  }, [])

  useEffect(() => {
    fetchEvents()
  }, [selectedCategory, userCountry])

  async function detectCountry() {
    try {
      const res = await fetch('https://ipapi.co/json/')
      const data = await res.json()
      if (data?.country_code) setUserCountry(data.country_code)
    } catch {
      setUserCountry('FR')
    }
  }

  async function fetchEvents() {
    setIsLoading(true)
    try {
      let query = supabase.from('events').select('*, creator:profiles(id, username, avatar_url)').eq('status', 'upcoming').order('event_date', { ascending: true })
      if (selectedCategory) query = query.eq('category', selectedCategory)
      query = query.eq('country', userCountry)
      const { data } = await query.limit(8)
      setEvents(data || [])
    } catch (err) { console.error(err) }
    finally { setIsLoading(false) }
  }

  const stats = [
    { label: t('home.stats.events'), value: '1.2K+', icon: Calendar },
    { label: t('home.stats.fans'), value: '50K+', icon: Users },
    { label: t('home.stats.supports'), value: '300K+', icon: Heart },
    { label: t('home.stats.countries'), value: '25+', icon: Globe },
  ]

  return (
    <div ref={containerRef}>
      {/* Hero avec video */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-40">
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black dark:from-fanzone-dark/60 dark:via-fanzone-dark/80 dark:to-fanzone-dark" />
        <div className="absolute inset-0 bg-gradient-to-r from-fanzone-accent/10 via-transparent to-fanzone-purple/10" />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-7xl mx-auto px-4 text-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8"
          >
            <Zap className="w-4 h-4 text-fanzone-accent" />
            <span className="text-sm font-medium">{t('home.hero.detectedCountry')}: {userCountry}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
          >
            {t('home.hero.title')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-10"
          >
            {t('home.hero.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link to="/events" className="btn-primary text-lg flex items-center justify-center gap-2 px-8 py-4">
              <Calendar className="w-5 h-5" /> {t('home.hero.exploreEvents')} <ChevronRight className="w-5 h-5" />
            </Link>
            {!isAuthenticated && (
              <Link to="/auth" className="btn-secondary text-lg px-8 py-4">{t('home.hero.becomeOrganizer')}</Link>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="flex justify-center"
          >
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
              <ArrowDown className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-gray-100 dark:bg-fanzone-card/30">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('home.categories.title')}</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">{t('home.categories.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {EVENT_CATEGORIES.map((cat, i) => (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                className={`glass-card p-6 text-center transition-all duration-300 ${selectedCategory === cat.id ? 'border-fanzone-accent ring-2 ring-fanzone-accent/30' : 'hover:border-white/20'}`}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} ${cat.bg} flex items-center justify-center mx-auto mb-4`}>
                  <cat.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-semibold mb-1">{cat.label}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">{t('home.stats.events')} {cat.label.toLowerCase()}</p>
              </motion.button>
            ))}
          </div>

          {/* Events list */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="glass-card p-0 animate-pulse overflow-hidden">
                    <div className="h-40 bg-gray-200 dark:bg-white/10" />
                    <div className="p-4 space-y-2">
                      <div className="h-5 bg-gray-200 dark:bg-white/10 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : events.length > 0 ? (
              <motion.div key="events" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {events.map((event, i) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link to={`/event/${event.id}`} className="glass-card p-0 overflow-hidden block hover:border-fanzone-accent/30 transition-all group">
                      <div className="h-40 bg-gradient-to-br from-fanzone-accent/30 to-fanzone-purple/30 relative overflow-hidden">
                        {event.cover_image ? (
                          <img src={event.cover_image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Calendar className="w-10 h-10 text-white/30" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-1 rounded-lg bg-fanzone-accent/90 text-xs font-semibold">{event.category}</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold mb-1 line-clamp-1">{event.title}</h3>
                        <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 mb-2">
                          <MapPin className="w-3 h-3" /> {event.city}, {event.country}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-fanzone-accent font-semibold">
                            {event.ticket_price > 0 ? `${event.ticket_price} ${t('common.currency')}` : t('events.free')}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400 text-xs">{new Date(event.event_date).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg">{t('home.emptyEvents')}</p>
                <p className="text-gray-600 dark:text-gray-500 text-sm mt-2">{t('home.emptyEventsSubtitle')}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="text-center mt-8">
            <Link to="/events" className="inline-flex items-center gap-2 text-fanzone-accent hover:underline font-medium">
              {t('home.allEvents')} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="glass-card p-6 text-center"
              >
                <stat.icon className="w-8 h-8 text-fanzone-accent mx-auto mb-3" />
                <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing for organizers */}
      <section className="py-20 bg-gradient-to-br from-fanzone-accent/5 to-fanzone-purple/5">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('home.pricing.title')}</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">{t('home.pricing.subtitle')}</p>
          </motion.div>

          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="glass-card p-8 border-2 border-fanzone-accent/30 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-fanzone-accent/20 to-fanzone-purple/20 rounded-full blur-3xl" />
              <div className="relative">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{t('home.pricing.planTitle')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{t('home.pricing.perEvent')}</p>
                </div>
                <div className="text-center mb-8">
                  <span className="text-5xl font-bold gradient-text">100</span>
                  <span className="text-xl text-gray-600 dark:text-gray-400 ml-1">{t('common.currency')}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {(t('home.pricing.features', { returnObjects: true }) as string[]).map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Star className="w-4 h-4 text-fanzone-accent shrink-0" /> {feature}
                    </li>
                  ))}
                </ul>
                <Link to={isAuthenticated ? '/create-event' : '/auth'} className="w-full btn-primary text-center block py-4">
                  {isAuthenticated ? t('home.pricing.cta') : t('nav.login')}
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">{t('home.cta.title')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">{t('home.cta.subtitle')}</p>
            <Link to="/events" className="btn-primary text-lg inline-flex items-center gap-2 px-8 py-4">
              <Zap className="w-5 h-5" /> {t('home.cta.button')}
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
