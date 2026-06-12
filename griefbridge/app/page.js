import Link from "next/link";
import { Briefcase, Brain, CheckCircle2, Heart, Shield, HeartHandshake, Clock } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-600">
      <nav className="w-full px-6 py-4 flex justify-between items-center border-b border-stone-100 bg-white">
        <div className="font-serif text-xl text-stone-800">
          Grief<span className="text-brand-400">Bridge</span>
        </div>
        <Link href="/dashboard" className="border border-stone-200 text-stone-600 text-sm px-4 py-2 rounded-lg hover:bg-stone-50 transition-colors">
          Early access
        </Link>
      </nav>

      <section
        className="relative min-h-[92vh] flex flex-col justify-center px-8 md:px-20"
        style={{
          backgroundImage: `url('https://www.parents.com/thmb/3RH8ZDIrxOL4oNMiCYn1pw2yFvE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/shutterstock_670139794-5d88c42b18ff4be4b83c0d272940f7c8.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-white/70" />
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <p className="text-[11px] font-medium tracking-[0.1em] uppercase text-stone-400 mb-6">
            Autonomous grief support
          </p>
          <h1 className="text-4xl md:text-5xl font-serif text-stone-800 mb-6 leading-tight">
            When loss arrives,<br />you shouldn't have to<br /><span className="italic font-normal text-brand-400">carry it alone.</span>
          </h1>
          <p className="text-sm md:text-base text-stone-600 max-w-md mx-auto mb-12 leading-relaxed">
            GriefBridge handles every administrative task after a death — and preserves the person's living memory — so you can grieve without drowning in paperwork.
          </p>

          <div className="flex items-center justify-center max-w-md mx-auto mb-12 relative">
            <div className="h-0.5 bg-stone-200 w-full absolute top-1/2 -translate-y-1/2 z-0"></div>
            <div className="flex justify-between w-full relative z-10">
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-stone-300 border-4 border-stone-50"></div>
                <span className="text-xs font-medium text-stone-400 mt-2 uppercase tracking-wider">Grief</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-brand-400 ring-4 ring-brand-50"></div>
                <span className="text-xs font-medium text-brand-600 mt-2 uppercase tracking-wider">GriefBridge</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-memory-400 border-4 border-stone-50"></div>
                <span className="text-xs font-medium text-stone-400 mt-2 uppercase tracking-wider">Clarity</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-3 mt-8">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-5 py-3 bg-brand-600 text-white text-sm font-medium rounded-xl hover:bg-brand-800 transition-colors"
            >
              <Briefcase size={15} />
              Handle the practicalities
            </Link>

            <Link
              href="/legacy"
              className="flex items-center gap-2 px-5 py-3 border border-memory-600 text-memory-600 text-sm font-medium rounded-xl hover:bg-memory-50 transition-colors"
            >
              <Heart size={15} />
              Preserve their memory
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 border-y border-stone-100">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-[11px] font-medium tracking-[0.1em] uppercase text-stone-400 mb-8 text-center">
            The problem
          </p>
          <blockquote className="border-l-4 border-brand-100 pl-6 py-2 mb-6">
            <p className="text-2xl font-serif italic text-stone-800 leading-relaxed">
              "Grief is already impossible. No one should also face 47 bureaucratic tasks — alone — in the days that follow."
            </p>
          </blockquote>
          <p className="text-sm text-stone-500 leading-relaxed max-w-2xl">
            The dual burden of managing overwhelming emotional loss while navigating a complex web of legal, financial, and digital administration is a quiet crisis. Families spend hundreds of hours on hold, filling out repetitive forms, and tracking down accounts.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-[11px] font-medium tracking-[0.1em] uppercase text-stone-400 mb-12 text-center">
            Two agents, one mission
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-stone-100 border-t-2 border-t-brand-600 rounded-xl p-8 shadow-sm">
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

            <div className="bg-white border border-stone-100 border-t-2 border-t-memory-600 rounded-xl p-8 shadow-sm">
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

      <section className="bg-white py-20 border-t border-stone-100">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-[11px] font-medium tracking-[0.1em] uppercase text-stone-400 mb-12 text-center">
            How it works
          </p>
          <div className="space-y-12">
            {[
              { title: "Share basic details", desc: "Provide minimal information to authorize the Executor Agent. We handle the rest securely." },
              { title: "Review drafted documents", desc: "The agent prepares all necessary paperwork. You simply review and click approve." },
              { title: "Upload memories", desc: "Drop in old WhatsApp exports, voice notes, or photos. The Memory Agent begins indexing." },
              { title: "Talk to their legacy", desc: "Ask questions, hear stories, and interact with a living archive of their life." }
            ].map((step, i) => (
              <div key={i} className="flex gap-6 items-start">
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

      <section className="py-20 bg-stone-50">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-[11px] font-medium tracking-[0.1em] uppercase text-stone-400 mb-12 text-center">
            Memory vault — a glimpse
          </p>
          <div className="bg-white border border-stone-100 rounded-xl p-6 md:p-8 shadow-sm">
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

      <section className="py-20 bg-white border-t border-stone-100">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 mb-4">
              <Shield size={20} />
            </div>
            <h4 className="font-serif font-normal italic text-lg text-stone-800 mb-3">Private by design</h4>
            <p className="text-sm text-stone-500 leading-relaxed">Your data never trains public models. Complete ownership and deletion rights.</p>
          </div>
          <div className="text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 mb-4">
              <HeartHandshake size={20} />
            </div>
            <h4 className="font-serif font-normal italic text-lg text-stone-800 mb-3">Human-centered</h4>
            <p className="text-sm text-stone-500 leading-relaxed">Built to augment human grieving, not replace the human connection.</p>
          </div>
          <div className="text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 mb-4">
              <Clock size={20} />
            </div>
            <h4 className="font-serif font-normal italic text-lg text-stone-800 mb-3">No time pressure</h4>
            <p className="text-sm text-stone-500 leading-relaxed">The vault exists forever. Come back to tasks or memories whenever you're ready.</p>
          </div>
        </div>
      </section>

      <footer className="py-10 border-t border-stone-200 bg-stone-50 text-center">
        <div className="font-serif text-lg text-stone-800 mb-2">
          Grief<span className="text-brand-400">Bridge</span>
        </div>
        <p className="text-xs text-stone-400">Autonomy for the executor. Memory for the family.</p>
      </footer>
    </div>
  );
}
