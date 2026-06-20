import { useState } from 'react'
import { Music, ExternalLink, X } from 'lucide-react'
import { motion } from 'framer-motion'

function extractSpotifyUri(url: string): string | null {
  const trackMatch = url.match(/track\/(\w+)/)
  if (trackMatch) return `spotify:track:${trackMatch[1]}`
  const playlistMatch = url.match(/playlist\/(\w+)/)
  if (playlistMatch) return `spotify:playlist:${playlistMatch[1]}`
  const albumMatch = url.match(/album\/(\w+)/)
  if (albumMatch) return `spotify:album:${albumMatch[1]}`
  return null
}

export default function SpotifyEmbed() {
  const [url, setUrl] = useState('')
  const [embedUrl, setEmbedUrl] = useState('')
  const [error, setError] = useState('')

  function handleEmbed() {
    const uri = extractSpotifyUri(url)
    if (!uri) {
      setError('Lien Spotify invalide. Utilisez un lien de piste, playlist ou album.')
      return
    }
    setError('')
    setEmbedUrl(`https://open.spotify.com/embed/${uri.replace(':', '/')}`)
  }

  function clear() {
    setUrl('')
    setEmbedUrl('')
    setError('')
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Music className="w-5 h-5 text-green-500" />
        <h3 className="font-bold">Ma bande-son</h3>
      </div>

      {!embedUrl ? (
        <div className="space-y-3">
          <p className="text-sm text-gray-400">Ajoutez un lien Spotify pour partager votre ambiance avec vos fans.</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://open.spotify.com/track/..."
              className="input-field flex-1 text-sm"
            />
            <button onClick={handleEmbed} className="btn-primary px-4 py-2 text-sm">
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="relative">
            <iframe
              src={embedUrl}
              width="100%"
              height="152"
              frameBorder="0"
              allow="encrypted-media"
              className="rounded-xl"
            />
            <button
              onClick={clear}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
