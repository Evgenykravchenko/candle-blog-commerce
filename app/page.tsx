"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { CopyPlus, ArrowUpRight, Star, ChevronDown, Menu, X, ArrowRight } from "lucide-react";

import { SCENTS } from "../data/products";
import { ProductCard } from "../components/ProductCard";

const REVIEWS = [
  { id: 1, text: "Форма, цвет и аромат — всё работает на создание абсолютной тишины в голове.", author: "A.S." },
  { id: 2, text: "Это не просто свеча. Это архитектура воздуха.", author: "M.V." },
  { id: 3, text: "Единственный бренд, чьи ароматы не спорят с пространством, а дополняют его.", author: "K.L." },
  { id: 4, text: "Никогда не думал, что запах может так четко передавать текстуру.", author: "D.R." },
  { id: 5, text: "Наполняет всю комнату за 10 минут, но совершенно не душит.", author: "O.P." },
  { id: 6, text: "Идеальный баланс между сложной парфюмерией и домашним уютом.", author: "S.T." },
  { id: 7, text: "Я перестала покупать другие свечи. Hombres Libres — это любовь.", author: "I.N." },
  { id: 8, text: "Аромат Пало Санто здесь — самый реалистичный из всех, что я пробовал.", author: "V.B." },
  { id: 9, text: "Фантастический минимализм во всем — от упаковки до самого горения.", author: "E.K." },
  { id: 10, text: "Свеча как медитация. Зажигаю каждый вечер после работы.", author: "N.A." },
  { id: 11, text: "Очень долгий срок горения и невероятно стильный стакан.", author: "T.M." },
  { id: 12, text: "Кашемир — мой абсолютный фаворит для холодных вечеров.", author: "R.L." }
];

const JOURNAL = [
  { id: 1, title: "Эстетика пустоты", tag: "Философия", badge: "Новое", date: "24 Окт 2024", img: "https://images.unsplash.com/photo-1602928321679-560bb453f190?q=80&w=800&auto=format&fit=crop" },
  { id: 2, title: "Ольфакторный минимализм", tag: "Парфюмерия", badge: "", date: "12 Окт 2024", img: "https://images.unsplash.com/photo-1602928321679-560bb453f190?q=80&w=800&auto=format&fit=crop" },
  { id: 3, title: "Свет как материал", tag: "Дизайн", badge: "Популярное", date: "28 Сен 2024", img: "https://images.unsplash.com/photo-1602928321679-560bb453f190?q=80&w=800&auto=format&fit=crop" },
  { id: 4, title: "Архитектура аромата", tag: "Интервью", badge: "", date: "15 Сен 2024", img: "https://images.unsplash.com/photo-1602928321679-560bb453f190?q=80&w=800&auto=format&fit=crop" }
];

