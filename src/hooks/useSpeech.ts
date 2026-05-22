import { useState, useCallback, useRef, useEffect } from 'react'

export type SpeechState = 'idle' | 'speaking' | 'paused'

export function useSpeech() {
  const [state, setState] = useState<SpeechState>('idle')
  const [rate, setRateState] = useState(1)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const chunksRef = useRef<string[]>([])
  const chunkIndexRef = useRef(0)
  const rateRef = useRef(1)

  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null

  const stop = useCallback(() => {
    if (!synth) return
    synth.cancel()
    setState('idle')
    chunksRef.current = []
    chunkIndexRef.current = 0
  }, [synth])

  const speakChunk = useCallback((idx: number) => {
    if (!synth || idx >= chunksRef.current.length) {
      setState('idle')
      return
    }
    const utterance = new SpeechSynthesisUtterance(chunksRef.current[idx])
    utterance.rate = rateRef.current
    utterance.lang = 'zh-CN'
    utteranceRef.current = utterance

    utterance.onend = () => {
      const next = idx + 1
      if (next < chunksRef.current.length) {
        chunkIndexRef.current = next
        speakChunk(next)
      } else {
        setState('idle')
      }
    }

    utterance.onerror = () => {
      setState('idle')
    }

    synth.speak(utterance)
    setState('speaking')
  }, [synth])

  const speak = useCallback((text: string) => {
    if (!synth || !text.trim()) return
    synth.cancel()

    const sentences = text.match(/[^。！？.!?\n]+[。！？.!?\n]?/g) || [text]
    chunksRef.current = sentences.filter((s) => s.trim())
    chunkIndexRef.current = 0
    speakChunk(0)
  }, [synth, speakChunk])

  const pause = useCallback(() => {
    if (!synth) return
    synth.pause()
    setState('paused')
  }, [synth])

  const resume = useCallback(() => {
    if (!synth) return
    synth.resume()
    setState('speaking')
  }, [synth])

  const setRate = useCallback((r: number) => {
    rateRef.current = r
    setRateState(r)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      synth?.cancel()
    }
  }, [synth])

  return { state, rate, speak, pause, resume, stop, setRate }
}
