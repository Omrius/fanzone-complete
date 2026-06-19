import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Search, Filter, Users, Star } from 'lucide-react'
import type { Creator } from '../types'

export default function Explore() {
  const [creators, setCreators] = useState<Creator[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const categories = ['all', 'Art', 'Musique', 'Tech', 'Cuisine', 'Sport', 'Gaming', 'Mode', 'Lifestyle']

  useEffect(() => { fetchCreators() }, [])

  async function fetchCreators() {
    try {
      let query = supabase.from('creators').select('*').eq('is_verified', true)
      if (selectedCategory !== 'all') query = query.eq('category', selectedCategory)
      if (searchQuery) query = query.ilike('display_name', `%${searchQuery}%`)
      const { data, error } = await query.order('subscriber_count', { ascending: false })
      if (error) throw error
      setCreators(data || [])
    } catch (error) { console.error('Error:', error) }
    finally { setIsLoading(false) }
  }

  useEffect(() => { fetchCreators() }, [selectedCategory, searchQuery])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Explorer les createurs</h1>
        <p className="text-gray-400">Decouvrez des talents uniques a soutenir</p>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Rechercher un createur..." className="input-field pl-10" />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Filter className="w-5 h-5 text-gray-500 shrink-0" />
          {categories.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-fanzone-accent text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}>
              {cat === 'all' ? 'Tous' : cat}
            </button>
          ))}
        </div>
      </div>
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <div key={i} className="glass-card p-6 animate-pulse"><div className="h-32 bg-white/10 rounded-xl mb-4" /><div className="h-6 bg-white/10 rounded w-3/4 mb-2" /><div className="h-4 bg-white/10 rounded w-1/2" /></div>)}
        </div>
      ) : creators.length === 0 ? (
        <div className="text-center py-20"><Users className="w-16 h-16 text-gray-600 mx-auto mb-4" /><p className="text-gray-400">Aucun createur trouve</p></div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creators.map((creator) => (
            <Link key={creator.id} to={`/creator/${creator.id}`} className="glass-card overflow-hidden hover:border-fanzone-accent/30 transition-all group">
              <div className="h-32 bg-gradient-to-br from-fanzone-accent/30 to-fanzone-purple/30 relative">
                {creator.cover_url && <img src={creator.cover_url} alt="" className="w-full h-full object-cover" />}
                <div className="absolute -bottom-8 left-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-fanzone-accent to-fanzone-purple border-4 border-fanzone-card flex items-center justify-center text-xl font-bold">{creator.display_name[0]}</div>
                </div>
              </div>
              <div className="pt-10 p-6">
                <div className="flex items-start justify-between">
                  <div><h3 className="font-semibold text-lg">{creator.display_name}</h3><p className="text-sm text-gray-400">{creator.category}</p></div>
                  {creator.is_verified && <Star className="w-5 h-5 text-fanzone-accent fill-fanzone-accent" />}
                </div>
                <p className="text-sm text-gray-400 mt-3 line-clamp-2">{creator.bio}</p>
                <div className="flex items-center gap-4 mt-4 text-sm">
                  <span className="flex items-center gap-1 text-gray-400"><Users className="w-4 h-4" />{creator.subscriber_count}</span>
                  <span className="flex items-center gap-1 text-fanzone-accent">{creator.total_earnings}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}