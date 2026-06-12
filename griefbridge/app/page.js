"use client";
import Link from "next/link";
import { Briefcase, Brain, CheckCircle2, Heart, Shield, HeartHandshake, Clock } from "lucide-react";
import BridgeHero from "../components/BridgeHero";
import { useScrollAnimation } from "../lib/useScrollAnimation";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const pageRef = useScrollAnimation();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const progress = Math.min(scrollY / 500, 1);

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-600" ref={pageRef}>
      <nav 
        className="fixed z-50 w-full px-6 py-4 flex justify-between items-center bg-white/70 backdrop-blur-md border-b border-stone-100"
        style={{ opacity: progress, pointerEvents: progress > 0.1 ? 'auto' : 'none', transition: 'opacity 0.2s linear' }}
      >
        <div className="font-serif text-xl text-stone-800 transition-opacity hover:opacity-80">
          Grief<span className="text-brand-400">Bridge</span>
        </div>
        <Link href="/dashboard" className="border border-stone-200 text-stone-600 text-sm px-4 py-2 rounded-lg hover:bg-stone-50 transition-colors">
          Early access
        </Link>
      </nav>

      <div className="relative w-full" style={{ height: "150vh" }}>
        <div className="sticky top-0 w-full h-screen overflow-hidden">
          <BridgeHero progress={progress} />
        </div>
      </div>

      <section className="relative z-10 bg-white py-20 border-y border-stone-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-[11px] font-medium tracking-[0.1em] uppercase text-stone-400 mb-8 anim-fade-up">
            The problem
          </p>
          <blockquote className="border-l-4 border-brand-100 pl-6 py-2 mb-6 anim-fade-up delay-200">
            <p className="text-2xl font-serif italic text-stone-800 leading-relaxed text-left">
              "Grief is already impossible. No one should also face 47 bureaucratic tasks — alone — in the days that follow."
            </p>
          </blockquote>
          <p className="text-sm text-stone-500 leading-relaxed max-w-2xl mx-auto anim-fade-up delay-400">
            The dual burden of managing overwhelming emotional loss while navigating a complex web of legal, financial, and digital administration is a quiet crisis. Families spend hundreds of hours on hold, filling out repetitive forms, and tracking down accounts.
          </p>
        </div>
      </section>

      <section className="relative z-10 bg-stone-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-[11px] font-medium tracking-[0.1em] uppercase text-stone-400 mb-12 text-center anim-fade-up">
            Two agents, one mission
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-stone-100 border-t-2 border-t-brand-600 rounded-xl p-8 shadow-sm anim-fade-right delay-200">
              <Briefcase className="w-8 h-8 text-brand-600 mb-6" />
              <h3 className="text-xl font-serif font-normal italic text-stone-800 mb-3 tracking-tight">Executor Agent</h3>
              <p className="text-sm text-stone-500 mb-6 leading-relaxed">Autonomously handles all post-death administrative tasks, acting on your behalf with institutions.</p>
              <ul className="space-y-3">
                {['Drafts legal paperwork & letters', 'Closes bank & utility accounts', 'Notifies government bodies', 'Manages digital footprints', 'Tracks progress autonomously'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-stone-600">
                    <CheckCircle2 className="w-5 h-5 text-brand-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-stone-100 border-t-2 border-t-memory-600 rounded-xl p-8 shadow-sm anim-fade-left delay-200">
              <Brain className="w-8 h-8 text-memory-600 mb-6" />
              <h3 className="text-xl font-serif font-normal italic text-stone-800 mb-3 tracking-tight">Memory Agent</h3>
              <p className="text-sm text-stone-500 mb-6 leading-relaxed">Builds a living, interactive legacy from photos, chats, and voice recordings.</p>
              <ul className="space-y-3">
                {['Indexes voice memos & texts', 'Captions and organizes photos', 'Extracts life stories & timelines', 'Provides conversational interface', 'Maintains a private, secure vault'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-stone-600">
                    <CheckCircle2 className="w-5 h-5 text-memory-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 bg-white py-20 border-t border-stone-100">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-[11px] font-medium tracking-[0.1em] uppercase text-stone-400 mb-12 text-center anim-fade-up">
            How it works
          </p>
          <div className="space-y-12">
            {[
              { title: "Share basic details", desc: "Provide minimal information to authorize the Executor Agent. We handle the rest securely." },
              { title: "Review drafted documents", desc: "The agent prepares all necessary paperwork. You simply review and click approve." },
              { title: "Upload memories", desc: "Drop in old WhatsApp exports, voice notes, or photos. The Memory Agent begins indexing." },
              { title: "Talk to their legacy", desc: "Ask questions, hear stories, and interact with a living archive of their life." }
            ].map((step, i) => (
              <div key={i} className={`flex gap-6 items-start anim-fade-up delay-${i === 0 ? 150 : i === 1 ? 300 : i === 2 ? 450 : 600}`}>
                <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center shrink-0">
                  <span className="text-3xl font-serif italic text-brand-400">{i + 1}</span>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-stone-800 mb-2">{step.title}</h4>
                  <p className="text-sm text-stone-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-20 bg-stone-50">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-[11px] font-medium tracking-[0.1em] uppercase text-stone-400 mb-12 text-center anim-fade-up">
            Memory vault — a glimpse
          </p>
          <div className="bg-white border border-stone-100 rounded-xl p-6 md:p-8 shadow-sm anim-fade-up delay-100">
            <div className="space-y-6">
              <div className="flex justify-end">
                <div className="bg-brand-600 text-white p-4 rounded-2xl rounded-br-sm max-w-[80%] text-sm">
                  What was Robert's advice about setbacks?
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-white border border-stone-100 text-stone-700 p-4 rounded-2xl rounded-bl-sm max-w-[80%] text-sm shadow-sm">
                  <p className="mb-3">Robert often said: "Every setback is a setup for something better — but only if you're honest about what went wrong."</p>
                  <p>He mentioned this first when the printing shop nearly closed in 1987, but also later in a letter to Sarah...</p>
                  <span className="text-[11px] text-stone-400 mt-1.5 block">
                    — Voice memo · March 2022
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-20 bg-white border-t border-stone-100">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: Shield, title: "Private by design", desc: "Your data never trains public models. Complete ownership and deletion rights." },
            { icon: HeartHandshake, title: "Human-centered", desc: "Built to augment human grieving, not replace the human connection." },
            { icon: Clock, title: "No time pressure", desc: "The vault exists forever. Come back to tasks or memories whenever you're ready." }
          ].map((item, i) => (
            <div key={i} className={`trust-card text-center flex flex-col items-center anim-scale delay-${i === 0 ? 200 : i === 1 ? 400 : 600}`}>
              <div className="w-12 h-12 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 mb-4">
                <item.icon size={20} />
              </div>
              <h4 className="font-serif font-normal italic text-lg text-stone-800 mb-3">{item.title}</h4>
              <p className="text-sm text-stone-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 py-10 border-t border-stone-200 bg-stone-50 text-center">
        <div className="font-serif text-lg text-stone-800 mb-2">
          Grief<span className="text-brand-400">Bridge</span>
        </div>
        <p className="text-xs text-stone-400">Autonomy for the executor. Memory for the family.</p>
      </footer>
    </div>
  );
}
