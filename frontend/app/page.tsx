import Link from "next/link";
import { ArrowRight, BarChart3, Truck, Users, Wrench, ShieldCheck, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bitumen flex flex-col font-sans text-ink transition-colors duration-300">
      {/* Navbar */}
      <nav className="border-b border-hairline bg-panel/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="h-8 w-8 text-amber" />
            <span className="font-heading font-bold text-xl tracking-wide text-ink">TransitOps</span>
          </div>
          <div>
            <Link 
              href="/login" 
              className="px-5 py-2 rounded-full bg-amber text-[#1A1300] font-semibold text-sm hover:brightness-110 transition-all shadow-md"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-24 pb-32 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-panel border border-hairline text-[0.875rem] font-medium text-ink-dim mb-8">
            <Zap className="h-4 w-4 text-go" />
            <span>Welcome to the future of logistics</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold font-heading text-ink tracking-tight mb-6">
            Smart Transport Operations, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber to-amber/70">Unified.</span>
          </h1>
          <p className="text-lg md:text-xl text-ink-dim max-w-2xl mx-auto mb-10 leading-relaxed">
            Take complete control of your fleet with real-time tracking, predictive maintenance, automated expenses, and intelligent role-based access.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/dashboard" 
              className="flex items-center gap-2 px-8 py-4 rounded-full bg-amber text-[#1A1300] font-bold text-lg hover:brightness-110 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-amber/20 w-full sm:w-auto justify-center"
            >
              Go to Dashboard <ArrowRight className="h-5 w-5" />
            </Link>
            <Link 
              href="/login" 
              className="flex items-center gap-2 px-8 py-4 rounded-full bg-panel text-ink border border-hairline font-bold text-lg hover:bg-panel-raised transition-all w-full sm:w-auto justify-center"
            >
              Sign In
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-panel border-y border-hairline">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-ink mb-4">Everything you need to scale</h2>
              <p className="text-ink-dim text-lg">A complete toolkit for modern fleet managers.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-panel-raised p-8 rounded-2xl border border-hairline hover:border-amber/50 transition-colors group">
                <div className="h-12 w-12 rounded-xl bg-amber/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-6 w-6 text-amber" />
                </div>
                <h3 className="text-xl font-bold font-heading text-ink mb-3">Real-time Analytics</h3>
                <p className="text-ink-dim leading-relaxed">Monitor KPIs, fleet utilization, and operational costs instantly with gorgeous, interactive dashboards.</p>
              </div>

              {/* Feature 2 */}
              <div className="bg-panel-raised p-8 rounded-2xl border border-hairline hover:border-reflect/50 transition-colors group">
                <div className="h-12 w-12 rounded-xl bg-reflect/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Truck className="h-6 w-6 text-reflect" />
                </div>
                <h3 className="text-xl font-bold font-heading text-ink mb-3">Vehicle Management</h3>
                <p className="text-ink-dim leading-relaxed">Track your entire fleet, including status, model, registration, and comprehensive historical logs.</p>
              </div>

              {/* Feature 3 */}
              <div className="bg-panel-raised p-8 rounded-2xl border border-hairline hover:border-go/50 transition-colors group">
                <div className="h-12 w-12 rounded-xl bg-go/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-go" />
                </div>
                <h3 className="text-xl font-bold font-heading text-ink mb-3">Driver Directory</h3>
                <p className="text-ink-dim leading-relaxed">Keep track of your workforce, their license statuses, availability, and assign them directly to active trips.</p>
              </div>

              {/* Feature 4 */}
              <div className="bg-panel-raised p-8 rounded-2xl border border-hairline hover:border-caution/50 transition-colors group">
                <div className="h-12 w-12 rounded-xl bg-caution/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Wrench className="h-6 w-6 text-caution" />
                </div>
                <h3 className="text-xl font-bold font-heading text-ink mb-3">Maintenance Hub</h3>
                <p className="text-ink-dim leading-relaxed">Schedule routine services, track repairs, and ensure your fleet is always road-ready and compliant.</p>
              </div>

              {/* Feature 5 */}
              <div className="bg-panel-raised p-8 rounded-2xl border border-hairline hover:border-amber/50 transition-colors group lg:col-span-2">
                <div className="h-12 w-12 rounded-xl bg-amber/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="h-6 w-6 text-amber" />
                </div>
                <h3 className="text-xl font-bold font-heading text-ink mb-3">Enterprise Grade RBAC</h3>
                <p className="text-ink-dim leading-relaxed">Secure your operations with robust Role-Based Access Control. Assign specific permissions for Fleet Managers, Mechanics, Dispatchers, and Drivers natively.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Area with Giant Text */}
      <div className="relative overflow-hidden bg-bitumen pt-20 pb-0 mt-10">
        {/* Faded Background Text */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[10%] pointer-events-none select-none opacity-[0.04] z-0 flex justify-center w-full">
          <span className="text-[20vw] font-heading font-bold leading-none text-ink whitespace-nowrap tracking-tighter">
            TransitOps
          </span>
        </div>

        {/* Footer Card */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 pb-40">
          <div className="bg-panel rounded-[24px] border border-hairline p-8 md:p-12 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-12">
              {/* Brand Col */}
              <div className="md:col-span-5 flex flex-col gap-6">
                <div className="flex items-center gap-2">
                  <Truck className="h-6 w-6 text-reflect" />
                  <span className="font-heading font-bold text-xl tracking-wide text-ink">TransitOps</span>
                </div>
                <p className="text-[0.875rem] text-ink-dim leading-relaxed max-w-md">
                  TransitOps empowers transport and logistics teams to transform fragmented fleet records into an intelligent operations platform — making tracking, maintenance, and analytics easier to share, understand, and act on.
                </p>
                {/* Social Icons */}
                <div className="flex items-center gap-5 text-ink-dim mt-2">
                  <a href="#" className="hover:text-ink transition-colors">
                     {/* X (Twitter) */}
                     <svg className="w-[1.125rem] h-[1.125rem]" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                  <a href="#" className="hover:text-ink transition-colors">
                     {/* Instagram */}
                     <svg className="w-[1.125rem] h-[1.125rem]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  </a>
                  <a href="#" className="hover:text-ink transition-colors">
                     {/* LinkedIn */}
                     <svg className="w-[1.125rem] h-[1.125rem]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                  </a>
                  <a href="#" className="hover:text-ink transition-colors">
                     {/* GitHub */}
                     <svg className="w-[1.125rem] h-[1.125rem]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                  </a>
                </div>
              </div>

              {/* Links Cols */}
              <div className="md:col-span-7 flex flex-row justify-start md:justify-end gap-16 md:gap-32">
                <div className="flex flex-col gap-5">
                  <h4 className="font-bold text-ink text-[0.875rem]">Product</h4>
                  <Link href="#features" className="text-[0.875rem] font-medium text-ink-dim hover:text-ink transition-colors">Features</Link>
                  <Link href="/dashboard" className="text-[0.875rem] font-medium text-ink-dim hover:text-ink transition-colors">Dashboard</Link>
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="pt-8 border-t border-hairline flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-[0.8125rem] font-medium text-ink-dim">
                &copy; 2026 TransitOps. All rights reserved.
              </p>
              <div className="flex items-center gap-6 text-[0.8125rem] font-medium text-ink-dim">
                <Link href="#" className="hover:text-ink transition-colors">Privacy Policy</Link>
                <Link href="#" className="hover:text-ink transition-colors">Terms of Service</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
