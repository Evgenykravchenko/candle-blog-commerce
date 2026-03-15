"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Plus, Minus } from 'lucide-react';
import Image from 'next/image';
import { Inter, Noto_Serif } from 'next/font/google';

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter' });
const serif = Noto_Serif({ subsets: ['latin', 'cyrillic'], weight: ['300', '400', '700'], style: ['normal', 'italic'], variable: '--font-serif' });

import { SCENTS } from "../../../data/products";
import { ProductCard } from "../../../components/ProductCard";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  // Try to parse the ID from URL, fallback to scent #1 if invalid
  const productId = parseInt(id);
  const product = SCENTS.find(p => p.id === productId) || SCENTS[0];
  const recommendedScents = SCENTS.filter(p => p.id !== product.id).slice(0, 4);
  const [activeImage, setActiveImage] = React.useState(0);

  // Mock additional images for demonstration (since we only have one in data)
  const productImages = [product.img, "https://images.unsplash.com/photo-1602928321679-560bb453f190?q=80&w=1200", "https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=1200"];

  return (
    <main className={`${inter.variable} ${serif.variable} bg-background text-foreground font-sans selection:bg-primary/30 min-h-screen w-full relative overflow-x-hidden`}>
      {/* GLOBAL NOISE OVERLAY */}
      <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.04] mix-blend-screen bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')]" />

      {/* MINIMAL HEADER */}
      <header className="fixed top-0 w-full z-50 py-6 px-6 md:px-12 flex justify-between items-center mix-blend-difference">
        <Link href="/" className="group flex items-center gap-4 text-white hover:text-white/70 transition-colors">
          <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:-translate-x-1 transition-transform">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold hidden md:block text-white">Возврат к коллекции</span>
        </Link>
        <div className="font-serif italic text-xl text-white">hl.</div>
        <div className="w-10 h-10"></div> {/* Spacer for symmetry */}
      </header>

      {/* HERO SECTION */}
      <section className="relative w-full pt-32 pb-16 px-6 md:px-12 bg-background">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* Interactive Gallery */}
          <div className="relative group">
            <div className="aspect-square bg-secondary rounded-3xl overflow-hidden border border-foreground/5 relative shadow-2xl shadow-primary/5">
              <img 
                src={productImages[activeImage]} 
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-700"
              />
            </div>
            {/* Thumbnails */}
            <div className="flex gap-4 mt-6 overflow-x-auto pb-2 scrollbar-hide">
              {productImages.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(i)}
                  className={`flex-none w-20 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${activeImage === i ? 'border-primary shadow-lg shadow-primary/10' : 'border-transparent opacity-50 hover:opacity-100'}`}
                >
                  <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-8 md:gap-12">
            <div className="flex flex-col gap-4">
              {product.badge && (
                <span className="inline-flex items-center self-start px-3 py-1 rounded-full bg-primary/10 text-[10px] uppercase tracking-[0.2em] text-primary font-bold">
                  {product.badge}
                </span>
              )}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif leading-none tracking-tighter text-foreground decoration-primary/20">
                {product.title}
              </h1>
              <p className="text-xl md:text-2xl text-foreground/60 font-serif italic max-w-lg">
                {product.slogan}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 py-8 border-y border-foreground/5">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-widest text-foreground/40">Цена</span>
                <span className="text-3xl md:text-4xl font-serif text-foreground">{product.price}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-widest text-foreground/40">Объем</span>
                <span className="text-lg md:text-xl font-light text-foreground/80">200мл / 45ч</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-2 group relative px-8 py-5 bg-primary text-white rounded-2xl overflow-hidden flex items-center justify-center transition-all hover:shadow-xl hover:shadow-primary/20 active:scale-[0.98]">
                <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
                <span className="relative z-10 text-xs md:text-sm uppercase tracking-[0.2em] font-bold flex items-center gap-3">
                  Заказать сейчас
                  <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
                </span>
              </button>
              <button className="flex-1 px-8 py-5 rounded-2xl border border-foreground/10 hover:bg-foreground/5 transition-colors uppercase tracking-[0.2em] text-[10px] font-bold">
                В корзину
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* STORY & PYRAMID SECTION */}
      <section className="py-24 md:py-40 max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-24 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -left-1/4 top-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-foreground/10 to-transparent"></div>

        <div className="flex flex-col gap-12 lg:sticky top-40 h-fit z-10">
          <h2 className="text-3xl lg:text-5xl font-serif leading-[1.2]">
            Манифест тишины,<br/> <span className="text-foreground/40 italic">заключенный в стекло.</span>
          </h2>
          <p className="text-base lg:text-lg text-foreground/60 font-light leading-relaxed max-w-md">
            {product.description}
          </p>
          
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-foreground/10 mt-8">
             <div className="flex flex-col gap-2">
               <span className="text-[9px] uppercase tracking-widest text-primary">Настроение</span>
               <span className="text-sm font-light text-foreground/80">{product.mood}</span>
             </div>
             <div className="flex flex-col gap-2">
               <span className="text-[9px] uppercase tracking-widest text-primary">Интенсивность</span>
               <span className="text-sm font-light text-foreground/80">{product.intensity}</span>
             </div>
          </div>
        </div>

        <div className="flex flex-col gap-16 lg:pl-16 z-10 mt-12 lg:mt-0">
           <div className="flex flex-col gap-6">
             <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/30 border-b border-foreground/10 pb-4">Ольфакторная пирамида</span>
             <h3 className="text-2xl lg:text-3xl font-serif text-primary italic">{product.notes}</h3>
           </div>

           <div className="flex flex-col gap-12 border-l border-foreground/10 pl-8 lg:pl-12 relative">
              {/* Timeline dots */}
              <div className="absolute top-2 -left-1.5 w-3 h-3 rounded-full bg-primary"></div>
              <div className="absolute top-1/2 -left-[5px] w-2 h-2 rounded-full bg-foreground/20"></div>
              <div className="absolute bottom-6 -left-[5px] w-2 h-2 rounded-full bg-foreground/20"></div>

              <div className="group">
                <span className="text-[10px] uppercase tracking-widest text-foreground/40 mb-2 block transition-colors group-hover:text-primary">Верхние ноты (первые минуты)</span>
                <p className="text-base lg:text-lg font-light text-foreground/80 pb-4 border-b border-transparent group-hover:border-primary/30 transition-colors">
                  Легкие, летучие молекулы, создающие первое, искрящееся впечатление об аромате при открытии крышки.
                </p>
              </div>
              <div className="group">
                <span className="text-[10px] uppercase tracking-widest text-foreground/40 mb-2 block transition-colors group-hover:text-primary">Ноты сердца (через 15 мин)</span>
                <p className="text-base lg:text-lg font-light text-foreground/80 pb-4 border-b border-transparent group-hover:border-primary/30 transition-colors">
                  Раскрываются при плавлении воска. "Душа" композиции, задающая ее глубокий, медитативный характер.
                </p>
              </div>
              <div className="group">
                <span className="text-[10px] uppercase tracking-widest text-foreground/40 mb-2 block transition-colors group-hover:text-primary">Базовые ноты (шлейф)</span>
                <p className="text-base lg:text-lg font-light text-foreground/80 pb-4 border-b border-transparent group-hover:border-primary/30 transition-colors">
                  Самые тяжелые масла. Фиксируют аромат, остаются в пространстве дольше всего, создавая уютный шлейф.
                </p>
              </div>
           </div>
        </div>
      </section>

      {/* VIBE GALLERY */}
      <section className="py-24 bg-secondary overflow-hidden border-t border-foreground/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-16 flex flex-col items-center text-center">
           <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-primary mb-6">Детали</span>
           <h2 className="text-3xl md:text-5xl font-serif">Тактильность & Материалы</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 md:px-12 pb-12 w-full max-w-[1400px] mx-auto">
           {/* Card 1 */}
           <div className="w-full aspect-square md:aspect-3/4 lg:aspect-square bg-foreground/5 relative overflow-hidden group border border-foreground/5">
             <div className="absolute inset-0 bg-background/40 group-hover:bg-background/10 z-10 transition-colors duration-1000"></div>
             <img src="https://images.unsplash.com/photo-1602928321679-560bb453f190?q=80&w=1200" alt="Texture 1" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[2s]" />
             <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent flex flex-col justify-end p-6 z-20">
               <span className="text-[10px] uppercase tracking-[0.2em] text-primary mb-2">Основа</span>
               <span className="text-xl md:text-2xl font-serif text-foreground">100% ботанический воск</span>
               <p className="text-sm text-foreground/70 mt-3 font-light">Бленд соевого и кокосового восков обеспечивает медленное, кристально чистое горение.</p>
             </div>
           </div>
           
           {/* Card 2 */}
           <div className="w-full aspect-square md:aspect-3/4 lg:aspect-square bg-foreground/5 relative overflow-hidden group border border-foreground/5">
             <div className="absolute inset-0 bg-background/40 group-hover:bg-background/10 z-10 transition-colors duration-1000"></div>
             <img src="https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?q=80&w=1200" alt="Texture 2" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[2s]" />
             <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent flex flex-col justify-end p-6 z-20">
               <span className="text-[10px] uppercase tracking-[0.2em] text-primary mb-2">Звук</span>
               <span className="text-xl md:text-2xl font-serif text-foreground">Деревянный фитиль</span>
               <p className="text-sm text-foreground/70 mt-3 font-light">Органическая древесина вишни. Создает эффект потрескивающего миниатюрного камина.</p>
             </div>
           </div>

           {/* Card 3 */}
           <div className="w-full aspect-square md:aspect-3/4 lg:aspect-square bg-foreground/5 relative overflow-hidden group border border-foreground/5">
             <div className="absolute inset-0 bg-background/40 group-hover:bg-background/10 z-10 transition-colors duration-1000"></div>
             <img src="https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=1200" alt="Texture 3" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[2s]" />
             <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent flex flex-col justify-end p-6 z-20">
               <span className="text-[10px] uppercase tracking-[0.2em] text-primary mb-2">Аромат</span>
               <span className="text-xl md:text-2xl font-serif text-foreground">Масла из Грасса, Франция</span>
               <p className="text-sm text-foreground/70 mt-3 font-light">Сложная, многослойная парфюмерная пирамида, созданная профессиональными носами.</p>
             </div>
           </div>
        </div>
      </section>
      {/* RECOMMENDATIONS */}
      <section className="py-24 border-t border-foreground/5 relative overflow-hidden bg-background">
        <div className="container mx-auto px-6 mb-12">
           <h2 className="text-3xl md:text-5xl font-serif text-center md:text-left text-foreground">Возможно, вам понравится</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 px-4 md:px-6 max-w-[1600px] mx-auto pb-12">
          {recommendedScents.map((scent, index) => (
            <ProductCard key={scent.id} scent={scent} index={index} />
          ))}
        </div>
      </section>

      {/* QUIZ CTA */}
      <section className="py-24 border-t border-foreground/5 relative overflow-hidden bg-secondary flex flex-col items-center text-center px-6">
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary mb-6">Интуиция</span>
        <h2 className="text-3xl md:text-5xl font-serif mb-6 max-w-2xl text-foreground/90">Не можете определиться с ароматом?</h2>
        <p className="text-foreground/50 font-light mb-12 max-w-xl">
          Пройдите короткий визуальный тест, ответьте на пару вопросов, и мы подберем композицию, идеально подходящую вашему текущему состоянию.
        </p>
        <Link 
          href="/#intuition" 
          className="px-10 py-4 border border-foreground/20 hover:bg-foreground hover:text-background transition-colors uppercase tracking-[0.2em] text-[10px] sm:text-xs font-bold"
        >
          Подобрать аромат
        </Link>
      </section>

      {/* FOOTER CALL */}
      <section className="py-32 md:py-48 flex flex-col justify-center items-center text-center px-6 border-t border-foreground/5 relative overflow-hidden">
        <h2 className="text-[16vw] font-serif leading-[0.85] tracking-tighter text-foreground/5 mix-blend-screen absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          hl. catalog
        </h2>
        <Link 
          href="/" 
          className="relative z-10 px-10 py-5 border border-foreground/20 hover:bg-foreground hover:text-background transition-colors uppercase tracking-[0.2em] text-[10px] sm:text-xs font-bold flex items-center gap-3 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" />
          Вернуться в лабораторию
        </Link>
      </section>
    </main>
  );
}
