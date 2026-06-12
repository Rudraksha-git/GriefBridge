'use client'
import { useEffect, useRef } from 'react'

export function useScrollAnimation(options = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: options.threshold ?? 0.15, ...options }
    )

    const targets = el.querySelectorAll(
      '.anim-fade-up, .anim-fade, .anim-fade-left, .anim-fade-right, .anim-scale, .anim-line'
    )
    targets.forEach((t) => observer.observe(t))

    return () => observer.disconnect()
  }, [])

  return ref
}
