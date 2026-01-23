
import { useState, useEffect, useRef } from "react";
import { theme } from "../theme";
import { Link } from "react-router-dom";
import { 
  FiArrowRight, 
  FiScissors, 
  FiPenTool, 
  FiFeather, 
  FiHeart,
  FiShoppingBag
} from "react-icons/fi";

/**
 * A hook to get the normalized scroll progress (0 to 1) 
 * for a specific section.
 */
function useSectionScroll(ref: React.RefObject<HTMLDivElement | null>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how much of the section has passed the viewport
      // 0 when the top is at the bottom of the viewport
      // 1 when the bottom is at the top of the viewport
      const totalScrollArea = rect.height + windowHeight;
      const currentScroll = windowHeight - rect.top;
      
      const p = Math.min(Math.max(currentScroll / totalScrollArea, 0), 1);
      setProgress(p);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, [ref]);

  return progress;
}

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const showCaseRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);

  const heroProgress = useSectionScroll(heroRef);
  const showCaseProgress = useSectionScroll(showCaseRef);
  const storyProgress = useSectionScroll(storyRef);

  const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: theme.colors.background }}>
      
      {/* 1. DYNAMIC HERO: THE UNVUEILING */}
      <section 
        ref={heroRef}
        className="relative h-[200vh] bg-stone-900 overflow-hidden"
      >
        <div className="sticky top-0 h-screen w-full flex items-center justify-center">
          {/* Background Text: "CRAFT" */}
          <div 
            className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none select-none"
            style={{ 
                transform: `scale(${1 + heroProgress * 2})`,
                opacity: 0.1 * (1 - heroProgress)
            }}
          >
            <span className="text-[30vw] font-black tracking-tighter text-white">CRAFT</span>
          </div>

          {/* Main Title Split Animation */}
          <div className="relative text-center z-10">
            <h1 className="flex flex-col text-7xl md:text-[10rem] font-black leading-none tracking-tighter text-white">
              <span 
                className="inline-block transition-transform duration-75"
                style={{ transform: `translateX(${-heroProgress * 150}px) rotate(${-heroProgress * 10}deg)` }}
              >
                MADE BY
              </span>
              <span 
                className="inline-block italic font-serif text-secondary transition-transform duration-75"
                style={{ 
                    transform: `translateX(${heroProgress * 150}px) rotate(${heroProgress * 10}deg)`,
                    color: theme.colors.secondary 
                }}
              >
                HEART.
              </span>
            </h1>
            
            <div 
              className="mt-12 space-y-6 transition-all duration-300"
              style={{ 
                opacity: 1 - heroProgress * 2,
                transform: `translateY(${heroProgress * 50}px)`
              }}
            >
              <p className="text-xl md:text-2xl text-stone-400 font-medium max-w-xl mx-auto px-4">
                A digital studio dedicated to the art of creation. 
                Original paintings, delicate crochet, and timeless digital crafts.
              </p>
              <Link 
                to="/shop"
                className="inline-flex items-center gap-4 px-10 py-5 rounded-full font-black text-xl transition-all hover:scale-105 active:scale-95"
                style={{ backgroundColor: theme.colors.secondary, color: theme.colors.background }}
              >
                Enter the Shop <FiArrowRight />
              </Link>
            </div>
          </div>

          {/* Floating Accents */}
          <div 
             className="absolute top-1/4 left-10 md:left-20 text-stone-700 opacity-20"
             style={{ transform: `translateY(${-scrollY * 0.2}px) rotate(${scrollY * 0.1}deg)` }}
          >
              <FiScissors size={120} />
          </div>
          <div 
             className="absolute bottom-1/4 right-10 md:right-20 text-stone-700 opacity-20"
             style={{ transform: `translateY(${-scrollY * 0.5}px) rotate(${-scrollY * 0.05}deg)` }}
          >
              <FiPenTool size={160} />
          </div>
        </div>
      </section>

      {/* 2. CRAFT SHOWCASE: THE ASSEMBLY */}
      <section 
        ref={showCaseRef}
        className="relative py-40 md:py-80 bg-stone-100"
      >
        <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                <div className="space-y-8 z-10">
                    <h2 
                        className="text-5xl md:text-8xl font-black leading-tight tracking-tighter"
                        style={{ color: theme.colors.primary }}
                    >
                        Every Stitch <br /> 
                        Every Stroke.
                    </h2>
                    <p className="text-xl md:text-2xl opacity-60 max-w-lg leading-relaxed">
                        From vibrant oil paintings to intricate handmade crochet. 
                        We bring the artisan's workshop directly to your home.
                    </p>
                    <Link 
                        to="/shop" 
                        className="group inline-flex items-center gap-4 text-2xl font-black transition-all hover:translate-x-2"
                        style={{ color: theme.colors.secondary }}
                    >
                        Explore Crafts <FiArrowRight />
                    </Link>
                </div>

                {/* The "Crazy" Assembly Grid */}
                <div className="relative h-[600px] md:h-[800px]">
                    {/* Floating Decorative Icons (Parallax) */}
                    <div 
                        className="absolute -top-10 -left-10 text-secondary opacity-20 pointer-events-none"
                        style={{ transform: `translate(${-showCaseProgress * 50}px, ${-showCaseProgress * 100}px) rotate(${showCaseProgress * 90}deg)` }}
                    >
                        <FiHeart size={80} />
                    </div>
                    <div 
                        className="absolute bottom-40 right-10 text-primary opacity-10 pointer-events-none"
                        style={{ transform: `translate(${showCaseProgress * 80}px, ${showCaseProgress * 50}px) rotate(${-showCaseProgress * 45}deg)` }}
                    >
                        <FiPenTool size={120} />
                    </div>

                    {/* Floating Item 1: Painting */}
                    <div 
                        className="absolute top-0 right-0 w-64 md:w-80 h-96 rounded-3xl p-8 flex flex-col justify-end shadow-2xl transition-all duration-75 z-20"
                        style={{ 
                            backgroundColor: theme.colors.primary,
                            transform: `translate(
                                ${(1 - showCaseProgress) * 500}px, 
                                ${(1 - showCaseProgress) * -300}px
                            ) rotate(${(1 - showCaseProgress) * 60}deg)`,
                            opacity: Math.min(showCaseProgress * 2, 1),
                            boxShadow: `0 40px 60px -15px ${theme.colors.primary}60`
                        }}
                    >
                        <FiFeather className="text-white/20 absolute top-8 left-8" size={64} />
                        <h4 className="text-white text-3xl font-black mb-2">Art Pieces</h4>
                        <p className="text-white/60 font-bold">Original oil & acrylic narratives.</p>
                    </div>

                    {/* Floating Item 2: Crochet / Crafts */}
                    <div 
                        className="absolute bottom-20 left-0 w-64 md:w-80 h-96 rounded-3xl p-8 flex flex-col justify-end shadow-2xl transition-all duration-75 z-10"
                        style={{ 
                            backgroundColor: theme.colors.secondary,
                            transform: `translate(
                                ${(1 - showCaseProgress) * -500}px, 
                                ${(1 - showCaseProgress) * 300}px
                            ) rotate(${(1 - showCaseProgress) * -45}deg)`,
                            opacity: Math.min(showCaseProgress * 2, 1),
                            boxShadow: `0 40px 60px -15px ${theme.colors.secondary}60`
                        }}
                    >
                        <FiScissors className="text-white/20 absolute top-8 left-8" size={64} />
                        <h4 className="text-white text-3xl font-black mb-2">Handmade</h4>
                        <p className="text-white/80 font-bold">Crochet, crafts & home decor.</p>
                    </div>

                    {/* Floating Item 3: Digital (The Nucleus) */}
                    <div 
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full flex items-center justify-center transition-all duration-75 z-30"
                        style={{ 
                            backgroundColor: theme.colors.accent,
                            transform: `translate(-50%, -50%) scale(${showCaseProgress * 1.5}) rotate(${showCaseProgress * 360}deg)`,
                            opacity: Math.min(showCaseProgress * 3, 1),
                            boxShadow: `0 20px 40px -10px ${theme.colors.primary}30`
                        }}
                    >
                        <FiHeart size={48} style={{ color: theme.colors.primary }} />
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* 3. ARTIST NARRATIVE: THE CONCENTRIC EXPERIENCE */}
      <section 
        ref={storyRef}
        className="relative py-40 md:py-80 bg-white overflow-hidden"
      >
        {/* Parallax Background Rings */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            {[1, 2, 3, 4, 5].map(i => (
                <div 
                    key={i}
                    className="absolute border-stone-900 border rounded-full transition-transform duration-75"
                    style={{ 
                        width: `${i * 300}px`, 
                        height: `${i * 300}px`,
                        transform: `scale(${1 + storyProgress * i * 0.15})`
                    }}
                />
            ))}
        </div>

        <div className="max-w-4xl mx-auto px-4 text-center space-y-16 relative z-10">
           <div 
                className="inline-block p-6 rounded-3xl transition-transform duration-75" 
                style={{ 
                    backgroundColor: `${theme.colors.secondary}10`,
                    transform: `rotate(${storyProgress * 720}deg) scale(${1 + storyProgress * 0.5})`
                }}
            >
              <FiShoppingBag className="text-5xl" style={{ color: theme.colors.secondary }} />
           </div>
           
           <h3 
                className="text-4xl md:text-7xl font-black tracking-tighter leading-tight transition-all duration-75"
                style={{ 
                    color: theme.colors.primary,
                    transform: `translateY(${(1 - storyProgress) * 100}px)`,
                    opacity: storyProgress
                }}
            >
               Created for the <br /> 
               <span className="italic font-serif" style={{ color: theme.colors.secondary }}>discerning eye.</span>
           </h3>
           
           <div 
                className="space-y-8 transition-all duration-75"
                style={{ 
                    transform: `translateY(${(1 - storyProgress) * 50}px)`,
                    opacity: storyProgress
                }}
            >
             <p className="text-xl md:text-3xl font-medium opacity-60 leading-relaxed max-w-2xl mx-auto italic">
                This is more than a store. It's a collection of hours, late nights, 
                and the pure joy of making things by hand. From our home studio to yours.
             </p>
             <div 
                className="h-1 bg-stone-200 mx-auto transition-all duration-500" 
                style={{ width: `${storyProgress * 200}px` }} 
             />
             <p className="font-black text-sm uppercase tracking-[0.5em]" style={{ color: theme.colors.secondary }}>
                Quality Over Quantity
             </p>
           </div>
        </div>
      </section>

      {/* 4. FINAL CTA: THE CALL TO ACTION */}
      <section className="px-4 pb-20 md:pb-40 bg-white">
        <div 
            className="group max-w-7xl mx-auto p-12 md:p-32 rounded-[60px] text-center space-y-12 overflow-hidden relative shadow-2xl transition-transform hover:scale-[1.01]"
            style={{ backgroundColor: theme.colors.primary }}
        >
            {/* Dynamic Hover Background */}
            <div className="absolute inset-0 bg-secondary/20 translate-y-full group-hover:translate-y-0 transition-transform duration-700 pointer-events-none" />

            <h2 className="text-5xl md:text-[10rem] font-black tracking-tighter text-white leading-[0.85] relative z-10">
                START <br /> YOUR <br /> STORY.
            </h2>
            
            <div className="relative z-10 pt-8">
                <Link 
                  to="/shop"
                  className="inline-flex items-center gap-6 px-16 py-7 rounded-full font-black text-2xl bg-white transition-all hover:scale-110 active:scale-95 shadow-xl"
                  style={{ color: theme.colors.primary }}
                >
                  Go to Shop <FiShoppingBag />
                </Link>
            </div>
        </div>
      </section>
    </div>
  );
}
