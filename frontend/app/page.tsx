"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// --- HOOKS ---
function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);
  return reduced;
}

function useInView(options: IntersectionObserverInit = {}) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, options);
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin]);
  
  return [ref, inView] as const;
}

// --- COMPONENTS ---

// Scrambles text on mount
const ScrambleText = ({ text, delayMs = 0 }: { text: string; delayMs?: number }) => {
  const [display, setDisplay] = useState("");
  const reducedMotion = useReducedMotion();
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(text);
      return;
    }

    let timeout: NodeJS.Timeout;
    let frame: number;
    let iteration = 0;

    const startAnimation = () => {
      const animate = () => {
        setDisplay(
          text
            .split("")
            .map((char, index) => {
              if (index < iteration || char === " ") return text[index];
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("")
        );

        if (iteration < text.length) {
          iteration += 1 / 3;
          frame = requestAnimationFrame(animate);
        } else {
          setDisplay(text);
        }
      };
      frame = requestAnimationFrame(animate);
    };

    timeout = setTimeout(startAnimation, delayMs);
    
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
    };
  }, [text, delayMs, reducedMotion]);

  return <span>{display || text.replace(/./g, "\u00A0")}</span>;
};

// Count-up numbers
const KpiCounter = ({ target, label }: { target: number; label: string }) => {
  const [ref, inView] = useInView({ threshold: 0.5 });
  const [count, setCount] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion && inView) {
      setCount(target);
      return;
    }
    
    if (inView) {
      let start = 0;
      const duration = 1100;
      const startTime = performance.now();

      const easeOutCubic = (x: number): number => 1 - Math.pow(1 - x, 3);

      const step = (currentTime: number) => {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const currentCount = Math.floor(easeOutCubic(progress) * target);
        setCount(currentCount);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          setCount(target);
        }
      };

      requestAnimationFrame(step);
    }
  }, [inView, target, reducedMotion]);

  return (
    <div ref={ref} className="bg-panel-raised border border-hairline p-6 rounded-2xl flex flex-col gap-2 shadow-sm hover:-translate-y-1 transition-transform">
      <div className="font-mono font-bold text-5xl text-ink tabular-nums tracking-tighter">
        {count}
      </div>
      <div className="font-sans text-ink-dim text-sm font-semibold">{label}</div>
    </div>
  );
};

// Status Pill
const StatusPill = ({ status, flipToggle }: { status: string; flipToggle: boolean }) => {
  const reducedMotion = useReducedMotion();
  
  const colors: Record<string, string> = {
    "Available": "text-available bg-available/10 border-available/20",
    "On Trip": "text-ontrip bg-ontrip/10 border-ontrip/20",
    "In Shop": "text-inshop bg-inshop/10 border-inshop/20",
    "Retired": "text-retired bg-retired/10 border-retired/20"
  };

  return (
    <div className="relative h-7 w-28 perspective-1000" style={{ perspective: "1000px" }}>
      <div 
        className={`w-full h-full border rounded flex items-center justify-center font-mono text-[11px] font-bold tracking-wider uppercase transition-all ${reducedMotion ? "" : "duration-500"} ${colors[status] || colors["Retired"]}`}
        style={{
          transformStyle: "preserve-3d",
          transform: !reducedMotion && flipToggle ? "rotateX(360deg)" : "rotateX(0deg)",
        }}
      >
        {status}
      </div>
    </div>
  );
};

