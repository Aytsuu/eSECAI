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
    <div className="min-h-screen bg-background text-foreground dark font-sans selection:bg-primary selection:text-primary-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/10 bg-background/80 backdrop-blur-md">
        <div className="flex justify-between items-center mx-auto max-w-5xl py-4 px-6">
          <span className="font-bold text-xl tracking-tight cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            esecai
          </span>
          <ul className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
            <li className="hover:text-foreground cursor-pointer transition-colors" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Home</li>
            <li className="hover:text-foreground cursor-pointer transition-colors" onClick={() => scrollToSection("features")}>Services</li>
            <li className="hover:text-foreground cursor-pointer transition-colors" onClick={() => scrollToSection("how-it-works")}>How it Works</li>
            <li className="hover:text-foreground cursor-pointer transition-colors" onClick={() => scrollToSection("pricing")}>Pricing</li>
          </ul>

          <div className="flex items-center gap-4">
            <span 
              onClick={() => window.open("https://github.com/Aytsuu/eSECAI", "_blank")}
              className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github size={20} />
            </span>

            <Link href="authentication/login">
              <Button className="rounded-full font-medium px-6">
                Start Classes
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-24 md:py-32 px-6 max-w-5xl mx-auto text-center">
          <motion.div 
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="space-y-8"
          >
            <motion.div variants={fadeInUp} className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]">
                The Classroom, <span className="text-muted-foreground">Evolved.</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                AI-powered security and engagement analysis for modern education. 
                Secure, insightful, and designed for the future of learning.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="authentication/login">
                <Button size="lg" className="rounded-full h-12 px-8 text-base">
                  Start Classes
                </Button>
              </Link>
              <Button variant="ghost" size="lg" className="rounded-full h-12 px-8 text-base text-muted-foreground hover:text-foreground" onClick={() => scrollToSection("features")}>
                Learn more <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>

            <motion.div variants={fadeInUp} className="pt-12 flex justify-center items-center gap-8 text-muted-foreground opacity-50 text-sm">
              <span className="flex items-center gap-2"><Shield className="w-4 h-4" /> Secure Environment</span>
              <span className="flex items-center gap-2"><Activity className="w-4 h-4" /> Real-time Analysis</span>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-6 bg-muted/20 border-y border-border/5">
          <div className="max-w-5xl mx-auto">
            <div className="mb-16 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Core Capabilities</h2>
              <p className="text-muted-foreground text-lg max-w-xl">
                Built for educators who demand precision and security.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Shield className="w-6 h-6" />,
                  title: "Secure Environment",
                  description: "Enterprise-grade security protocols ensuring student data privacy and exam integrity."
                },
                {
                  icon: <Activity className="w-6 h-6" />,
                  title: "Real-time Monitoring",
                  description: "Live engagement tracking and activity checks to maintain classroom focus."
                },
                {
                  icon: <BarChart3 className="w-6 h-6" />,
                  title: "Deep Analytics",
                  description: "Comprehensive insights into student performance patterns and learning behaviors."
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-border transition-colors">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-secondary/50 flex items-center justify-center mb-4 text-foreground">
                        {feature.icon}
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base text-muted-foreground/80">
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
        <section id="how-it-works" className="py-24 px-6 max-w-5xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">Streamlined implementation for any classroom.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
             {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-border z-0" />
            
            {[
              { step: 1, title: "Connect", desc: "Integrate with your existing LMS." },
              { step: 2, title: "Analyze", desc: "AI runs in the background instantly." },
              { step: 3, title: "Improve", desc: "Get actionable insights immediately." }
            ].map((item, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-24 h-24 rounded-full bg-background border-4 border-muted group-hover:border-primary/20 transition-colors flex items-center justify-center mb-6 text-2xl font-bold font-mono">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24 px-6 bg-muted/20 border-t border-border/5">
          <div className="max-w-5xl mx-auto">
            <div className="mb-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple Pricing</h2>
              <p className="text-muted-foreground">Transparent plans for every scale.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              <Card className="bg-card/50 border-border/50 relative overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-2xl">Standard</CardTitle>
                  <CardDescription>For individual classrooms</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">$0</span>
                    <span className="text-muted-foreground">/mo</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Core Security Features</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Basic Analytics</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Up to 30 students</li>
                  </ul>
                  <div className="mt-8">
                     <Link href="authentication/login">
                      <Button className="w-full" variant="outline">Get Started</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-primary/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2">
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">Pro</span>
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl">Enterprise</CardTitle>
                  <CardDescription>For schools & districts</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">Custom</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4 text-sm text-muted-foreground">
                     <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Advanced AI Analysis</li>
                     <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Unlimited students</li>
                     <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> LMS Integration</li>
                  </ul>
                  <div className="mt-8">
                    <Button className="w-full">Contact Sales</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}