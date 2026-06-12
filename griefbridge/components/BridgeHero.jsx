'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BriefcaseIcon, HeartIcon } from 'lucide-react'
import AmbientOrbs from './AmbientOrbs'

export default function BridgeHero({ progress = 0 }) {
  const bridgeScale = 1 - (progress * 0.55)
  const bridgeOpacity = progress < 0.9 ? 1 : 1 - ((progress - 0.9) * 10)
  
  // Opacity of the hero text section (it's always visible, but fades out with the bridge)
  const labelOpacity = progress > 0.3 ? (progress - 0.3) / 0.7 : 0

  // The dark mode background opacity (1 at top, 0 at progress 1)
  const darkOpacity = 1 - progress

  return (
    <div className="relative w-full" style={{ height: '100vh', backgroundColor: '#111' }}>

      {/* Full-screen atmospheric image (light mode background) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: `scale(${1 + progress * 0.05})`,
          transition: 'transform 0.1s linear',
        }}
      />
      <div className="absolute inset-0 bg-white/65" />
      
      {/* Dark mode overlay that fades out on scroll */}
      <div 
        className="absolute inset-0 bg-stone-950 pointer-events-none" 
        style={{ opacity: darkOpacity, transition: 'opacity 0.1s linear' }} 
      />

      <AmbientOrbs />

      {/* Bridge — starts large, shrinks on scroll */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
        style={{
          transform: `scale(${bridgeScale})`,
          opacity: bridgeOpacity,
          transformOrigin: 'center 40%',
          transition: 'transform 0.05s linear, opacity 0.1s linear',
        }}
      >
        <BridgeSVG large />
      </div>

      {/* Text content — visible at start, buttons appear later */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-8"
        style={{ pointerEvents: 'auto' }}
      >
        <HeroContent progress={progress} />
      </div>

      {/* Scroll hint — visible only at top */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ opacity: 1 - progress * 3 }}
      >
        <span className="text-xs tracking-widest uppercase" style={{ color: `rgba(255,255,255, ${1 - progress * 2})` }}>scroll</span>
        <div className="w-px h-8 bg-stone-300 animate-scroll-line" />
      </div>

    </div>
  )
}

function BridgeSVG({ large }) {
  return (
    <div className={large ? "w-full max-w-3xl px-16" : "w-full max-w-sm"}>
      <div className="relative flex items-center">
        {/* Left endpoint */}
        <div className="flex flex-col items-center gap-2 z-10">
          <div className="w-3 h-3 rounded-full bg-brand-200" />
          <span className={`text-stone-400 ${large ? 'text-sm' : 'text-xs'} tracking-wide`}>
            Grief
          </span>
        </div>

        {/* Track */}
        <div className="flex-1 relative mx-4">
          <div className="h-px bg-gradient-to-r from-brand-100 via-brand-400 to-brand-100 anim-line" />
        </div>

        {/* Center node */}
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
          <div className={`
            ${large ? 'w-5 h-5' : 'w-3.5 h-3.5'}
            rounded-full bg-brand-600
            ring-4 ring-brand-100
            animate-pulse-slow
          `} />
          <span className={`
            text-brand-600 font-medium tracking-wider
            ${large ? 'text-sm' : 'text-xs'}
            bg-white/80 px-2
            rounded
          `}>
            GriefBridge
          </span>
        </div>

        {/* Right endpoint */}
        <div className="flex flex-col items-center gap-2 z-10">
          <div className="w-3 h-3 rounded-full bg-memory-200" />
          <span className={`text-stone-400 ${large ? 'text-sm' : 'text-xs'} tracking-wide`}>
            Clarity
          </span>
        </div>
      </div>
    </div>
  )
}

function HeroContent({ progress }) {
  // Text fades in as progress increases. Hidden initially.
  // Fully visible at progress = 0.8
  const textOpacity = progress > 0.3 ? Math.min((progress - 0.3) / 0.5, 1) : 0

  return (
    <div className="text-center max-w-2xl mt-48">
      {/* Text elements that fade in on scroll */}
      <div 
        style={{ opacity: textOpacity, transition: 'opacity 0.1s linear' }}
      >
        <p
          className="text-[11px] font-medium tracking-[0.15em] uppercase text-stone-500 mb-5"
          style={{ animation: 'fadeInUp 0.7s 0.1s cubic-bezier(0.25,0.46,0.45,0.94) both' }}
        >
          Autonomous grief support
        </p>
        <h1
          className="font-serif italic text-5xl text-stone-800 leading-tight mb-5"
          style={{ animation: 'fadeInUp 0.9s 0.2s cubic-bezier(0.25,0.46,0.45,0.94) both' }}
        >
          When loss arrives,<br />
          you shouldn't have to<br />
          <em className="text-brand-400">carry it alone.</em>
        </h1>
        <p
          className="text-base text-stone-500 max-w-md mx-auto mb-16 leading-relaxed"
          style={{ animation: 'fadeInUp 0.9s 0.4s cubic-bezier(0.25,0.46,0.45,0.94) both' }}
        >
          GriefBridge handles every administrative task after a death — and preserves
          the person's living memory — so you can grieve without drowning in paperwork.
        </p>
      </div>

      {/* Two CTA buttons — completely visible at all times */}
      <div
        className="flex gap-3 justify-center"
        style={{ animation: 'fadeInUp 0.7s 0.6s cubic-bezier(0.25,0.46,0.45,0.94) both' }}
      >
        <Link href="/dashboard" className="btn-primary flex items-center gap-2 px-6 py-3 bg-brand-600 text-white text-sm font-medium rounded-xl hover:bg-brand-800 transition-colors duration-300">
          <BriefcaseIcon size={14} />
          Handle the practicalities
        </Link>
        <Link href="/legacy" className="btn-ghost flex items-center gap-2 px-6 py-3 border border-memory-500 text-memory-400 text-sm font-medium rounded-xl hover:bg-memory-50 hover:text-memory-800 transition-colors duration-300 bg-white/10 backdrop-blur-sm">
          <HeartIcon size={14} />
          Preserve their memory
        </Link>
      </div>
    </div>
  )
}