const FAQS = [
  { id: 1, question: "Из чего сделаны ваши свечи?", answer: "Мы используем 100% натуральный соевый и кокосовый воск, без парафина и фталатов. Ароматы создаются на основе премиальных парфюмерных масел из Грасса (Франция)." },
  { id: 2, question: "Как долго горит одна свеча?", answer: "Свеча объемом 200 мл рассчитана на 45-50 часов чистого горения. Важно соблюдать правила при первом зажжении: дайте воску расплавиться до самых краев стакана (около 1.5 - 2 часов)." },
  { id: 3, question: "Доставляете ли вы в другие города?", answer: "Да, мы отправляем заказы по всей России удобной для вас транспортной компанией (СДЭК, Почта России). Заказы от 5000 ₽ доставляются бесплатно." },
  { id: 4, question: "Как ухаживать за свечой с деревянным фитилем?", answer: "Перед каждым новым зажжением (начиная со второго) обязательно подрезайте или аккуратно обламывайте сгоревшую часть фитиля, оставляя около 3-5 мм. Так свеча не будет коптить, а пламя будет ровным." },
  { id: 5, question: "Можно ли заказать индивидуальный аромат?", answer: "Мы регулярно проводим мастер-классы в нашей студии, где вы можете создать свечу с уникальным ароматом. Для корпоративных заказов (от 50 шт) возможна разработка эксклюзивной композиции." }
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [reviewIndex, setReviewIndex] = useState(0);
  const [isFaqDrawerOpen, setIsFaqDrawerOpen] = useState(false);
  
  // FAQ State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Quiz State
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [quizResult, setQuizResult] = useState<typeof SCENTS[0] | null>(null);

  const QUIZ_QUESTIONS = [
    {
      question: "Какое настроение вы ищете сегодня?",
      options: [
        { label: "Абсолютный покой", value: "peace" },
        { label: "Кристальный фокус", value: "focus" },
        { label: "Светлая меланхолия", value: "melancholy" },
        { label: "Внутренняя сила", value: "power" }
      ]
    },
    {
      question: "Какая текстура вам ближе?",
      options: [
        { label: "Сухое дерево и дым", value: "wood" },
        { label: "Холодная вода и свежесть", value: "fresh" },
        { label: "Тепло и пряности", value: "spice" },
        { label: "Мягкость и сладость", value: "sweet" }
      ]
    },
    {
      question: "Для какого времени суток эта свеча?",
      options: [
        { label: "Раннее утро", value: "morning" },
        { label: "Разгар дня", value: "day" },
        { label: "Глубокий вечер", value: "evening" },
        { label: "Бессонная ночь", value: "night" }
      ]
    }
  ];

  const handleQuizAnswer = (value: string) => {
    const newAnswers = [...quizAnswers, value];
    setQuizAnswers(newAnswers);
    
    if (quizStep < QUIZ_QUESTIONS.length - 1) {
      setQuizStep(prev => prev + 1);
    } else {
      // Logic for quiz result
      const mood = newAnswers[0];
      const texture = newAnswers[1];
      const time = newAnswers[2];
      
      let resultId = 1;
      
      if (mood === 'peace') resultId = 7; // Кашемир
      if (mood === 'focus') resultId = 9; // Индонезийский тик
      if (mood === 'melancholy') resultId = 1; // Осенний лес
      if (mood === 'power') resultId = 11; // Табак и ваниль
      
      if (texture === 'fresh' && mood === 'focus') resultId = 6; // Белый чай
      if (texture === 'sweet') resultId = 4; // Карамель
      if (texture === 'wood' && time === 'evening') resultId = 2; // Пало Санто
      if (time === 'morning' && texture === 'fresh') resultId = 10; // Лотос
      if (time === 'night' && mood === 'power') resultId = 3; // Амбра
      if (time === 'day' && texture === 'sweet') resultId = 8; // Инжир
      if (mood === 'power' && texture === 'wood') resultId = 5; // Кожа и Сандал
      
      setQuizResult(SCENTS.find(s => s.id === resultId) || SCENTS[0]);
      setQuizStep(prev => prev + 1);
    }
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setQuizAnswers([]);
    setQuizResult(null);
  };
  
  // Track whole window scroll for smooth parallax globally
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { mass: 0.1, stiffness: 100, damping: 20 });

  // Hero transforms (attached to global scroll to avoid specific container issues)
  const heroScale = useTransform(smoothProgress, [0, 0.2], [1, 1.15]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.15], [1, 0]);
  const heroTextY = useTransform(smoothProgress, [0, 0.2], [0, 150]);
  const heroBlur = useTransform(smoothProgress, [0, 0.1], ["blur(0px)", "blur(20px)"]);

  useEffect(() => {
    setMounted(true);
    document.body.style.backgroundColor = "white";
    
    // Handle scroll to hash after mounting (since we have a 'mounted' early return)
    if (typeof window !== 'undefined' && window.location.hash) {
      setTimeout(() => {
        const id = window.location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500); // Delay to allow full layout render
    }
  }, []);

  if (!mounted) return <div className="min-h-screen bg-background" />;

  return (
    // overflow-clip is used instead of overflow-hidden to prevent 
    // any intersection formatting context issues that cause double scrolling.
    <main className="bg-background text-foreground font-sans selection:bg-primary/30 w-full overflow-clip relative">
      
      {/* GLOBAL NOISE OVERLAY */}
      <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.04] mix-blend-screen bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')]" />

      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 py-4 px-6 md:px-12 bg-background/60 backdrop-blur-md border-b border-foreground/5 transition-all duration-300">
        <div className="flex justify-between items-center relative">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="flex flex-col gap-1 z-10"
          >
            <span className="font-serif italic text-xl md:text-2xl leading-none">Hombres Libres</span>
            <span className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] opacity-50">Мастерская ароматов</span>
          </motion.div>
          
          <motion.nav 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.8 }}
            className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 gap-6 lg:gap-10 text-[9px] uppercase tracking-[0.2em] w-max z-10"
          >
            <a href="#vision" className="hover:text-foreground/50 transition-colors">О бренде</a>
            <a href="#archives" className="hover:text-foreground/50 transition-colors">Витрина</a>
            <a href="#intuition" className="hover:text-foreground/50 transition-colors">Интуиция</a>
            <a href="#sensations" className="hover:text-foreground/50 transition-colors">Отзывы</a>
            <a href="#faq" className="hover:text-foreground/50 transition-colors">FAQ</a>
            <a href="#journal" className="hover:text-foreground/50 transition-colors">Журнал</a>
          </motion.nav>

          <div className="flex items-center gap-6 z-20">
            {/* Mobile Menu Toggle */}
            <motion.button 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.5 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center justify-center p-2 rounded-full border border-foreground/10 bg-foreground/10 text-foreground/70"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </motion.button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl flex flex-col pt-32 px-6 md:hidden pb-12 overflow-y-auto"
          >
            <nav className="flex flex-col gap-8 text-3xl font-serif italic text-foreground/90">
              <a href="#vision" onClick={() => setIsMobileMenuOpen(false)}>О бренде</a>
              <a href="#archives" onClick={() => setIsMobileMenuOpen(false)}>Витрина</a>
              <a href="#intuition" onClick={() => setIsMobileMenuOpen(false)}>Интуиция (Квиз)</a>
              <a href="#sensations" onClick={() => setIsMobileMenuOpen(false)}>Отзывы</a>
              <a href="#faq" onClick={() => setIsMobileMenuOpen(false)}>Вопросы и ответы</a>
              <a href="#journal" onClick={() => setIsMobileMenuOpen(false)}>Журнал</a>
            </nav>
            <div className="mt-auto border-t border-foreground/10 pt-8 flex flex-col gap-6">
              <div className="flex gap-6 mt-4 text-[10px] uppercase tracking-widest text-primary">
                <a href="#">Telegram</a>
                <a href="#">Instagram</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. CINEMATIC HERO (Standard Flow Without Sticking) */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden z-10">
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ scale: heroScale, opacity: heroOpacity, filter: heroBlur, y: heroTextY }}
        >
          <img 
            src="https://images.unsplash.com/photo-1605814050854-15f1c9fcbb0a?q=80&w=2000&auto=format&fit=crop" 
            alt="Hero Atmoshpere" 
            className="w-full h-full object-cover object-bottom opacity-40 mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-background z-10"></div>
        </motion.div>

        <motion.div 
          style={{ y: heroTextY, opacity: heroOpacity }}
          className="relative z-20 flex flex-col items-center w-full px-4"
        >
           <h1 className="text-[12vw] md:text-[8vw] font-serif leading-none text-center tracking-tighter mix-blend-difference relative py-8 z-30">
            <motion.span 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="block text-foreground uppercase px-4 pb-2"
            >
              Свечи,
            </motion.span>
             <motion.span 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 2, ease: "easeOut", delay: 0.8 }}
               className="block italic font-light text-transparent bg-clip-text bg-linear-to-r from-primary to-foreground py-6 px-4 mt-2"
            >
              создающие атмосферу.
            </motion.span>
           </h1>

           {/* Upper Corner Details (Filling Space) */}
           <motion.div 
             initial={{ opacity: 0, x: -30 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 1.5, delay: 1 }}
             className="absolute top-32 left-8 md:top-40 md:left-24 hidden lg:flex flex-col gap-3 mix-blend-difference z-20 max-w-[200px]"
           >
             <div className="w-12 h-px bg-primary/50"></div>
             <p className="text-[9px] uppercase tracking-widest text-primary">Ольфакторная <br/>Архитектура</p>
             <p className="text-[10px] text-foreground/40 font-light leading-relaxed mt-2 hidden xl:block">
               Создаем не просто запах, а форму и объем вашего пространства.
             </p>
           </motion.div>

           {/* Circular SVG Seal / Stamp */}
           <motion.div 
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1.5, delay: 1 }}
             className="absolute top-32 right-8 md:top-32 md:right-24 hidden lg:flex items-center justify-center mix-blend-difference z-20"
           >
             <motion.div
               animate={{ rotate: 360 }}
               transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
               className="w-32 h-32 md:w-40 md:h-40 relative flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-1000 cursor-default"
             >
               <svg viewBox="0 0 100 100" className="w-full h-full absolute inset-0 text-foreground overflow-visible">
                 <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent" />
                 <text fontSize="7" fill="currentColor" className="font-sans uppercase tracking-[0.3em] font-medium">
                   <textPath href="#circlePath" startOffset="0%">
                     hombres libres • свечи ручной работы •
                   </textPath>
                 </text>
               </svg>
               {/* Center Star */}
               <Star className="w-4 h-4 text-primary" />
             </motion.div>
           </motion.div>

           <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 1.5, delay: 1.5 }}
             className="mt-12 md:mt-20 flex flex-col items-center gap-8 relative z-30 mix-blend-difference"
           >
             <p className="font-light text-sm md:text-base text-foreground/70 max-w-md text-center leading-relaxed tracking-wider px-6">
               <span className="text-primary font-serif italic text-xl">Hombres Libres</span><br/> 
               Не просто аромат, а архитектура вашего пространства. 100% соевый воск, деревянный фитиль и глубокие композиции.
             </p>
             <a 
               href="#archives"
                className="group relative px-10 py-4 bg-primary border border-primary text-[10px] uppercase tracking-[0.2em] hover:bg-accent hover:border-accent transition-all duration-500 overflow-hidden"
             >
                <span className="relative z-10 transition-colors duration-500 text-white font-bold">Смотреть каталог свечей</span>
             </a>
           </motion.div>
        </motion.div>

        {/* Scrolling Text Marquee Background */}
        <div className="absolute bottom-10 md:bottom-20 w-full overflow-hidden flex z-0 opacity-[0.03] md:opacity-10 pointer-events-none mix-blend-overlay">
           <motion.div 
             animate={{ x: [0, -2000] }}
             transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
             className="flex whitespace-nowrap text-[8rem] md:text-[15rem] font-serif italic"
           >
             * СВЕЧИ РУЧНОЙ РАБОТЫ * СВЕЧИ РУЧНОЙ РАБОТЫ * СВЕЧИ РУЧНОЙ РАБОТЫ *
           </motion.div>
        </div>

        {/* Aesthetic Corner Details */}
        <div className="absolute bottom-8 md:bottom-12 left-6 md:left-12 hidden md:flex flex-col gap-2 text-[9px] uppercase tracking-[0.2em] text-foreground/40 z-20 mix-blend-difference">
          <span>Основано в 2024</span>
          <span>Ручная работа</span>
        </div>

        <div className="absolute bottom-8 md:bottom-12 right-6 md:right-12 hidden md:flex flex-col items-end gap-2 text-[9px] uppercase tracking-[0.2em] text-foreground/40 z-20 mix-blend-difference">
          <span>Серия 001</span>
          <span>Лимитированный выпуск</span>
        </div>

        {/* Animated Scroll Indicator */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20 pb-0 mix-blend-difference">
           <span className="text-[8px] uppercase tracking-[0.3em] text-foreground/30" style={{ writingMode: 'vertical-rl' }}>Листать вниз</span>
           <motion.div 
             className="w-px h-12 md:h-24 bg-linear-to-b from-foreground to-transparent opacity-30"
             animate={{ scaleY: [0, 1, 0], y: [0, 0, 30] }}
             transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
           />
        </div>
      </section>

      {/* 2. VISION (Philosophy) */}
      <section id="vision" className="relative py-16 md:py-24 px-6 md:px-12 z-20 bg-background">
        <div className="max-w-[90vw] mx-auto relative flex flex-col gap-16 md:gap-24">
          
          <div className="text-center mb-12 md:mb-16 relative z-20">
            <p className="text-[10px] uppercase tracking-[0.3em] text-primary mb-6">
              Манифест
            </p>
            <h2 className="text-4xl md:text-6xl font-serif">
              Три принципа <span className="italic text-foreground/50">тишины.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-8 xl:gap-12 relative z-10 w-full mb-8">
            {/* Point 01 */}
            <div className="relative z-10 flex flex-col h-full">
               {/* Fixed Giant Number Background */}
               <motion.div 
                 initial={{ opacity: 0 }}
                 whileInView={{ opacity: 1 }}
                 viewport={{ once: true }}
                 transition={{ duration: 1 }}
                 className="absolute -top-12 -left-6 lg:-top-16 lg:-left-6 text-[40vw] lg:text-[10rem] xl:text-[14rem] font-serif italic text-foreground/5 pointer-events-none select-none z-0 tracking-tighter leading-none"
               >
                 01
               </motion.div>
               <motion.div
                 initial={{ height: 0 }}
                 whileInView={{ height: "100%" }}
                 viewport={{ once: true }}
                 transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
                 className="absolute left-0 top-0 w-px bg-primary/30 z-10"
               />
               <div className="pl-6 xl:pl-8 py-8 relative z-20 grow">
                 <h3 className="text-2xl lg:text-3xl font-serif leading-[1.2] mb-4">
                   Свет — это не про видимость. <br className="hidden xl:block"/>
                   <span className="italic text-foreground/50">Это про ощущение.</span>
                 </h3>
                 <p className="text-sm xl:text-base font-light text-foreground/40 leading-relaxed mb-8">
                   Мы отвергаем конвейер. Каждая свеча — это объект для вашего сознания. Горит чисто, звучит как камин.
                 </p>
               </div>
               
               <motion.div 
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true, margin: "-10%" }}
                 transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
                 className="relative group mt-auto pl-6 xl:pl-8"
               >
                 <div className="aspect-4/3 overflow-hidden relative w-full">
                   <img 
                     src="https://images.unsplash.com/photo-1501127122-f385ca6ddd9d?q=80&w=800&auto=format&fit=crop" 
                     className="w-full h-full object-cover transition-all duration-[4s] object-top"
                     alt="Crafting"
                   />
                   <div className="absolute inset-0 bg-foreground/20 group-hover:bg-transparent transition-colors duration-1000"></div>
                 </div>
                 <div className="absolute -bottom-4 -left-2 bg-background p-3 border border-foreground/10 backdrop-blur-xl z-20">
                    <p className="font-serif italic text-base">Отлито вручную.</p>
                 </div>
               </motion.div>
            </div>

            {/* Point 02 */}
            <div className="relative z-10 flex flex-col h-full">
               {/* Fixed Giant Number Background */}
               <motion.div 
                 initial={{ opacity: 0 }}
                 whileInView={{ opacity: 1 }}
                 viewport={{ once: true }}
                 transition={{ duration: 1 }}
                 className="absolute -top-12 -left-6 lg:-top-16 lg:-left-6 text-[40vw] lg:text-[10rem] xl:text-[14rem] font-serif italic text-foreground/5 pointer-events-none select-none z-0 tracking-tighter leading-none"
               >
                 02
               </motion.div>
               <motion.div
                 initial={{ height: 0 }}
                 whileInView={{ height: "100%" }}
                 viewport={{ once: true }}
                 transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
                 className="absolute left-0 top-0 w-px bg-primary/30 z-10"
               />
               <div className="pl-6 xl:pl-8 py-8 relative z-20 grow">
                 <h3 className="text-2xl lg:text-3xl font-serif leading-[1.2] mb-4">
                   Никаких компромиссов. <br className="hidden xl:block"/>
                   <span className="italic text-foreground/50">Только лучшее.</span>
                 </h3>
                 <p className="text-sm xl:text-base font-light text-foreground/40 leading-relaxed mb-8">
                   Органический воск и масла Грасса. Дорогие, многослойные композиции, раскрывающиеся как духи.
                 </p>
               </div>

               <motion.div 
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true, margin: "-10%" }}
                 transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                 className="relative group mt-auto pl-6 xl:pl-8"
               >
                 <div className="aspect-4/3 overflow-hidden relative w-full">
                   <img 
                     src="https://images.unsplash.com/photo-1501127122-f385ca6ddd9d?q=80&w=800&auto=format&fit=crop" 
                     className="w-full h-full object-cover transition-all duration-[4s] object-center"
                     alt="Ingredients"
                   />
                   <div className="absolute inset-0 bg-foreground/20 group-hover:bg-transparent transition-colors duration-1000"></div>
                 </div>
                 <div className="absolute -bottom-4 -left-2 bg-background p-3 border border-foreground/10 backdrop-blur-xl z-20">
                    <p className="font-serif italic text-base">Масла Грасса.</p>
                 </div>
               </motion.div>
            </div>

            {/* Point 03 */}
            <div className="relative z-10 flex flex-col h-full">
               {/* Fixed Giant Number Background */}
               <motion.div 
                 initial={{ opacity: 0 }}
                 whileInView={{ opacity: 1 }}
                 viewport={{ once: true }}
                 transition={{ duration: 1 }}
                 className="absolute -top-12 -left-6 lg:-top-16 lg:-left-6 text-[40vw] lg:text-[10rem] xl:text-[14rem] font-serif italic text-foreground/5 pointer-events-none select-none z-0 tracking-tighter leading-none"
               >
                 03
               </motion.div>
               <motion.div
                 initial={{ height: 0 }}
                 whileInView={{ height: "100%" }}
                 viewport={{ once: true }}
                 transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
                 className="absolute left-0 top-0 w-px bg-primary/30 z-10"
               />
               <div className="pl-6 xl:pl-8 py-8 relative z-20 grow">
                 <h3 className="text-2xl lg:text-3xl font-serif leading-[1.2] mb-4">
                   Искусство тишины. <br className="hidden xl:block"/>
                   <span className="italic text-foreground/50">Ваше время.</span>
                 </h3>
                 <p className="text-sm xl:text-base font-light text-foreground/40 leading-relaxed mb-8">
                   В мире шума мы предлагаем остановиться. Замедление — новая роскошь для архитектуры вечера.
                 </p>
               </div>

               <motion.div 
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true, margin: "-10%" }}
                 transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                 className="relative group mt-auto pl-6 xl:pl-8"
               >
                 <div className="aspect-4/3 overflow-hidden relative w-full">
                   <img 
                     src="https://images.unsplash.com/photo-1501127122-f385ca6ddd9d?q=80&w=800&auto=format&fit=crop" 
                     className="w-full h-full object-cover transition-all duration-[4s] object-center"
                     alt="Time"
                   />
                   <div className="absolute inset-0 bg-foreground/20 group-hover:bg-transparent transition-colors duration-1000"></div>
                 </div>
                 <div className="absolute -bottom-4 -left-2 bg-background p-3 border border-foreground/10 backdrop-blur-xl z-20">
                    <p className="font-serif italic text-base">40+ часов.</p>
                 </div>
               </motion.div>
            </div>
          </div>

        </div>
      </section>
      {/* 3. ARCHIVES (Catalog) */}
      <section id="archives" className="py-24 md:py-32 relative border-t border-foreground/5 overflow-hidden">
        <div className="px-6 md:px-12 mb-16 flex flex-col md:flex-row justify-between items-end gap-12">
          <h2 className="text-[15vw] md:text-[8vw] font-serif leading-[0.8] tracking-tighter mix-blend-difference">
            СВЕЧИ<br/><span className="italic text-foreground/40 ml-12">Каталог.</span>
          </h2>
          <p className="max-w-xs text-xs font-light text-foreground/40 leading-relaxed uppercase tracking-widest text-justify">
            Ольфакторная библиотека. Тщательно отобранные композиции, собранные из лучших масел Грасса.
          </p>
        </div>

        <div className="px-6 md:px-12 grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8 md:gap-12 lg:gap-16">
          {SCENTS.map((scent, i) => (
            <ProductCard key={scent.id} scent={scent} index={i} />
          ))}
        </div>
        
        <div className="px-6 mt-16 md:hidden">
           <Link href="/product/1" className="block w-full text-center uppercase tracking-widest text-[10px] border border-primary/30 py-4 text-primary hover:bg-primary hover:text-white transition-colors">
            Смотреть всю коллекцию
          </Link>
        </div>
      </section>

      {/* 4. INTUITION (Scent Quiz) */}
      <section id="intuition" className="py-32 md:py-64 relative border-t border-foreground/5 bg-secondary min-h-[80vh] flex items-center overflow-hidden">
        {/* Abstract background blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-accent/10 blur-[120px] rounded-full pointer-events-none transition-all duration-1000" style={{ opacity: quizStep === QUIZ_QUESTIONS.length ? 0.3 : 0.1 }}></div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-20 w-full">
           <AnimatePresence mode="wait">
             {quizStep < QUIZ_QUESTIONS.length ? (
               <motion.div
                 key={`quiz-step-${quizStep}`}
                 initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                 animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                 exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                 transition={{ duration: 0.8, ease: "easeOut" }}
                 className="flex flex-col items-center"
               >
                 <p className="text-[10px] uppercase tracking-[0.3em] text-primary mb-8 md:mb-12">
                   Шаг 0{quizStep + 1}
                 </p>
                 <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif italic mb-12 md:mb-16 text-foreground/90">
                   {QUIZ_QUESTIONS[quizStep].question}
                 </h2>
                 
                 <div className="flex flex-wrap justify-center gap-4 md:gap-6 w-full max-w-2xl">
                   {QUIZ_QUESTIONS[quizStep].options.map((option, idx) => (
                      <motion.button 
                        key={option.value}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + (idx * 0.1), duration: 0.5 }}
                        onClick={() => handleQuizAnswer(option.value)}
                        className="border border-foreground/10 bg-foreground/10 text-foreground/50 hover:bg-accent hover:text-white hover:border-accent transition-all duration-500 px-8 md:px-12 py-4 md:py-5 rounded-full text-xs font-light tracking-widest uppercase backdrop-blur-md w-full sm:w-auto"
                      >
                        {option.label}
                      </motion.button>
                   ))}
                 </div>
                 
                 {/* Progress indicator */}
                 <div className="flex gap-2 mt-24">
                   {QUIZ_QUESTIONS.map((_, i) => (
                     <div key={i} className={`h-[1px] w-8 md:w-16 transition-all duration-500 ${i === quizStep ? 'bg-primary' : i < quizStep ? 'bg-foreground/30' : 'bg-foreground/10'}`}></div>
                   ))}
                 </div>
               </motion.div>
             ) : quizResult && (
               <motion.div
                 key="quiz-result"
                 initial={{ opacity: 0, scale: 0.95, filter: "blur(20px)" }}
                 animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                 transition={{ duration: 1.2, ease: "easeOut" }}
                 className="flex flex-col items-center"
               >
                 <p className="text-[10px] uppercase tracking-[0.3em] text-primary mb-8">
                   Ваша интуиция выбрала
                 </p>
                 
                 <div className="relative group w-[280px] md:w-[320px] aspect-square mb-8 overflow-hidden rounded-sm">
                   <img src={quizResult.img} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" alt={quizResult.title} />
                   <div className="absolute inset-0 bg-foreground/20 group-hover:bg-transparent transition-colors duration-1000"></div>
                 </div>
                 
                 <h3 className="text-4xl md:text-5xl font-serif mb-4 text-foreground/90">{quizResult.title}</h3>
                 <p className="text-sm font-light uppercase tracking-widest text-primary mb-6">{quizResult.slogan}</p>
                 <p className="text-xs font-serif italic text-foreground/50 mb-12 border-b border-foreground/10 pb-12 px-12">
                   Ноты: {quizResult.notes}
                 </p>
                 
                 <div className="flex flex-col sm:flex-row gap-4 items-center">
                   <Link href={`/product/${quizResult.id}`} className="block text-center bg-accent text-white px-12 py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-accent/80 transition-colors duration-500 w-full sm:w-auto">
                     Подробнее
                   </Link>
                   <button onClick={resetQuiz} className="border border-foreground/20 text-foreground/50 px-8 py-4 text-[10px] uppercase tracking-widest hover:border-foreground hover:text-foreground transition-colors duration-500 w-full sm:w-auto">
                     Пройти снова
                   </button>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </section>

      {/* 5. SENSATIONS (Reviews) */}
      <section id="sensations" className="py-24 md:py-48 bg-primary text-background relative overflow-hidden flex flex-col gap-16 md:gap-24">
        <div className="max-w-7xl mx-auto px-6 w-full relative z-20 flex flex-col items-center">
            <h2 className="text-[12vw] md:text-[8vw] font-serif leading-[0.8] tracking-tighter mix-blend-overlay opacity-20 mb-12 md:mb-16">
              Отзывы.
            </h2>
            
            <div className="relative w-full">
              <div className="overflow-hidden">
                <motion.div 
                  className="flex"
                  animate={{ x: `-${(reviewIndex * 100) / REVIEWS.length}%` }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  style={{ width: `${(REVIEWS.length / (typeof window !== 'undefined' && window.innerWidth < 1024 ? 1 : 3)) * 100}%` }}
                >
                  {REVIEWS.map((rev) => (
                    <div 
                      key={rev.id} 
                      className="flex-none w-[calc(100%/12)] px-3 md:px-4"
                    >
                      <div className="bg-background/5 backdrop-blur-sm border border-background/10 p-8 md:p-10 flex flex-col justify-between min-h-[300px] md:min-h-[380px] hover:bg-background/8 transition-colors duration-500 group/card relative">
                        <div>
                          <div className="flex gap-1.5 mb-6">
                            {[...Array(5)].map((_,idx) => <Star key={idx} className="w-3.5 h-3.5 fill-background text-background" />)}
                          </div>
                          <p className="font-serif italic text-xl md:text-2xl leading-relaxed text-background/90">
                            "{rev.text}"
                          </p>
                        </div>
                        <div className="flex justify-between items-end border-t border-background/10 pt-6">
                          <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold opacity-60">— {rev.author}</span>
                          <div className="w-8 h-px bg-background/20 group-hover/card:w-16 transition-all duration-500"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Navigation Controls */}
              <div className="flex justify-between items-center mt-12 md:mt-24 max-w-7xl mx-auto w-full px-6">
                <div className="flex gap-2">
                   {Array.from({ length: Math.ceil(REVIEWS.length / 3) }).map((_, i) => (
                    <button 
                      key={i} 
                      onClick={() => setReviewIndex(i * 3)}
                      className={`h-1 transition-all duration-500 rounded-full ${Math.floor(reviewIndex / 3) === i ? 'w-12 bg-background' : 'w-2 bg-background/20'}`}
                    />
                  ))}
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => {
                      if (reviewIndex === 0) {
                        setReviewIndex(REVIEWS.length - 3);
                      } else {
                        setReviewIndex(prev => Math.max(0, prev - 1));
                      }
                    }}
                    className="w-14 h-14 rounded-full border border-background/20 flex items-center justify-center hover:bg-background hover:text-primary transition-all group/btn"
                  >
                    <ArrowRight className="w-6 h-6 rotate-180 group-hover/btn:-translate-x-1 transition-transform" />
                  </button>
                  <button 
                    onClick={() => {
                      if (reviewIndex >= REVIEWS.length - 3) {
                        setReviewIndex(0);
                      } else {
                        setReviewIndex(prev => prev + 1);
                      }
                    }}
                    className="w-14 h-14 rounded-full border border-background/20 flex items-center justify-center hover:bg-background hover:text-primary transition-all group/btn"
                  >
                    <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
        </div>
      </section>

      {/* 5.5 FAQ SECTION */}
      <section id="faq" className="py-24 md:py-48 bg-background text-foreground border-t border-foreground/5 relative z-10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          
          <div className="flex flex-col md:flex-row gap-12 md:gap-24">
            {/* Title Column */}
            <div className="md:w-1/3 flex flex-col items-start gap-8">
               <h2 className="text-[10vw] md:text-[6vw] font-serif leading-[0.8] tracking-tighter">
                 Вопросы <br/><span className="italic text-foreground/40">и ответы.</span>
               </h2>
               <p className="text-foreground/40 text-[10px] uppercase tracking-widest font-light mt-4 max-w-xs leading-relaxed">
                 Знание — это основа правильного ритуала. Все, что нужно понимать перед зажжением.
               </p>
               <button 
                 onClick={() => setIsFaqDrawerOpen(true)}
                 className="hidden md:flex uppercase tracking-widest text-[10px] border-b border-foreground/30 pb-1 hover:border-foreground hover:text-foreground text-foreground/60 transition-colors mt-8"
               >
                 Задать свой вопрос
               </button>
            </div>

            {/* Accordion Column */}
            <div className="md:w-2/3 flex flex-col border-t border-foreground/10">
              {FAQS.map((faq, index) => {
                const isOpen = openFaq === faq.id;
                return (
                  <div 
                    key={faq.id} 
                    className="border-b border-foreground/10 overflow-hidden"
                  >
                    <button 
                      onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                      className="w-full flex items-center justify-between py-6 lg:py-8 text-left group hover:bg-foreground/2 transition-colors"
                    >
                      <h3 className={`text-xl lg:text-3xl font-serif transition-colors duration-500 pr-8 ${isOpen ? "text-foreground" : "text-foreground/70 group-hover:text-foreground"}`}>
                        {faq.question}
                      </h3>
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-500 ${isOpen ? "bg-primary text-white border-primary" : "border-primary/30 text-primary/50 group-hover:border-primary group-hover:text-primary"}`}>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-500 ${isOpen ? "rotate-180" : "rotate-0"}`} />
                      </div>
                    </button>
                    
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                        >
                          <div className="pb-8 lg:pb-10 pt-2 text-sm lg:text-base text-foreground/50 font-light leading-relaxed max-w-2xl">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>

            {/* Mobile Button */}
            <div className="w-full mt-4 md:hidden">
               <button 
                 onClick={() => setIsFaqDrawerOpen(true)}
                 className="w-full uppercase tracking-widest text-[10px] border border-primary/30 py-4 text-primary hover:bg-primary hover:text-white transition-colors"
               >
                 Задать свой вопрос
               </button>
            </div>
            
          </div>
        </div>
      </section>

      {/* 5.5 CALL TO ACTION (CTA) */}
      <section className="py-24 md:py-32 relative overflow-hidden bg-secondary">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-accent/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute top-0 w-full h-px bg-linear-to-r from-transparent via-accent/30 to-transparent"></div>
        <div className="absolute bottom-0 w-full h-px bg-linear-to-r from-transparent via-accent/30 to-transparent"></div>

        <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center text-center">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold text-primary mb-8">
            Готовы к новому опыту?
          </span>
          
          <h2 className="text-3xl md:text-5xl lg:text-7xl font-serif text-foreground mb-12 max-w-4xl leading-tight">
            Найдите <i className="text-foreground/50">свой</i> манифест тишины в нашей коллекции
          </h2>
          
          <a 
            href="#archives" 
            className="group relative px-12 py-5 bg-primary text-white overflow-hidden flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
            <span className="relative z-10 text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold group-hover:text-white transition-colors duration-500 flex items-center gap-3">
              Смотреть коллекцию
              <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform duration-500" />
            </span>
          </a>
        </div>
      </section>

      {/* 6. JOURNAL (Blog Preview) */}
      <section id="journal" className="py-32 md:py-64 relative bg-background border-t border-foreground/5">
        <div className="px-6 md:px-12 mb-24 flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
          <h2 className="text-[12vw] md:text-[8vw] font-serif leading-[0.8] tracking-tighter">
             Наш <br className="hidden md:block"/><span className="italic text-foreground/40">Журнал.</span>
          </h2>
          <button className="hidden md:block uppercase tracking-widest text-[10px] border-b border-foreground/30 pb-1 hover:border-foreground hover:text-foreground text-foreground/60 transition-colors">
            Читать весь архив
          </button>
        </div>

        <div className="px-6 md:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-8">
          {JOURNAL.map((post, i) => (
            <motion.a 
              href="#"
              key={post.id} 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="group flex flex-col gap-6 cursor-pointer"
            >
              <div className="aspect-square overflow-hidden bg-foreground/5 relative border border-foreground/5">
                <img 
                  src={post.img} 
                  alt={post.title} 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[2s]" 
                />
                <div className="absolute top-3 left-3 md:top-4 md:left-4 z-20 flex gap-2">
                   {post.badge && (
                     <span className="bg-primary/80 backdrop-blur-md border border-primary/50 px-2 py-1 text-[8px] md:text-[10px] uppercase tracking-widest text-primary-foreground">
                       {post.badge}
                     </span>
                   )}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-[9px] uppercase tracking-widest">
                  <span className="text-primary">{post.tag}</span>
                  <span className="text-foreground/40">{post.date}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-serif text-foreground/90 group-hover:text-foreground transition-colors line-clamp-2">{post.title}</h3>
              </div>
            </motion.a>
          ))}
        </div>
        
        <div className="px-6 mt-16 md:hidden">
           <button className="w-full uppercase tracking-widest text-[10px] border border-foreground/20 py-4 hover:bg-foreground hover:text-background transition-colors">
            Читать весь архив
          </button>
        </div>
      </section>

      {/* 7. FOOTER (Premium Layout) */}
      <footer className="bg-secondary text-foreground pt-24 md:pt-40 pb-6 rounded-t-[3rem] md:rounded-t-[5rem] relative -mt-12 z-20 border-t border-foreground/10 shadow-[0_-10px_30px_rgba(0,0,0,0.06)]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 mb-24 md:mb-40">
            {/* Brand Column */}
            <div className="md:col-span-4 flex flex-col gap-6">
              <div className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center border border-foreground/10 mb-4">
                 <span className="font-serif italic text-2xl text-foreground">hl.</span>
              </div>
              <p className="text-foreground/50 text-xs md:text-sm font-light leading-relaxed max-w-sm">
                Создаем архитектуру воздуха с 2024 года. 
                Каждая свеча — это манифест тишины, отлитый вручную в нашей петербургской лаборатории.
              </p>

              <div className="flex flex-col gap-4 mt-4 text-foreground/70 font-light text-base">
                <a href="mailto:hello@hombreslibres.ru" className="hover:text-foreground transition-colors flex items-center gap-4">
                  <span className="text-[10px] uppercase tracking-widest text-primary w-16">Почта</span>
                  hello@hombreslibres.ru
                </a>
                <a href="tel:+79991234567" className="hover:text-foreground transition-colors flex items-center gap-4">
                  <span className="text-[10px] uppercase tracking-widest text-primary w-16">Телефон</span>
                  +7 (999) 123-45-67
                </a>
              </div>

              <div className="mt-8 flex gap-6 text-[10px] font-light text-foreground/40">
                 <a href="#" className="hover:text-primary transition-colors uppercase tracking-[0.2em]">Telegram</a>
                 <a href="#" className="hover:text-primary transition-colors uppercase tracking-[0.2em]">Instagram</a>
                 <a href="#" className="hover:text-primary transition-colors uppercase tracking-[0.2em]">Ozon</a>
              </div>
            </div>

            {/* Nav Columns */}
            <div className="md:col-start-6 md:col-span-2 flex flex-col gap-6">
              <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-foreground/30 border-b border-foreground/10 pb-4 mb-2">Навигация</span>
              <a href="#archives" className="text-base md:text-lg text-foreground/70 hover:text-foreground hover:translate-x-2 transition-all">Коллекция</a>
              <a href="#vision" className="text-base md:text-lg text-foreground/70 hover:text-foreground hover:translate-x-2 transition-all">О бренде</a>
              <a href="#sensations" className="text-base md:text-lg text-foreground/70 hover:text-foreground hover:translate-x-2 transition-all">Отзывы</a>
              <a href="#journal" className="text-base md:text-lg text-foreground/70 hover:text-foreground hover:translate-x-2 transition-all">Журнал</a>
            </div>

            <div className="md:col-span-2 flex flex-col gap-6">
              <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-foreground/30 border-b border-foreground/10 pb-4 mb-2">Покупателям</span>
              <a href="#" className="text-base md:text-lg text-foreground/70 hover:text-foreground hover:translate-x-2 transition-all">Доставка и оплата</a>
              <a href="#" className="text-base md:text-lg text-foreground/70 hover:text-foreground hover:translate-x-2 transition-all">Возврат</a>
              <button 
                onClick={() => setIsFaqDrawerOpen(true)}
                className="text-base md:text-lg text-foreground/70 hover:text-foreground hover:translate-x-2 transition-all text-left"
              >
                Вопросы (FAQ)
              </button>
            </div>

            {/* Newsletter Column */}
            <div className="md:col-span-3 flex flex-col justify-start">
              <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-primary border-b border-primary/20 pb-4 mb-6">Закрытый клуб</span>
              <p className="text-xs text-foreground/50 mb-6 leading-relaxed">
                Оставьте email, чтобы первыми узнавать о лимитированных дропах и секретных ароматах.
              </p>
              <div className="flex border-b border-foreground/30 group hover:border-primary transition-colors relative">
                <input type="email" placeholder="ВВЕДИТЕ E-MAIL" className="w-full bg-transparent p-3 pl-0 outline-none text-xs tracking-widest uppercase placeholder:text-foreground/20 text-foreground" />
                <button className="p-3 pr-0 text-foreground/50 group-hover:text-primary transition-colors hover:scale-110 active:scale-95">
                  <ArrowUpRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

        </div>
        
        {/* Scroll to top */}
        <div className="flex justify-center border-t border-foreground/5 pt-12 pb-8">
            <a href="#" className="flex justify-center items-center transition-transform hover:-translate-y-2 px-8 py-3 rounded-full bg-background/40 backdrop-blur-xl border border-foreground/10 hover:border-foreground/30 cursor-pointer text-foreground/50 hover:text-foreground group">
                <ArrowUpRight className="w-4 h-4 mr-2 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" /> 
                <span className="text-[9px] uppercase tracking-widest font-bold">Наверх</span>
            </a>
        </div>

        {/* Massive Brand Text */}
        <div className="w-full overflow-hidden relative flex justify-center pb-8 md:pb-12 px-6">
            <h2 className="text-[14vw] font-serif leading-[0.85] tracking-tighter text-center select-none pointer-events-none text-foreground/5">
              Hombres Libres.
            </h2>
        </div>
        
        {/* Legal bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] uppercase tracking-widest font-bold pt-4 px-6 relative z-10 text-foreground/30">
          <p className="text-[10px] md:text-xs text-foreground/40 font-light mt-4 md:mt-0">© 2024 Hombres Libres. Все права защищены</p>
          <div className="flex gap-6 mt-4 md:mt-0 text-[10px] md:text-xs text-foreground/40 font-light">
            <a href="#" className="hover:text-foreground transition-colors">Политика конфиденциальности</a>
            <a href="#" className="hover:text-foreground transition-colors hidden sm:block">Пользовательское соглашение</a>
          </div>
        </div>
      </footer>

      {/* FAQ DRAWER (Side Panel) */}
      <AnimatePresence>
        {isFaqDrawerOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => setIsFaqDrawerOpen(false)}
              className="fixed inset-0 z-60 bg-black/40 backdrop-blur-sm"
            />
            {/* Slide-out Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 right-0 w-full md:w-[480px] h-full z-70 bg-white border-l border-foreground/10 flex flex-col pt-8 px-6 md:px-10 pb-10 overflow-y-auto shadow-[-10px_0_40px_rgba(0,0,0,0.08)]"
            >
              <div className="flex justify-between items-center mb-12 mt-4 md:mt-0 space-x-4">
                <span className="font-serif italic text-3xl md:text-4xl leading-none text-foreground">Связь с нами</span>
                <button 
                  onClick={() => setIsFaqDrawerOpen(false)}
                  className="w-10 h-10 shrink-0 rounded-full border border-foreground/10 flex items-center justify-center text-foreground/50 hover:text-foreground hover:bg-foreground/5 hover:border-foreground/30 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 flex flex-col gap-8">
                <p className="text-foreground/60 font-light text-sm md:text-base leading-relaxed">
                  Оставьте свой вопрос, и создатель Hombres Libres лично ответит вам в ближайшее время. Мы ценим внимание к деталям и ваш интерес.
                </p>

                <form className="flex flex-col gap-8 mt-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="flex flex-col gap-3">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-primary">Ваше имя</label>
                    <input 
                      type="text" 
                      placeholder="Александр"
                      className="w-full bg-transparent border-b border-foreground/20 py-3 text-foreground placeholder:text-foreground/30 focus:outline-hidden focus:border-primary transition-colors text-lg font-serif italic"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-primary">Куда прислать ответ?</label>
                    <input 
                      type="text" 
                      placeholder="Email или Telegram (@username)"
                      className="w-full bg-transparent border-b border-foreground/20 py-3 text-foreground placeholder:text-foreground/30 focus:outline-hidden focus:border-primary transition-colors text-lg font-serif italic"
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-primary">Сообщение</label>
                    <textarea 
                      placeholder="Опишите, что вас интересует..."
                      rows={4}
                      className="w-full bg-foreground/5 border border-foreground/10 p-4 text-foreground placeholder:text-foreground/30 focus:outline-hidden focus:border-primary/40 focus:bg-foreground/5 transition-colors resize-none mt-2 font-light text-base rounded-none"
                    />
                  </div>

                  <button 
                    onClick={() => setIsFaqDrawerOpen(false)}
                    className="mt-8 w-full bg-primary text-white py-5 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-accent transition-all transform hover:-translate-y-1"
                  >
                    Отправить послание
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </main>
  );
}


