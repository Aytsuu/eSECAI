"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Shield, Activity, BarChart3, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RootPage() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-600 selection:text-white relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-150 h-150 rounded-full bg-indigo-200/50 mix-blend-multiply filter blur-3xl opacity-50 animate-pulse duration-4000"></div>
        <div className="absolute top-[20%] right-[-10%] w-125 h-125 rounded-full bg-violet-200/50 mix-blend-multiply filter blur-3xl opacity-50 animate-pulse duration-5000"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md transition-all">
        <div className="flex justify-between items-center mx-auto max-w-5xl py-4 px-6">
          <span className="font-bold text-xl tracking-tight cursor-pointer text-slate-900" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            esecai
          </span>
          <ul className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
            <li className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Home</li>
            <li className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => scrollToSection("features")}>Services</li>
            <li className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => scrollToSection("how-it-works")}>How it Works</li>
            <li className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => scrollToSection("pricing")}>Pricing</li>
          </ul>

          <div className="flex items-center gap-4">
            <span 
              onClick={() => window.open("https://github.com/Aytsuu/eSECAI", "_blank")}
              className="cursor-pointer text-slate-500 hover:text-indigo-600 transition-colors"
            >
              <Github size={20} />
            </span>

            <Link href="authentication/login">
              <Button className="rounded-full font-medium px-6 bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-button hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(79,70,229,0.4)] transition-all border-0">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-24 z-10 relative">
        {/* Hero Section */}
        <section className="py-24 md:py-32 px-6 max-w-5xl mx-auto text-center perspective-[2000px]">
          <motion.div 
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="space-y-8"
          >
            <motion.div variants={fadeInUp} className="space-y-4">
              <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-indigo-100 bg-indigo-50/50 backdrop-blur-sm shadow-[0_0_20px_rgba(79,70,229,0.15)] text-sm font-semibold text-indigo-700">
                <span className="bg-indigo-600 text-white px-2 py-0.5 rounded-full text-xs mr-2 border-0">NEW</span> 
                Enterprise-ready education platform
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                The Classroom, <span className="bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-violet-600">Evolved.</span>
              </h1>
              <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                AI-powered security and engagement analysis for modern education. 
                Secure, insightful, and designed for the future of learning.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="authentication/login">
                <Button size="lg" className="rounded-full h-14 px-8 text-base bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-button hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(79,70,229,0.4)] transition-all border-0 group">
                  Get Started <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="rounded-full h-14 px-8 text-base text-slate-700 border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-sm" onClick={() => scrollToSection("features")}>
                Learn more
              </Button>
            </motion.div>

            <motion.div variants={fadeInUp} className="pt-12 flex justify-center items-center gap-8 text-slate-500 text-sm font-medium">
              <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-emerald-500" /> Secure Environment</span>
              <span className="flex items-center gap-2"><Activity className="w-4 h-4 text-indigo-500" /> Real-time Analysis</span>
            </motion.div>

            {/* Dashboard Visualization (Isometric Hook) */}
            <motion.div variants={fadeInUp} className="mt-16 mx-auto max-w-4xl relative z-20"
                 style={{ perspective: "2000px" }}
            >
               <div className="rounded-xl border border-slate-100 bg-white shadow-[0_10px_40px_-10px_rgba(79,70,229,0.15)] overflow-hidden transform rotate-x-[5deg] rotate-y-[-5deg] hover:rotate-x-2 hover:-rotate-y-2 transition-transform duration-500">
                  <div className="w-full h-10 bg-slate-50 border-b border-slate-100 flex items-center px-4 gap-2">
                     <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                     <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                     <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                  </div>
                  <div className="w-full h-64 bg-slate-50 relative p-6">
                    <div className="absolute inset-0 bg-linear-to-br from-indigo-50 to-violet-50 opacity-50"></div>
                     {/* Abstract content */}
                     <div className="grid grid-cols-3 gap-6 relative z-10 h-full">
                       <div className="col-span-2 bg-white rounded-lg border border-slate-100 shadow-sm p-4">
                         <div className="h-4 w-32 bg-slate-200 rounded mb-4"></div>
                         <div className="h-32 w-full bg-indigo-50 rounded border border-indigo-100"></div>
                       </div>
                       <div className="col-span-1 flex flex-col gap-4">
                         <div className="flex-1 bg-white rounded-lg border border-slate-100 shadow-sm p-4">
                           <div className="h-4 w-20 bg-slate-200 rounded mb-2"></div>
                           <div className="h-8 w-16 bg-violet-100 rounded"></div>
                         </div>
                         <div className="flex-1 bg-white rounded-lg border border-slate-100 shadow-sm p-4">
                           <div className="h-4 w-24 bg-slate-200 rounded mb-2"></div>
                           <div className="h-8 w-16 bg-emerald-100 rounded"></div>
                         </div>
                       </div>
                     </div>
                  </div>
               </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-6 bg-white relative">
          <div className="max-w-5xl mx-auto">
            <div className="mb-16 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 tracking-tight">Core Capabilities</h2>
              <p className="text-slate-500 text-lg max-w-xl">
                Built for educators who demand precision and security.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 perspective-[1000px]">
              {[
                {
                  icon: <Shield className="w-6 h-6" />,
                  title: "Secure Environment",
                  description: "Enterprise-grade security protocols ensuring student data privacy and exam integrity.",
                  rotation: "hover:rotate-y-[-6deg]"
                },
                {
                  icon: <Activity className="w-6 h-6" />,
                  title: "Real-time Monitoring",
                  description: "Live engagement tracking and activity checks to maintain classroom focus.",
                  rotation: "hover:rotate-y-[6deg]"
                },
                {
                  icon: <BarChart3 className="w-6 h-6" />,
                  title: "Deep Analytics",
                  description: "Comprehensive insights into student performance patterns and learning behaviors.",
                  rotation: "hover:rotate-y-[-6deg]"
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`h-full transform transition-all duration-300 ${feature.rotation} hover:-translate-y-2`}
                >
                  <Card className="h-full bg-white rounded-xl border border-slate-100 shadow-soft hover:shadow-soft-hover transition-all duration-300 overflow-hidden group">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        {feature.icon}
                      </div>
                      <CardTitle className="text-xl text-slate-900">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base text-slate-500">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section id="how-it-works" className="py-24 px-6 max-w-5xl mx-auto relative">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-slate-900">How It Works</h2>
            <p className="text-slate-500 text-lg">Streamlined implementation for any classroom.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
             {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-linear-to-r from-indigo-100 via-violet-200 to-indigo-100 z-0" />
            
            {[
              { step: 1, title: "Connect", desc: "Integrate with your existing LMS." },
              { step: 2, title: "Analyze", desc: "AI runs in the background instantly." },
              { step: 3, title: "Improve", desc: "Get actionable insights immediately." }
            ].map((item, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-24 h-24 rounded-full bg-white border border-slate-200 shadow-soft group-hover:border-indigo-300 group-hover:shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all flex items-center justify-center mb-6 text-2xl font-bold font-mono text-indigo-600">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900">{item.title}</h3>
                <p className="text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24 px-6 bg-slate-50 border-t border-slate-200">
          <div className="max-w-5xl mx-auto">
            <div className="mb-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-slate-900">Simple Pricing</h2>
              <p className="text-slate-500">Transparent plans for every scale.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              <Card className="bg-white rounded-xl border border-slate-200 shadow-[0_4px_20px_-2px_rgba(79,70,229,0.05)] hover:shadow-[0_10px_25px_-5px_rgba(79,70,229,0.1)] transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-2xl text-slate-900">Standard</CardTitle>
                  <CardDescription className="text-slate-500">For individual classrooms</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-slate-900">$0</span>
                    <span className="text-slate-500">/mo</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4 text-sm text-slate-600">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Core Security Features</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Basic Analytics</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Up to 30 students</li>
                  </ul>
                  <div className="mt-8">
                     <Link href="authentication/login">
                      <Button className="w-full h-12 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm" variant="outline">Get Started</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white rounded-xl border-2 border-indigo-500 shadow-[0_10px_30px_-10px_rgba(79,70,229,0.3)] md:scale-105 z-10 relative overflow-hidden flex flex-col transition-transform hover:-translate-y-2">
                <div className="absolute top-0 right-0 p-4">
                  <span className="bg-linear-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">Pro</span>
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl text-slate-900">Enterprise</CardTitle>
                  <CardDescription className="text-slate-500">For schools & districts</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-slate-900">Custom</span>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col flex-1">
                  <ul className="space-y-4 text-sm text-slate-600 flex-1">
                     <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Advanced AI Analysis</li>
                     <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Unlimited students</li>
                     <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> LMS Integration</li>
                  </ul>
                  <div className="mt-8">
                    <Button className="w-full h-12 rounded-lg bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-button hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(79,70,229,0.4)] transition-all border-0">Contact Sales</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA Background section per prompt */}
        <section className="py-24 px-6 bg-linear-to-br from-indigo-900 to-indigo-950 text-center relative overflow-hidden">
          {/* Subtle decoration inside dark section */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-30"></div>
          <div className="max-w-3xl mx-auto relative z-10 space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Ready to elevate your classroom?</h2>
            <p className="text-indigo-200 text-lg md:text-xl">Join the educators who are already using AI to create secure and engaging learning environments.</p>
            <div className="pt-4">
               <Link href="authentication/login">
                  <Button size="lg" className="rounded-full h-14 px-8 text-base bg-white text-indigo-950 hover:bg-slate-50 shadow-[0_4px_14px_0_rgba(255,255,255,0.3)] hover:-translate-y-0.5 transition-all">
                    Register Now <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
               </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}