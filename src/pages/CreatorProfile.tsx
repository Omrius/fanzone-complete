import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Heart, MessageCircle, Share2, Lock, Star, Users } from 'lucide-react'
import type { Creator, Post } from '../types'

export default function CreatorProfile() {
  const { id } = useParams()
  const { user } = useAuth()
  const [creator, setCreator] = useState<Creator | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'posts' | 'tiers'>('posts')

  useEffect(() => { if (id) fetchCreatorData() }, [id])

  async function fetchCreatorData() {
    try {
      const [{ data: creatorData }, { data: postsData }] = await Promise.all([
        supabase.from('creators').select('*').eq('id', id).single(),
        supabase.from('posts').select('*').eq('creator_id', id).order('created_at', { ascending: false })
      ])
      setCreator(creatorData)
      setPosts(postsData || [])
    } catch (error) { console.error('Error:', error) }
    finally { setIsLoading(false) }
  }

  if (isLoading) return <div className="flex items-center justify-center min-h-screen">Chargement...</div>
  if (!creator) return <div className="text-center py-20">Createur non trouve</div>

  const isOwner = user?.id === creator.user_id

  return (
    <div>
      <div className="h-48 md:h-64 bg-gradient-to-br from-fanzone-accent/30 to-fanzone-purple/30 relative">
        {creator.cover_url && <img src={creator.cover_url} alt="" className="w-full h-full object-cover" />}
      </div>
      <div className="max-w-5xl mx-auto px-4">
        <div className="relative -mt-16 mb-8">
          <div className="flex flex-col md:flex-row items-end gap-6">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-fanzone-accent to-fanzone-purple border-4 border-fanzone-dark flex items-center justify-center text-4xl font-bold shrink-0">{creator.display_name[0]}</div>
            <div className="flex-1 pb-2">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl md:text-3xl font-bold">{creator.display_name}</h1>
                {creator.is_verified && <Star className="w-6 h-6 text-fanzone-accent fill-fanzone-accent" />}
              </div>
              <p className="text-gray-400 mb-2">{creator.category}</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-gray-400"><Users className="w-4 h-4" />{creator.subscriber_count} abonnes</span>
                <span className="flex items-center gap-1 text-gray-400"><Heart className="w-4 h-4" />{creator.total_earnings} gagnes</span>
              </div>
            </div>
            <div className="flex gap-3">
              {!isOwner && <button className="btn-primary"><Heart className="w-4 h-4 mr-2" />Soutenir</button>}
              <button className="btn-secondary"><Share2 className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
        <p className="text-gray-300 mb-8 max-w-2xl">{creator.bio}</p>
        <div className="flex gap-6 border-b border-white/10 mb-8">
          <button onClick={() => setActiveTab('posts')} className={`pb-4 text-sm font-medium transition-colors ${activeTab === 'posts' ? 'text-fanzone-accent border-b-2 border-fanzone-accent' : 'text-gray-400 hover:text-white'}`}>Publications</button>
          <button onClick={() => setActiveTab('tiers')} className={`pb-4 text-sm font-medium transition-colors ${activeTab === 'tiers' ? 'text-fanzone-accent border-b-2 border-fanzone-accent' : 'text-gray-400 hover:text-white'}`}>Abonnements</button>
        </div>
        {activeTab === 'posts' ? (
          <div className="space-y-6 pb-12">
            {posts.map((post) => (
              <div key={post.id} className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fanzone-accent to-fanzone-purple flex items-center justify-center">{creator.display_name[0]}</div>
                  <div><p className="font-medium">{creator.display_name}</p><p className="text-xs text-gray-400">Il y a 2 heures</p></div>
                </div>
                <p className="text-gray-300 mb-4">{post.content}</p>
                {post.is_premium && (
                  <div className="flex items-center gap-2 p-4 bg-fanzone-accent/10 rounded-xl border border-fanzone-accent/20">
                    <Lock className="w-5 h-5 text-fanzone-accent" />
                    <span className="text-sm">Contenu premium - Abonnez-vous pour debloquer</span>
                  </div>
                )}
                <div className="flex items-center gap-6 mt-4 text-gray-400">
                  <button className="flex items-center gap-2 hover:text-fanzone-accent transition-colors"><Heart className="w-5 h-5" />{post.likes_count}</button>
                  <button className="flex items-center gap-2 hover:text-white transition-colors"><MessageCircle className="w-5 h-5" />{post.comments_count}</button>
                  <button className="flex items-center gap-2 hover:text-white transition-colors"><Share2 className="w-5 h-5" /></button>
                </div>
              </div>
            ))}
            {posts.length === 0 && <p className="text-gray-400 text-center py-12">Aucune publication encore</p>}
          </div>
        ) : (
          <div className="pb-12"><p className="text-gray-400 text-center py-12">Tiers d'abonnement a venir</p></div>
        )}
      </div>
    </div>
  )
}