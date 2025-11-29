import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Zap, MessageSquare, Gift, Heart } from 'lucide-react'
import { useMobileOptimization } from './MobileOptimization'

interface StyleGroup {
  id: string
  name: string
  members: number
  vibe: string
  outfitPlan: string
  memberNames: string[]
  image?: string
}

interface Festival {
  id: string
  name: string
  date: string
  location: string
  attendees: number
}

interface FestivalTwinsProps {
  currentUser: {
    id: string
    name: string
    upcomingFestivals: Festival[]
    preferredVibes: string[]
    style: string
  }
  matchedUsers: Array<{
    id: string
    name: string
    location: string
    festivals: Festival[]
    vibes: string[]
    imageUrl: string
    bio: string
    commonFestivals: Festival[]
  }>
  onConnect?: (userId: string) => void
  onJoinGroup?: (groupId: string) => void
}

export const FestivalTwins = ({
  matchedUsers,
  onConnect,
  onJoinGroup
}: FestivalTwinsProps) => {
  useMobileOptimization()
  const [viewMode, setViewMode] = useState<'matches' | 'groups' | 'outfits'>('matches')
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [styleGroups, setStyleGroups] = useState<StyleGroup[]>([])
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null)

  // Demo groups
  useEffect(() => {
    setStyleGroups([
      {
        id: '1',
        name: 'Minimalist Denim',
        members: 12,
        vibe: 'clean, minimal, sophisticated',
        outfitPlan: 'All black with statement denim piece',
        memberNames: ['Alex', 'Jordan', 'Casey', 'Morgan'],
        image: 'https://via.placeholder.com/400x300?text=Minimalist+Group'
      },
      {
        id: '2',
        name: 'Maximalist Vibes',
        members: 8,
        vibe: 'bold, experimental, colorful',
        outfitPlan: 'Mix patterns & textures with confidence',
        memberNames: ['Sam', 'Riley', 'Taylor', 'Quinn'],
        image: 'https://via.placeholder.com/400x300?text=Maximalist+Group'
      }
    ])
  }, [])

  return (
    <div className="w-full bg-black text-white">
      {/* Header */}
      <div className="px-4 md:px-8 pt-8 pb-6">
        <h2 className="text-2xl md:text-4xl font-light tracking-tight mb-2">
          Festival Twins
        </h2>
        <p className="text-xs md:text-sm text-gray-400 tracking-widest uppercase">
          Connect with people at your festivals
        </p>
      </div>

      {/* View Mode Tabs */}
      <div className="px-4 md:px-8 flex gap-2 md:gap-4 mb-8 border-b border-white/10">
        {(['matches', 'groups', 'outfits'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-4 md:px-6 py-3 text-xs md:text-sm font-medium tracking-widest uppercase transition-all ${
              viewMode === mode
                ? 'text-white border-b-2 border-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {mode === 'matches' && '👥 Matches'}
            {mode === 'groups' && '👫 Groups'}
            {mode === 'outfits' && '👗 Outfits'}
          </button>
        ))}
      </div>

      {/* Matches View */}
      {viewMode === 'matches' && (
        <div className="px-4 md:px-8 mb-8">
          <div className="space-y-4">
            {matchedUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
                className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg overflow-hidden cursor-pointer transition-all"
              >
                <div className="flex gap-4 p-4">
                  {/* User Image */}
                  <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-900">
                    <img
                      src={user.imageUrl}
                      alt={user.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-light text-base">{user.name}</h3>
                        <p className="text-xs text-gray-400">
                          {user.location}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-600/20 border border-blue-600/50 rounded-full flex-shrink-0">
                        <Zap className="w-3 h-3 text-blue-400" />
                        <span className="text-xs font-medium">
                          {user.commonFestivals.length}
                        </span>
                      </div>
                    </div>

                    {/* Common Festivals */}
                    {user.commonFestivals.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1.5">
                          Same festivals
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {user.commonFestivals.slice(0, 2).map((festival) => (
                            <span
                              key={festival.id}
                              className="text-xs px-2 py-1 bg-white/10 border border-white/20 rounded text-gray-200"
                            >
                              {festival.name}
                            </span>
                          ))}
                          {user.commonFestivals.length > 2 && (
                            <span className="text-xs px-2 py-1 bg-white/10 border border-white/20 rounded text-gray-400">
                              +{user.commonFestivals.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Vibes */}
                    <div className="flex flex-wrap gap-1">
                      {user.vibes.slice(0, 2).map((vibe) => (
                        <span
                          key={vibe}
                          className="text-xs px-2 py-0.5 bg-purple-600/20 border border-purple-600/50 rounded-full text-purple-300"
                        >
                          {vibe}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {selectedUser === user.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-black/40 border-t border-white/10 p-4 space-y-4"
                    >
                      <div>
                        <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                          Bio
                        </p>
                        <p className="text-sm text-gray-300">{user.bio}</p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                          All Vibes
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {user.vibes.map((vibe) => (
                            <span
                              key={vibe}
                              className="text-xs px-2.5 py-1 bg-purple-600/20 border border-purple-600/50 rounded-full text-purple-300"
                            >
                              {vibe}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                          onClick={() => onConnect?.(user.id)}
                          className="bg-white/10 hover:bg-white/20 rounded px-3 py-2 text-xs font-medium transition-all flex items-center justify-center gap-2"
                        >
                          <MessageSquare className="w-3 h-3" />
                          Message
                        </button>
                        <button
                          className="bg-blue-600 hover:bg-blue-700 rounded px-3 py-2 text-xs font-medium transition-all flex items-center justify-center gap-2"
                        >
                          <Heart className="w-3 h-3" />
                          Follow
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Style Groups View */}
      {viewMode === 'groups' && (
        <div className="px-4 md:px-8 mb-8 space-y-4">
          {styleGroups.map((group, index) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-lg overflow-hidden"
            >
              {/* Group Header */}
              <button
                onClick={() =>
                  setExpandedGroup(expandedGroup === group.id ? null : group.id)
                }
                className="w-full text-left p-4 hover:bg-white/10 transition-colors flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-light text-base">{group.name}</h3>
                      <p className="text-xs text-gray-400">
                        {group.members} members
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-blue-400 font-medium flex-shrink-0">
                  {expandedGroup === group.id ? '−' : '+'}
                </div>
              </button>

              {/* Group Details */}
              <AnimatePresence>
                {expandedGroup === group.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-black/40 border-t border-white/10 p-4 space-y-4"
                  >
                    <div>
                      <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                        Vibe
                      </p>
                      <p className="text-sm text-gray-300">{group.vibe}</p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                        Festival Outfit Plan
                      </p>
                      <p className="text-sm text-gray-300">
                        {group.outfitPlan}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                        Members
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {group.memberNames.map((name) => (
                          <span
                            key={name}
                            className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-gray-200"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => onJoinGroup?.(group.id)}
                      className="w-full bg-purple-600 hover:bg-purple-700 rounded px-4 py-2.5 text-sm font-medium transition-all flex items-center justify-center gap-2 mt-2"
                    >
                      <Users className="w-4 h-4" />
                      Join Group
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}

          {/* Create Group CTA */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: styleGroups.length * 0.1 + 0.1 }}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg p-6 transition-all"
          >
            <div className="flex items-center justify-center gap-3">
              <Users className="w-5 h-5 text-gray-400" />
              <span className="font-light">Create a Style Group</span>
            </div>
          </motion.button>
        </div>
      )}

      {/* Outfits View */}
      {viewMode === 'outfits' && (
        <div className="px-4 md:px-8 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-lg p-8 text-center">
            <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-light mb-2">Share Outfit Plans</h3>
            <p className="text-sm text-gray-400 mb-6">
              Coordinate looks with friends attending the same festivals
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 rounded px-6 py-2.5 text-sm font-medium transition-all">
              Create Outfit Plan
            </button>
          </div>

          {/* Group Discounts CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 bg-gradient-to-r from-amber-600/20 to-transparent border border-amber-600/30 rounded-lg p-6 flex items-center gap-4"
          >
            <Gift className="w-6 h-6 text-amber-400 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-light text-base mb-1">Group Discounts</h4>
              <p className="text-xs text-gray-400">
                Get discounts when you buy with your group
              </p>
            </div>
            <div className="text-lg font-light text-amber-400 flex-shrink-0">
              20%
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default FestivalTwins
