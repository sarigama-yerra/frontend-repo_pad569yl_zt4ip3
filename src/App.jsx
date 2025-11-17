import React from 'react'
import AchievementBoard from './components/AchievementBoard'
import { BookOpen, CheckCircle2, Clock, Crown, Flame, Rocket, Star, Trophy } from 'lucide-react'

// Demo progress and achievements implementing the provided types conceptually
const demoProgress = {
  completedLessons: 18,
  totalLessons: 24,
  streak: 7,
  fastestCompletionMins: 9,
  masteryQuizzesPassed: 4,
  behaviors: { helpful: true, collaborative: true },
}

const achievements = [
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Complete your first lesson',
    icon: CheckCircle2,
    color: '#38bdf8',
    category: 'completion',
    rarity: 'common',
    condition: (p) => (p?.completedLessons ?? 0) >= 1,
    points: 25,
  },
  {
    id: 'halfway-there',
    name: 'Halfway There',
    description: 'Reach 50% course completion',
    icon: BookOpen,
    color: '#a78bfa',
    category: 'completion',
    rarity: 'rare',
    condition: (p) => (p?.completedLessons ?? 0) / (p?.totalLessons ?? 1) >= 0.5,
    points: 50,
  },
  {
    id: 'speed-runner',
    name: 'Speed Runner',
    description: 'Finish a lesson in under 10 minutes',
    icon: Rocket,
    color: '#f59e0b',
    category: 'speed',
    rarity: 'epic',
    condition: (p) => (p?.fastestCompletionMins ?? 99) <= 10,
    points: 75,
  },
  {
    id: 'weekly-warrior',
    name: 'Weekly Warrior',
    description: 'Maintain a 7-day streak',
    icon: Flame,
    color: '#ef4444',
    category: 'streak',
    rarity: 'rare',
    condition: (p) => (p?.streak ?? 0) >= 7,
    points: 60,
  },
  {
    id: 'quiz-master',
    name: 'Quiz Master',
    description: 'Pass 3 mastery quizzes',
    icon: Crown,
    color: '#fbbf24',
    category: 'mastery',
    rarity: 'epic',
    condition: (p) => (p?.masteryQuizzesPassed ?? 0) >= 3,
    points: 100,
  },
  {
    id: 'legend-of-learning',
    name: 'Legend of Learning',
    description: 'Complete all lessons',
    icon: Trophy,
    color: '#22c55e',
    category: 'completion',
    rarity: 'legendary',
    condition: (p) => (p?.completedLessons ?? 0) >= (p?.totalLessons ?? Infinity),
    points: 200,
  },
  {
    id: 'star-helper',
    name: 'Star Helper',
    description: 'Display outstanding helpful behavior',
    icon: Star,
    color: '#38bdf8',
    category: 'behavior',
    rarity: 'rare',
    condition: (p) => !!p?.behaviors?.helpful,
    points: 40,
  },
]

export default function App() {
  return (
    <AchievementBoard achievements={achievements} unlocks={[]} progress={demoProgress} />
  )
}
