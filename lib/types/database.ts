export type DifficultyLevel = "easy" | "medium" | "hard"

export interface VocabWord {
  id: string
  word: string
  meaning: string
  synonyms: string[]
  antonyms: string[]
  example_sentence: string | null
  difficulty_level: DifficultyLevel
  created_at: string
}

export interface UserWord {
  id: string
  user_id: string
  word_id: string
  is_favorite: boolean
  times_reviewed: number
  last_reviewed_at: string | null
  mastery_level: number
  created_at: string
}

export interface UserStats {
  id: string
  user_id: string
  total_words_learned: number
  current_streak: number
  longest_streak: number
  last_activity_date: string | null
  quiz_scores: QuizScore[]
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  user_id: string
  full_name: string
  mobile_number: string
  created_at: string
  updated_at: string
}

export interface QuizScore {
  date: string
  score: number
  total: number
  mode: "meaning" | "synonym" | "antonym" | "mixed"
}

export interface VocabWordWithProgress extends VocabWord {
  user_progress?: UserWord
}
