import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MapPin, Search, Filter, Trophy, Music, Mic, Gamepad2, Palette, Globe, Utensils, Briefcase } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Event } from '../types'

const CATEGORIES = [
  { id: 'all', label: 'Tous', icon: Filter },
  { id: 'sport', label: 'Sport', icon: Trophy },
  { id: 'concert', label: 'Concert', icon: Music },
  { id: 'karaoke', label: 'Karaoke', icon: Mic },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
  { id: 'art', label: 'Art', icon: Palette },
  { id: 'culture', label: 'Culture', icon: Globe },
  { id: 'food', label: 'Food', icon: Utensils },
  { id: 'business', label: 'Business', icon: Briefcase },
]

export default function Events() {
  const { t } = useTranslation()
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [userCountry, setUserCountry] = useState('FR')
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => { detectCountry(); fetchEvents() }, [])
  useEffect(() => { fetchEvents() }, [selectedCategory, userCountry, searchQuery])

  async function detectCountry() {
    try {
      const res = await fetch('https://ipapi.co/json/')
      const data = await res.json()
      if (data?.country_code) setUserCountry(data.country_code)
    } catch { setUserCountry('FR') }
  }

  async function fetchEvents() {
    setIsLoading(true)
    try {
      let countQuery = supabase.from('events').select('*', { count: 'exact', head: true }).eq('status', 'upcoming').eq('country', userCountry)
      if (selectedCategory !== 'all') countQuery = countQuery.eq('category', selectedCategory)
      if (searchQuery) countQuery = countQuery.ilike('title', `%${searchQuery}%`)
      const { count } = await countQuery
      setTotalCount(count || 0)

      let query = supabase.from('events').select('*, creator:profiles(id, username, avatar_url)').eq('status', 'upcoming').eq('country', userCountry).order('event_date', { ascending: true })
      if (selectedCategory !== 'all') query = query.eq('category', selectedCategory)
      if (searchQuery) query = query.ilike('title', `%${searchQuery}%`)
      const { data } = await query.limit(24)
      setEvents(data || [])
    } catch (err) { console.error(err) }
    finally { setIsLoading(false) }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('events.title')}</h1>
        <p className="text-gray-400">{t('events.subtitle')} ({userCountry}) — {totalCount} {t('events.found')}</p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t('events.searchPlaceholder')} className="input-field pl-10" />
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
        {CATEGORIES.map((cat) => (
          <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === cat.id ? 'bg-fanzone-accent text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}>
            {cat.id === 'all' ? t('events.all') : cat.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card p-0 animate-pulse overflow-hidden">
                <div className="h-48 bg-white/10" />
                <div className="p-4 space-y-2">
                  <div className="h-5 bg-white/10 rounded w-3/4" />
                  <div className="h-3 bg-white/10 rounded w-1/2" />
                  <div className="h-3 bg-white/10 rounded w-2/3" />
                </div>
              </div>
            ))}
          </motion.div>
        ) : events.length > 0 ? (
          <motion.div key="events" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, i) => (
              <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link to={`/event/${event.id}`} className="glass-card p-0 overflow-hidden block hover:border-fanzone-accent/30 transition-all group">
                  <div className="h-48 bg-gradient-to-br from-fanzone-accent/30 to-fanzone-purple/30 relative overflow-hidden">
                    {event.cover_image ? (
                      <img src={event.cover_image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Calendar className="w-12 h-12 text-white/30" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 rounded-lg bg-fanzone-accent/90 text-xs font-semibold uppercase">{event.category}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">{event.title}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-400 mb-2">
                      <MapPin className="w-4 h-4" /> {event.city}, {event.country}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-400 mb-3">
                      <Calendar className="w-4 h-4" /> {new Date(event.event_date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-fanzone-accent font-bold text-lg">
                        {event.ticket_price > 0 ? `${event.ticket_price} ${t('common.currency')}` : t('events.free')}
                      </span>
                      <span className="text-xs text-gray-500 px-2 py-1 rounded bg-white/5">
                        {event.creator?.username || t('events.organizer')}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">{t('events.noEvents')}</p>
            <p className="text-gray-500 text-sm mt-2">{t('events.noEventsSubtitle')}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
