import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import {
  Zap, Calendar, MapPin, ChevronRight, Music, Trophy, Mic, Gamepad2,
  Palette, Utensils, Briefcase, Globe, Users, Heart, Star, ArrowDown,
  Search, Ticket, Shield, Sparkles
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useTranslation } from 'react-i18next'
import type { Event } from '../types'

import ScrollReveal from '../components/ScrollReveal'

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

const HERO_CARDS = [
  { label: 'Concert Live', city: 'Paris', gradient: 'from-purple-600 to-pink-500', delay: 0 },
  { label: 'Match Sport', city: 'Lyon', gradient: 'from-orange-500 to-red-500', delay: 0.15 },
  { label: 'Karaoke Night', city: 'Marseille', gradient: 'from-blue-500 to-cyan-400', delay: 0.3 },
]

const HOW_IT_WORKS_STEPS = [
  { key: 'discover', icon: Search, step: '01' },
  { key: 'book', icon: Ticket, step: '02' },
  { key: 'support', icon: Heart, step: '03' },
] as const

const TRUST_ITEMS = [
  { key: 'stripe', icon: Shield },
  { key: 'local', icon: MapPin },
  { key: 'community', icon: Users },
  { key: 'instant', icon: Sparkles },
] as const

export default function Home() {
  const { isAuthenticated } = useAuth()
  const { isDark } = useTheme()
  const { t } = useTranslation()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [userCountry, setUserCountry] = useState('FR')
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 120])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  const pricingFeatures = t('home.pricing.features', { returnObjects: true }) as string[]

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

  const titleWords = t('home.hero.title').split(' ')
  const titleMain = titleWords.slice(0, -1).join(' ')
  const titleAccent = titleWords.slice(-1)[0]

  return (
    <div ref={containerRef}>
      {/* Hero */}
      <section className="relative min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden">
        <div className="hero-glow absolute inset-0 pointer-events-none" />
        <div className={`absolute inset-0 transition-colors duration-500 ${
          isDark
            ? 'bg-gradient-to-b from-black/40 via-transparent to-transparent'
            : 'bg-gradient-to-b from-white/50 via-transparent to-transparent'
        }`} />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-7xl mx-auto px-4 w-full pt-24 pb-16 lg:pt-28"
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — copy */}
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md border mb-6 transition-colors duration-500 ${
                  isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-gray-200 shadow-sm'
                }`}
              >
                <Zap className="w-4 h-4 text-fanzone-accent" />
                <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  {t('home.hero.badge')}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className={`font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] tracking-tight ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {titleMain}{' '}
                <span className="gradient-text">{titleAccent}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className={`text-lg md:text-xl max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                {t('home.hero.subtitle')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8"
              >
                <Link to="/events" className="btn-primary text-base flex items-center justify-center gap-2 px-7 py-3.5">
                  <Calendar className="w-5 h-5" />
                  {t('home.hero.exploreEvents')}
                  <ChevronRight className="w-5 h-5" />
                </Link>
                {!isAuthenticated && (
                  <Link to="/auth" className="btn-secondary text-base px-7 py-3.5 text-center">
                    {t('home.hero.becomeOrganizer')}
                  </Link>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className={`inline-flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
              >
                <Globe className="w-4 h-4 text-fanzone-accent" />
                {t('home.hero.detectedCountry')}: <span className="font-semibold">{userCountry}</span>
              </motion.div>
            </div>

            {/* Right — floating event cards */}
            <div className="relative hidden lg:block h-[420px]">
              {HERO_CARDS.map((card, i) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 40, rotate: i === 0 ? -3 : i === 1 ? 2 : -1 }}
                  animate={{ opacity: 1, y: 0, rotate: i === 0 ? -3 : i === 1 ? 2 : -1 }}
                  transition={{ duration: 0.8, delay: 0.4 + card.delay }}
                  className="absolute glass-card overflow-hidden shadow-2xl"
                  style={{
                    width: i === 1 ? '280px' : '260px',
                    top: i === 0 ? '0' : i === 1 ? '120px' : '240px',
                    left: i === 0 ? '0' : i === 1 ? '80px' : '40px',
                    zIndex: 3 - i,
                  }}
                >
                  <div className={`h-32 bg-gradient-to-br ${card.gradient} relative`}>
                    <div className="absolute inset-0 bg-black/10" />
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ repeat: Infinity, duration: 3 + i, ease: 'easeInOut' }}
                      className="absolute bottom-3 left-3 right-3"
                    >
                      <span className="px-2 py-1 rounded-md bg-white/20 backdrop-blur text-white text-xs font-medium">
                        {card.label}
                      </span>
                    </motion.div>
                  </div>
                  <div className="p-4">
                    <div className={`h-3 rounded w-3/4 mb-2 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
                    <div className="flex items-center gap-1 text-xs text-fanzone-accent">
                      <MapPin className="w-3 h-3" /> {card.city}
                    </div>
                  </div>
                </motion.div>
              ))}
              <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.6, 0.4] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="absolute -top-8 -right-8 w-64 h-64 rounded-full bg-gradient-to-br from-fanzone-accent/30 to-fanzone-purple/20 blur-3xl pointer-events-none"
              />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex justify-center mt-12 lg:mt-8"
          >
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
              <ArrowDown className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Trust strip */}
      <section className="py-8 border-y border-gray-200/50 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal direction="fade">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {TRUST_ITEMS.map(({ key, icon: Icon }) => (
                <div
                  key={key}
                  className={`flex items-center justify-center gap-2 text-sm font-medium ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  <Icon className="w-4 h-4 text-fanzone-accent shrink-0" />
                  {t(`home.trust.${key}`)}
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h2 className={`section-heading mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {t('home.howItWorks.title')}
              </h2>
              <p className={`text-lg max-w-xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('home.howItWorks.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 relative">
              <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-fanzone-accent/30 to-transparent" />
              {HOW_IT_WORKS_STEPS.map(({ key, icon: Icon, step }, i) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass-card p-8 text-center relative group hover:border-fanzone-accent/30 transition-all duration-300"
                >
                  <span className="absolute top-4 right-4 text-xs font-bold text-fanzone-accent/40 font-display">
                    {step}
                  </span>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-fanzone-accent/20 to-fanzone-purple/20 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7 text-fanzone-accent" />
                  </div>
                  <h3 className={`font-display font-bold text-xl mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {t(`home.howItWorks.${key}.title`)}
                  </h3>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {t(`home.howItWorks.${key}.description`)}
                  </p>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Categories + Events */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className={`section-heading mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {t('home.categories.title')}
              </h2>
              <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('home.categories.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
              {EVENT_CATEGORIES.map((cat, i) => (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                  className={`glass-card p-5 text-center transition-all duration-300 ${
                    selectedCategory === cat.id
                      ? 'border-fanzone-accent ring-2 ring-fanzone-accent/20 shadow-lg shadow-fanzone-accent/10'
                      : 'hover:border-fanzone-accent/20'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} ${cat.bg} flex items-center justify-center mx-auto mb-3`}>
                    <cat.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {cat.label}
                  </h3>
                </motion.button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="glass-card p-0 animate-pulse overflow-hidden">
                      <div className={`h-36 ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`} />
                      <div className="p-4 space-y-2">
                        <div className={`h-4 rounded w-3/4 ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`} />
                        <div className={`h-3 rounded w-1/2 ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`} />
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : events.length > 0 ? (
                <motion.div key="events" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                  {events.map((event, i) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <Link
                        to={`/event/${event.id}`}
                        className="glass-card p-0 overflow-hidden block hover:border-fanzone-accent/40 hover:shadow-lg hover:shadow-fanzone-accent/5 transition-all duration-300 group"
                      >
                        <div className="h-36 bg-gradient-to-br from-fanzone-accent/30 to-fanzone-purple/30 relative overflow-hidden">
                          {event.cover_image ? (
                            <img src={event.cover_image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Calendar className="w-10 h-10 text-white/30" />
                            </div>
                          )}
                          <div className="absolute top-2.5 left-2.5">
                            <span className="px-2 py-0.5 rounded-md bg-fanzone-accent/90 text-white text-xs font-semibold capitalize">
                              {event.category}
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className={`font-semibold mb-1 line-clamp-1 text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {event.title}
                          </h3>
                          <div className={`flex items-center gap-1 text-xs mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            <MapPin className="w-3 h-3 shrink-0" />
                            {event.city}, {event.country}
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-fanzone-accent font-semibold">
                              {event.ticket_price > 0 ? `${event.ticket_price} ${t('common.currency')}` : t('events.free')}
                            </span>
                            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              {new Date(event.event_date).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 glass-card">
                  <Calendar className={`w-14 h-14 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                  <p className={`text-lg font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {t('home.emptyEvents')}
                  </p>
                  <p className={`text-sm mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {t('home.emptyEventsSubtitle')}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="text-center mt-10">
              <Link
                to="/events"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-fanzone-accent border border-fanzone-accent/30 hover:bg-fanzone-accent/10 transition-all duration-300"
              >
                {t('home.allEvents')} <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="glass-card p-6 text-center hover:border-fanzone-accent/20 transition-all duration-300"
                >
                  <stat.icon className="w-7 h-7 text-fanzone-accent mx-auto mb-3" />
                  <div className="font-display text-3xl font-bold gradient-text mb-1">{stat.value}</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className={`section-heading mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {t('home.pricing.title')}
              </h2>
              <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('home.pricing.subtitle')}
              </p>
            </div>

            <div className="max-w-lg mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-card p-8 md:p-10 border-2 border-fanzone-accent/25 relative overflow-hidden"
              >
                <div className="absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-br from-fanzone-accent/20 to-fanzone-purple/20 rounded-full blur-3xl pointer-events-none" />
                <div className="relative">
                  <div className="text-center mb-8">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-fanzone-accent/10 text-fanzone-accent mb-4">
                      {t('home.pricing.planTitle')}
                    </span>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="font-display text-6xl font-bold gradient-text">100</span>
                      <span className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {t('common.currency')}
                      </span>
                    </div>
                    <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {t('home.pricing.perEvent')}
                    </p>
                  </div>

                  <ul className="space-y-3.5 mb-8">
                    {Array.isArray(pricingFeatures) && pricingFeatures.map((feature) => (
                      <li
                        key={feature}
                        className={`flex items-center gap-3 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                      >
                        <Star className="w-4 h-4 text-fanzone-accent shrink-0 fill-fanzone-accent/20" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={isAuthenticated ? '/create-event' : '/auth'}
                    className="w-full btn-primary text-center block py-4 text-base"
                  >
                    {t('home.pricing.cta')}
                  </Link>
                </div>
              </motion.div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4">
          <ScrollReveal direction="scale">
            <div className="glass-card p-10 md:p-14 text-center relative overflow-hidden border-fanzone-accent/20">
              <div className="absolute inset-0 bg-gradient-to-br from-fanzone-accent/5 via-transparent to-fanzone-purple/5 pointer-events-none" />
              <div className="relative">
                <h2 className={`font-display text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {t('home.cta.title')}
                </h2>
                <p className={`text-lg mb-8 max-w-xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t('home.cta.subtitle')}
                </p>
                <Link to="/events" className="btn-primary text-base inline-flex items-center gap-2 px-8 py-4">
                  <Zap className="w-5 h-5" />
                  {t('home.cta.button')}
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
