'use client'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export function PageTransition({ children }) {
  const pathname = usePathname()
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(false)
    const t = setTimeout(() => setShow(true), 50)
    return () => clearTimeout(t)
  }, [pathname])

  return (
    <div
      style={{
        opacity: show ? 1 : 0,
        transition: 'opacity 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
    >
      {children}
    </div>
  )
}
