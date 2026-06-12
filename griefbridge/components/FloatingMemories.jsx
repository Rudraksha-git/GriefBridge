"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const memories = [
  { type: 'image', src: 'https://images.unsplash.com/photo-1506744626753-1fa44df14d45?q=80&w=600&auto=format&fit=crop', top: '10%', left: '5%', width: 150, delay: 0 },
  { type: 'text', content: '"He always said the secret to the dal was patience..."', top: '25%', left: '15%', delay: 1.5 },
  { type: 'image', src: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=600&auto=format&fit=crop', top: '60%', left: '8%', width: 200, delay: 2 },
  { type: 'text', content: 'Kerala trip, 2012', top: '75%', left: '20%', delay: 3.5 },
  { type: 'image', src: 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?q=80&w=600&auto=format&fit=crop', top: '15%', right: '5%', width: 180, delay: 1 },
  { type: 'text', content: '"Every setback is a setup for something better"', top: '35%', right: '12%', delay: 2.5 },
  { type: 'image', src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop', top: '55%', right: '10%', width: 220, delay: 3 },
  { type: 'text', content: 'Laughing at the broken toaster', top: '80%', right: '18%', delay: 4 },
];

export function FloatingMemories() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {memories.map((memory, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: [0, 0.5, 0.5, 0],
            y: [-20, -40, -60, -80],
            x: Math.sin(i) * 20
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            delay: memory.delay * 2,
            ease: "linear",
            times: [0, 0.2, 0.8, 1]
          }}
          style={{
            position: 'absolute',
            top: memory.top,
            left: memory.left,
            right: memory.right,
          }}
          className="flex flex-col items-center justify-center"
        >
          {memory.type === 'image' ? (
            <div className="relative rounded-lg overflow-hidden shadow-2xl shadow-stone-900/5 backdrop-blur-sm p-2 bg-white/40 border border-white/60">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={memory.src} 
                alt="Memory" 
                style={{ width: memory.width }}
                className="rounded-md object-cover opacity-90 grayscale-[0.3] contrast-125"
              />
            </div>
          ) : (
            <div className="max-w-[200px] p-4 rounded-xl bg-white/60 backdrop-blur-md border border-white/40 shadow-xl text-stone-700 font-serif italic text-sm text-center">
              {memory.content}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