// Hero Board Row
const BoardRow = ({ unit, assignment, initialStatus, delayMs }: { unit: string; assignment: string; initialStatus: string; delayMs: number }) => {
  const [status, setStatus] = useState(initialStatus);
  const [flipToggle, setFlipToggle] = useState(false);

  useEffect(() => {
    const statuses = ["Available", "On Trip", "In Shop", "Retired"];
    const interval = setInterval(() => {
      if (Math.random() < 0.05) {
        setStatus(statuses[Math.floor(Math.random() * statuses.length)]);
        setFlipToggle(p => !p);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-12 border-b border-hairline py-3 px-4 items-center bg-panel-raised">
      <div className="col-span-2 font-mono text-amber text-lg font-bold">
        <ScrambleText text={unit} delayMs={delayMs} />
      </div>
      <div className="col-span-7 font-mono text-ink text-sm font-semibold">
        <ScrambleText text={assignment} delayMs={delayMs + 200} />
      </div>
      <div className="col-span-3 flex justify-end">
        <StatusPill status={status} flipToggle={flipToggle} />
      </div>
    </div>
  );
};

export default function SplashPage() {
  const [clock, setClock] = useState("");
  
  useEffect(() => {
    setClock(new Date().toLocaleTimeString("en-US", { hour12: false }));
    const t = setInterval(() => {
      setClock(new Date().toLocaleTimeString("en-US", { hour12: false }));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    // Forced .light class to guarantee the requested light theme mapping
    <div className="light min-h-screen bg-bitumen text-ink font-sans selection:bg-amber/20 selection:text-amber overflow-x-hidden relative">
      
      {/* Background Wavy Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 text-ink">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="waves" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(15)">
              <path d="M0 30 Q15 0 30 30 T60 30" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#waves)" />
        </svg>
      </div>

      {/* Floating Pill Nav */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-panel/70 backdrop-blur-xl border border-hairline rounded-full px-2 py-2 flex items-center gap-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <span className="font-display font-bold text-lg px-4 tracking-tight">TransitOps</span>
          <div className="hidden md:flex items-center gap-6 font-sans text-sm font-semibold">
            <Link href="#rules" className="text-ink hover:text-amber transition-colors">Rules</Link>
            <Link href="#roles" className="text-ink hover:text-amber transition-colors">Roles</Link>
            <Link href="#dashboard" className="text-ink hover:text-amber transition-colors">Dashboard</Link>
            <Link href="#stack" className="text-ink hover:text-amber transition-colors">Stack</Link>
          </div>
          <Link 
            href="/login"
            className="bg-ink text-panel-raised rounded-full px-6 py-2.5 text-sm font-bold hover:bg-ink-dim transition-colors ml-4"
          >
            Log in
          </Link>
        </div>
      </nav>

      <main>
        {/* HERO SECTION */}
        <section className="relative z-10 pt-40 pb-24 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 min-h-[90vh] items-center">
          
          {/* Left Col */}
          <div className="lg:col-span-6 flex flex-col gap-8 xl:pr-12">
            <div className="inline-flex items-center gap-2 border border-amber-200/60 bg-amber-50/50 backdrop-blur-sm rounded-full px-4 py-1.5 w-fit text-amber-600 font-sans text-xs font-bold tracking-wide uppercase">
               <span className="w-2 h-2 rounded-full bg-available animate-pulse"></span>
               System status — enforcing 10 rules live
            </div>
            
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
              The yard runs on a board that <span className="text-amber">never lies.</span>
            </h1>
            
            <p className="text-ink-dim text-lg sm:text-xl leading-relaxed max-w-xl font-sans font-medium">
              Spreadsheets and paper logbooks let an expired license get dispatched. TransitOps won't — every vehicle, driver, and trip status lives in one place, and the rules that protect your fleet are enforced in the backend, not just hidden in the UI.
            </p>
            
            {/* Glass/Glowing Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
               <Link href="/login" className="relative group rounded-xl overflow-hidden p-[1px]">
                 <span className="absolute inset-0 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl blur-[2px]"></span>
                 <div className="relative bg-panel-raised/80 backdrop-blur-xl border border-hairline shadow-sm px-8 py-4 rounded-xl flex items-center justify-center gap-2 font-sans text-sm font-bold group-hover:bg-panel-raised transition-colors">
                    Log in to the board <ArrowRight size={16} />
                 </div>
               </Link>
               <Link href="#rules" className="relative group rounded-xl overflow-hidden p-[1px]">
                 <span className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl blur-[2px]"></span>
                 <div className="relative bg-bitumen/80 backdrop-blur-xl border border-hairline/80 shadow-sm px-8 py-4 rounded-xl flex items-center justify-center gap-2 font-sans text-sm font-bold">
                    See the rules it enforces
                 </div>
               </Link>
            </div>
            
            {/* Footer stats */}
            <div className="font-mono text-[10px] text-ink-dim/70 flex flex-wrap items-center gap-4 mt-12 uppercase tracking-widest font-semibold">
               VEHICLE REGISTRY · DRIVER COMPLIANCE · TRIP DISPATCH · MAINTENANCE · FUEL & EXPENSE · REPORTS
            </div>
          </div>

          {/* Right Col: The Board Card */}
          <div className="lg:col-span-6 relative h-full min-h-[500px] w-full hidden lg:flex items-center justify-center">
             
             <div className="w-[110%] ml-[-5%] bg-panel-raised border border-hairline shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-[24px] overflow-hidden z-20 flex flex-col hover:-translate-y-2 transition-transform duration-700">
               <div className="bg-panel border-b border-hairline px-6 py-4 flex justify-between items-center">
                  <div className="font-mono font-bold text-ink text-sm flex items-center gap-3 tracking-wide">
                    <span className="w-2.5 h-2.5 rounded-full bg-available animate-pulse"></span>
                    YARD STATUS
                  </div>
                  <div className="font-mono font-bold text-amber text-sm tabular-nums">
                    {clock || "00:00:00"}
                  </div>
               </div>
               
               <div className="grid grid-cols-12 px-6 py-3 border-b border-hairline bg-bitumen font-mono text-[11px] text-ink-dim tracking-widest uppercase font-semibold">
                 <div className="col-span-2">Unit</div>
                 <div className="col-span-7">Assignment</div>
                 <div className="col-span-3 text-right">State</div>
               </div>
               
               <div className="flex flex-col">
                 <BoardRow unit="VN-05" assignment="Ranchi → Bokaro" initialStatus="Available" delayMs={0} />
                 <BoardRow unit="TR-11" assignment="Ranchi → Patna" initialStatus="On Trip" delayMs={140} />
                 <BoardRow unit="BK-02" assignment="Local courier run" initialStatus="Available" delayMs={280} />
                 <BoardRow unit="BS-07" assignment="Ranchi → Jamshedpur" initialStatus="In Shop" delayMs={420} />
                 <BoardRow unit="TR-14" assignment="Dhanbad → Ranchi" initialStatus="On Trip" delayMs={560} />
               </div>
               
               <div className="p-4 bg-panel font-mono text-[10px] text-ink-dim text-right tracking-widest border-t border-hairline font-semibold">
                 UPDATED IN REAL TIME · NO MANUAL OVERRIDE
               </div>
             </div>
             
          </div>
        </section>

        {/* 5. THE RULEBOOK */}
        <section id="rules" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-hairline/60">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-hairline pb-8 mb-16 gap-6">
            <div>
              <div className="font-mono text-amber text-lg font-bold mb-2">01</div>
              <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tight">The rulebook</h2>
            </div>
            <p className="text-ink-dim font-sans text-lg max-w-md md:text-right leading-relaxed font-medium">
              Ten rules, enforced server-side, on every dispatch — not just hidden buttons in the UI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            {[
              { id: "R1", title: "Registration numbers are unique", desc: "Duplicate plates are rejected at the database, with a plain-language error naming the conflict." },
              { id: "R2", title: "Retired or in-shop vehicles never dispatch", desc: "They vanish from the assignment dropdown the moment their status changes — no exceptions typed in." },
              { id: "R3", title: "Expired or suspended drivers can't be assigned", desc: "Checked against today's date at the moment of assignment, not at the moment the license was issued.", stamp: true },
              { id: "R4", title: "No double-booking", desc: "A vehicle or driver already on a trip can't be handed a second one — enforced inside a single transaction to close the race condition." },
              { id: "R5", title: "Cargo can't exceed capacity", desc: "450 kg into a 500 kg van passes. 600 kg into the same van doesn't — the board says exactly why.", stamp: true },
              { id: "R6", title: "Dispatch flips both assets at once", desc: "Trip, vehicle, and driver move to 'on trip' together — never a half-updated state." },
              { id: "R7", title: "Completion returns both to available", desc: "Final odometer and fuel are logged, and the vehicle's running distance updates automatically." },
              { id: "R8", title: "Cancelling restores availability", desc: "A dispatched trip that's cancelled hands the vehicle and driver straight back to the pool." },
              { id: "R9", title: "Open maintenance takes the vehicle offline", desc: "Logging a repair moves the vehicle to 'in shop' — and it can't be opened against a vehicle mid-trip." },
              { id: "R10", title: "Closing maintenance brings it back — usually", desc: "Vehicle returns to available on close, unless it's been retired. Retired is terminal." }
            ].map((rule) => (
              <div key={rule.id} className="relative flex gap-6 group">
                <div className="font-mono font-bold text-hairline text-4xl transition-colors group-hover:text-amber">
                  {rule.id}
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold mb-2 tracking-wide text-ink">{rule.title}</h3>
                  <p className="text-ink-dim leading-relaxed font-sans">{rule.desc}</p>
                </div>
                {rule.stamp && (
                  <div className="absolute -top-4 -right-2 md:-right-8 rotate-[15deg] border-4 border-red-500 text-red-500 font-mono font-bold text-2xl px-3 py-1 opacity-80 backdrop-blur-sm pointer-events-none rounded-sm">
                    BLOCKED
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 7. ONE BOARD, LIVE */}
        <section id="dashboard" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-hairline/60">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-hairline pb-8 mb-16 gap-6">
            <div>
              <div className="font-mono text-amber text-lg font-bold mb-2">02</div>
              <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tight">One board, live</h2>
            </div>
            <p className="text-ink-dim font-sans text-lg max-w-md md:text-right leading-relaxed font-medium">
              KPIs refetch after every mutation — dispatch a trip and watch the numbers move.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
            <KpiCounter target={72} label="Fleet utilization %" />
            <KpiCounter target={14} label="Active trips" />
            <KpiCounter target={9} label="Drivers on duty" />
            <KpiCounter target={2} label="Vehicles in shop" />
          </div>
        </section>

      </main>

      {/* 9. FOOTER */}
      <footer className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center border-t border-hairline/60">
        <h2 className="font-display text-5xl md:text-7xl font-bold mb-6">
          Ready to <span className="text-amber">dispatch?</span>
        </h2>
        <p className="text-ink-dim font-sans text-lg max-w-xl mb-12 font-medium">
          Log in with any of the four seeded roles and try to break a rule. You won't get far.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link href="/login" className="bg-amber text-white rounded-xl px-8 py-4 font-sans font-bold text-center hover:bg-amber-soft transition-colors shadow-lg shadow-amber/20">
            Log in to TransitOps
          </Link>
          <Link href="#rules" className="bg-panel-raised border border-hairline text-ink rounded-xl px-8 py-4 font-sans font-bold text-center hover:bg-panel transition-colors shadow-sm">
            Review the rulebook again
          </Link>
        </div>

        <div className="border border-dashed border-hairline bg-panel-raised rounded-xl px-8 py-4 font-mono text-sm text-ink mb-24">
          Judge access — <span className="font-bold text-amber">fleet@transitops.com</span> / demo123
        </div>

        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 border-t border-hairline pt-8 font-mono text-[10px] text-ink-faint uppercase tracking-widest font-bold">
          <div>TRANSITOPS — BUILT FOR THE ODOO HACKATHON, 8-HOUR BUILD</div>
          <div>VEHICLE · DRIVER · TRIP · MAINTENANCE · FUEL · REPORT</div>
        </div>
      </footer>

    </div>
  );
}
