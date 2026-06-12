'use client'
import { useState, useEffect, useRef } from 'react'

export function TypewriterText({ text, delay = 0 }) {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setStarted(true), delay)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [delay])

  useEffect(() => {
    if (!started) return
    let i = 0
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1))
      i++
      if (i >= text.length) clearInterval(interval)
    }, 38)
    return () => clearInterval(interval)
  }, [started, text])

  return (
    <span ref={ref} className="font-serif italic text-stone-600 text-lg leading-relaxed">
      {displayed}
      {started && displayed.length < text.length && (
        <span className="inline-block w-0.5 h-4 bg-stone-400 ml-0.5 animate-pulse" />
      )}
    </span>
  )
}
