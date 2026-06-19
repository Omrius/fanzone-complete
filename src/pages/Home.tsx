import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Zap, Heart, DollarSign, Users, ArrowRight, Star } from 'lucide-react'

export default function Home() {
  const { isAuthenticated } = useAuth()

  const features = [
    { icon: Heart, title: 'Soutenez', description: 'Decouvrez et soutenez vos createurs preferes' },
    { icon: DollarSign, title: 'Gagnez', description: 'Monetisez votre contenu et votre communaute' },
    { icon: Users, title: 'Connectez', description: 'Interagissez directement avec vos fans' },
    { icon: Star, title: 'Exclusivite', description: 'Accedez a du contenu premium reserve' },
  ]

  const topCreators = [
    { id: '1', name: 'Alice Art', category: 'Art Digital', subscribers: '12.5K', earnings: '45K' },
    { id: '2', name: 'MusikMaker', category: 'Musique', subscribers: '8.2K', earnings: '32K' },
    { id: '3', name: 'TechGuru', category: 'Tech', subscribers: '24K', earnings: '89K' },
    { id: '4', name: 'ChefMarie', category: 'Cuisine', subscribers: '15K', earnings: '56K' },
  ]

  return (
    <div>
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-fanzone-accent/20 via-fanzone-purple/10 to-fanzone-blue/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-8">
            <Zap className="w-4 h-4 text-fanzone-accent" />
            <span className="text-sm font-medium">La plateforme des createurs</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Soutenez ce qui vous <br /><span className="gradient-text">inspire vraiment</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            FANZONE connecte les fans avec leurs createurs preferes. Tips, abonnements exclusifs et contenu premium.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/explore" className="btn-primary text-lg flex items-center justify-center gap-2">
              Explorer les createurs <ArrowRight className="w-5 h-5" />
            </Link>
            {!isAuthenticated && (
              <Link to="/auth" className="btn-secondary text-lg">Devenir createur</Link>
            )}
          </div>
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-16">
            <div><div className="text-3xl font-bold gradient-text">50K+</div><div className="text-sm text-gray-400">Createurs</div></div>
            <div><div className="text-3xl font-bold gradient-text">2M+</div><div className="text-sm text-gray-400">Fans</div></div>
            <div><div className="text-3xl font-bold gradient-text">5M+</div><div className="text-sm text-gray-400">Tips envoyes</div></div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-fanzone-card/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Comment ca marche</h2>
            <p className="text-gray-400">Simple, rapide, transparent</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="glass-card p-6 hover:border-fanzone-accent/30 transition-all">
                <f.icon className="w-10 h-10 text-fanzone-accent mb-4" />
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div><h2 className="text-3xl font-bold mb-2">Createurs populaires</h2><p className="text-gray-400">Ils trustent la communaute FANZONE</p></div>
            <Link to="/explore" className="text-fanzone-accent hover:underline flex items-center gap-1">Voir tout <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topCreators.map((c) => (
              <Link key={c.id} to={`/creator/${c.id}`} className="glass-card p-6 hover:border-fanzone-accent/30 transition-all group">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-fanzone-accent to-fanzone-purple mb-4 mx-auto flex items-center justify-center text-2xl">{c.name[0]}</div>
                <h3 className="text-lg font-semibold text-center mb-1">{c.name}</h3>
                <p className="text-sm text-gray-400 text-center mb-4">{c.category}</p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">{c.subscribers} fans</span>
                  <span className="text-fanzone-accent">{c.earnings}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-fanzone-accent/10 to-fanzone-purple/10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Pret a rejoindre le mouvement ?</h2>
          <p className="text-xl text-gray-400 mb-8">Que vous soyez fan ou createur, FANZONE est fait pour vous.</p>
          <Link to="/auth" className="btn-primary text-lg inline-flex items-center gap-2">
            <Zap className="w-5 h-5" />Commencer gratuitement
          </Link>
        </div>
      </section>
    </div>
  )
}