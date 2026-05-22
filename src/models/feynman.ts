export type FeynmanStage = 'prepare' | 'explain' | 'gaps' | 'review' | 'simplify' | 'complete'

export interface FeynmanSession {
  id: string
  targetType: 'word' | 'text' | 'standalone'
  targetId: string | null
  targetTitle: string
  createdAt: number
  completedAt: number | null
  currentStage: FeynmanStage
  originalMaterial: string
  explanation: string
  gapsNoted: string
  simplifiedExplanation: string
  notes: string
}

export interface FeynmanNote {
  id: string
  sessionId: string
  title: string
  content: string
  createdAt: number
  tags: string[]
}
