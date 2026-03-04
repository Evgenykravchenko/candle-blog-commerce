"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CopyPlus } from "lucide-react";

export function ProductCard({ scent, index }: { scent: any, index: number }) {
  return (
    <Link href={`/product/${scent.id}`} className="block">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.6, delay: index * 0.05 }}
        className="group relative flex flex-col gap-4 cursor-pointer"
      >
        <div className="aspect-square w-full overflow-hidden relative bg-[#111]">
          <img 
            src={scent.img} 
            alt={scent.title} 
            className="w-full h-full object-cover filter grayscale opacity-90 group-hover:opacity-100 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-[2s]" 
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-1000"></div>
          <div className="absolute top-2 right-2 md:top-4 md:right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
             <button className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all">
              <CopyPlus className="w-3 h-3 md:w-4 md:h-4 text-white" />
            </button>
          </div>
          <div className="absolute top-3 left-3 md:top-4 md:left-4 z-20 flex gap-2">
             <span className="bg-[#050505]/80 backdrop-blur-md border border-white/10 px-2 py-1 text-[8px] md:text-[10px] uppercase tracking-widest text-white/90">
               Свеча
             </span>
             {scent.badge && (
               <span className="bg-[#AA6B57]/80 backdrop-blur-md border border-[#AA6B57]/50 px-2 py-1 text-[8px] md:text-[10px] uppercase tracking-widest text-white">
                 {scent.badge}
               </span>
             )}
          </div>
        </div>

        <div className="flex flex-col gap-2 relative z-20">
          <div className="flex flex-col xl:flex-row justify-between xl:items-end gap-1">
            <h3 className="text-xl md:text-2xl font-serif italic group-hover:not-italic transition-all duration-500">{scent.title}</h3>
            <span className="font-serif italic text-base md:text-lg text-white/90">{scent.price}</span>
          </div>
          
          <div className="flex flex-col gap-1 border-t border-white/10 pt-2 mt-1">
            <p className="text-white/60 text-[10px] md:text-xs tracking-widest uppercase line-clamp-1">{scent.slogan}</p>
            <span className="text-[#AA6B57] text-[9px] md:text-[10px] uppercase tracking-[0.2em] line-clamp-1">{scent.notes}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
