import React, { useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import rough from 'roughjs/bundled/rough.esm.js'
import { gsap } from 'gsap'
import { Award, Crown, Flame, Sparkles, Trophy, Star, Zap, Target } from 'lucide-react'
import { FaBolt, FaCrown, FaMedal } from 'react-icons/fa'

/**
 * Types (doc-only):
 * AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary'
 * AchievementCategory = 'completion' | 'behavior' | 'streak' | 'mastery' | 'speed'
 */

const rarityStyles = {
  common: {
    ring: 'ring-slate-300/60',
    bg: 'from-slate-800 to-slate-900',
    glow: 'shadow-[0_0_25px_rgba(148,163,184,0.25)]',
  },
  rare: {
    ring: 'ring-sky-300/70',
    bg: 'from-sky-700/20 to-slate-900',
    glow: 'shadow-[0_0_35px_rgba(56,189,248,0.35)]',
  },
  epic: {
    ring: 'ring-violet-300/70',
    bg: 'from-violet-700/20 to-slate-900',
    glow: 'shadow-[0_0_45px_rgba(167,139,250,0.45)]',
  },
  legendary: {
    ring: 'ring-amber-300/80',
    bg: 'from-amber-600/25 to-slate-900',
    glow: 'shadow-[0_0_60px_rgba(251,191,36,0.55)]',
  },
}

const categoryIcon = {
  completion: Trophy,
  behavior: Star,
  streak: Zap,
  mastery: Crown,
  speed: Target,
}

function useRoughCard(ref) {
  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', '100%')
    svg.setAttribute('height', '100%')
    svg.style.position = 'absolute'
    svg.style.inset = '0'
    svg.style.pointerEvents = 'none'

    const rc = rough.svg(svg)
    const draw = () => {
      while (svg.firstChild) svg.removeChild(svg.firstChild)
      const { width, height } = el.getBoundingClientRect()
      const node = rc.rectangle(8, 8, width - 16, height - 16, {
        roughness: 1.25,
        bowing: 2.2,
        stroke: 'rgba(148,163,184,0.45)',
        strokeWidth: 1.5,
        fill: 'rgba(100,116,139,0.06)',
        fillStyle: 'cross-hatch',
      })
      svg.appendChild(node)
    }
    draw()
    el.appendChild(svg)

    const ro = new ResizeObserver(draw)
    ro.observe(el)
    return () => {
      ro.disconnect()
      if (svg && svg.parentNode) svg.parentNode.removeChild(svg)
    }
  }, [ref])
}

const Badge = ({ a, unlocked }) => {
  const Icon = a.icon ?? categoryIcon[a.category] ?? Award
  const r = rarityStyles[a.rarity]
  return (
    <motion.div
      layout
      className={`relative rounded-xl p-4 bg-gradient-to-br ${r.bg} ring-1 ${r.ring} ${r.glow} transition-all`}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="flex items-start gap-3">
        <div className={`w-12 h-12 rounded-lg bg-slate-900/40 flex items-center justify-center ring-1 ring-white/10`}>
          <Icon className={`w-6 h-6 ${unlocked ? 'text-white' : 'text-slate-400/60'}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className={`font-semibold ${unlocked ? 'text-white' : 'text-slate-300/80'}`}>{a.name}</p>
            {a.rarity === 'legendary' && <Crown className="w-4 h-4 text-amber-300" />}
            {a.rarity === 'epic' && <Sparkles className="w-4 h-4 text-violet-300" />}
          </div>
          <p className="text-xs text-slate-300/70">{a.description}</p>
          <div className="mt-2 text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-white/5 ring-1 ring-white/10">{a.category}</span>
            <span className="px-1.5 py-0.5 rounded bg-white/5 ring-1 ring-white/10">{a.rarity}</span>
            <span className="px-1.5 py-0.5 rounded bg-white/5 ring-1 ring-white/10">{a.points} pts</span>
          </div>
        </div>
      </div>
      {!unlocked && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px] rounded-xl flex items-center justify-center">
          <div className="text-[10px] tracking-wide text-slate-300/70 flex items-center gap-1"><FaLock className="inline" /> Locked</div>
        </div>
      )}
    </motion.div>
  )
}

const StatPill = ({ icon: I, label, value, tone = 'sky' }) => (
  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-${tone}-500/10 ring-1 ring-${tone}-400/30 text-${tone}-200`}> 
    <I className="w-4 h-4" />
    <span className="text-xs">{label}: <span className="font-semibold">{value}</span></span>
  </div>
)

const RarityLegend = () => (
  <div className="flex flex-wrap gap-2 mt-3">
    {Object.entries(rarityStyles).map(([k, v]) => (
      <div key={k} className={`text-xs px-2 py-1 rounded ring-1 ${v.ring} bg-gradient-to-br ${v.bg} text-slate-200`}>{k}</div>
    ))}
  </div>
)

const HeaderCanvas = () => {
  const ref = useRef(null)
  useRoughCard(ref)
  useEffect(() => {
    if (!ref.current) return
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 })
    tl.to(ref.current, { boxShadow: '0 0 40px rgba(56,189,248,0.35)', duration: 1.2, ease: 'power2.inOut' })
      .to(ref.current, { boxShadow: '0 0 0 rgba(0,0,0,0)', duration: 1.2, ease: 'power2.inOut' })
    return () => tl.kill()
  }, [])
  return <div ref={ref} className="absolute inset-0 rounded-2xl" />
}

export default function AchievementBoard({ achievements = [], unlocks = [], progress }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return
    const items = containerRef.current.querySelectorAll('[data-anim-item]')
    gsap.fromTo(items, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: 'power2.out' })
  }, [achievements])

  const unlockedSet = useMemo(() => new Set(unlocks.map(u => u.achievementId)), [unlocks])
  const points = useMemo(() => unlocks.reduce((sum, u) => sum + (u.points || 0), 0), [unlocks])

  return (
    <div className="relative min-h-screen py-12 px-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-[32rem] h-[32rem] bg-violet-500/10 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative">
        <div className="relative mb-8">
          <div className="relative p-6 rounded-2xl bg-slate-900/70 ring-1 ring-white/10 overflow-hidden">
            <HeaderCanvas />
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 text-slate-300 uppercase text-xs tracking-wider">
                  <Flame className="w-4 h-4 text-sky-300" /> Achievement Board
                </div>
                <h1 className="mt-2 text-3xl md:text-4xl font-bold text-white tracking-tight">Your Course Progress</h1>
                <p className="text-slate-300/80 mt-1">Collect achievements as you learn. Each badge adds to your total score.</p>
                <RarityLegend />
              </div>
              <div className="flex items-center gap-2">
                <StatPill icon={Trophy} label="Total Points" value={points} tone="amber" />
                <StatPill icon={FaMedal} label="Unlocked" value={`${unlockedSet.size}/${achievements.length}`} tone="violet" />
                <StatPill icon={FaBolt} label="Streak" value={`${progress?.streak ?? 0} days`} tone="sky" />
              </div>
            </div>
          </div>
        </div>

        <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {achievements.map((a) => {
              const unlocked = a.condition ? !!a.condition(progress) : unlockedSet.has(a.id)
              return (
                <motion.div key={a.id} data-anim-item layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
                  <Badge a={a} unlocked={unlocked} />
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
