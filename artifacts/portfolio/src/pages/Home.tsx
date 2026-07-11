import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Mail, Github, Twitter, Linkedin, Instagram, Dribbble } from "lucide-react";
import { Button } from "@/components/ui/button";

import heroPhoto from "@assets/download_1783786835089.jpg";
import project1 from "@/assets/project-1.png";
import project2 from "@/assets/project-2.png";
import project3 from "@/assets/project-3.png";
import aboutPhoto from "@/assets/about-photo.png";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background font-sans overflow-x-hidden">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex items-center justify-between mix-blend-difference text-white pointer-events-none">
        <div className="font-bold text-xl tracking-tight pointer-events-auto">STUDIO.</div>
        <div className="hidden md:flex items-center gap-8 font-medium text-sm pointer-events-auto">
          <a href="#home" className="hover:opacity-70 transition-opacity">Home</a>
          <a href="#about" className="hover:opacity-70 transition-opacity">About</a>
          <a href="#projects" className="hover:opacity-70 transition-opacity">Projects</a>
          <a href="#contact" className="hover:opacity-70 transition-opacity">Contact</a>
        </div>
        <div className="pointer-events-auto">
          <button className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors">
            Start a project
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-6 md:px-12 max-w-[1400px] mx-auto min-h-[90vh] flex flex-col justify-center">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col gap-8"
          >
            <motion.h1 variants={fadeInUp} className="text-6xl md:text-7xl lg:text-[80px] leading-[1.1] font-bold tracking-tight">
              <span className="block text-foreground">Digital</span>
              <span className="block text-muted-foreground">Experience</span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-muted-foreground max-w-md font-light leading-relaxed">
              Crafting refined interfaces, brands, and digital experiences for ambitious founders and creative teams.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex items-center gap-4 pt-4">
              <Button size="lg" className="rounded-full px-8 bg-foreground text-background hover:bg-foreground/90 h-14 text-base">
                View projects
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base border-border">
                Get in touch
              </Button>
            </motion.div>

            <motion.div variants={staggerContainer} className="grid grid-cols-3 gap-8 pt-12 mt-8 border-t border-border/50">
              {[
                { label: "Projects completed", value: "120+" },
                { label: "Years Experience", value: "8yr" },
                { label: "Happy clients", value: "40+" }
              ].map((stat, i) => (
                <motion.div key={i} variants={fadeInUp}>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Image Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="relative bg-card rounded-[2rem] p-4 lg:p-6 aspect-[4/5] lg:aspect-square flex items-center justify-center overflow-hidden border border-border"
          >
            <div className="w-full h-full relative rounded-2xl overflow-hidden bg-muted">
              <img 
                src={heroPhoto} 
                alt="Creative Professional" 
                className="w-full h-full object-cover grayscale opacity-90"
              />
            </div>
            
            {/* Floating Widget */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute bottom-8 right-8 bg-foreground text-background p-5 rounded-2xl flex items-center gap-4 max-w-[240px] shadow-2xl"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs font-semibold uppercase tracking-wider">Available</span>
                </div>
                <p className="text-sm text-background/80 leading-tight">Currently taking on new projects for 2025.</p>
              </div>
              <button className="flex-shrink-0 w-10 h-10 rounded-full bg-background/20 flex items-center justify-center hover:bg-background/30 transition-colors text-background">
                <ArrowUpRight size={18} />
              </button>
            </motion.div>
          </motion.div>
          
        </div>
      </section>

      {/* Marquee Section */}
      <section className="py-12 border-y border-border overflow-hidden bg-card/30">
        <div className="flex w-[200%] md:w-[150%] lg:w-[120%] relative">
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
            className="flex items-center justify-around w-full"
          >
            {["Codify", "Flowboard", "Agentify", "TodoFusion", "Identify", "Nexus AI", "Landify", "Codify", "Flowboard", "Agentify", "TodoFusion", "Identify", "Nexus AI", "Landify"].map((logo, i) => (
              <div key={i} className="text-2xl md:text-3xl font-bold text-muted-foreground/40 uppercase tracking-widest px-8">
                {logo}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-6 md:px-12 max-w-[1400px] mx-auto">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid lg:grid-cols-12 gap-16 items-center"
        >
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-muted">
              <img src={aboutPhoto} alt="Portrait" className="w-full h-full object-cover" />
            </div>
          </div>
          
          <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col gap-8">
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold tracking-tight">
              Design with purpose.<br/>
              <span className="text-muted-foreground">Built with precision.</span>
            </motion.h2>
            
            <motion.p variants={fadeInUp} className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              I am an independent designer focused on digital products and brand identities. 
              My approach bridges the gap between aesthetic beauty and functional architecture. 
              Every project is an opportunity to distill complexity into simple, memorable experiences.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="grid sm:grid-cols-2 gap-8 pt-8">
              <div>
                <h3 className="font-semibold text-lg mb-4 border-b border-border pb-2">Expertise</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li>Digital Product Design</li>
                  <li>Brand Identity</li>
                  <li>Design Systems</li>
                  <li>Creative Direction</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4 border-b border-border pb-2">Selected Clients</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li>Fintech Startups</li>
                  <li>AI Research Labs</li>
                  <li>E-commerce Brands</li>
                  <li>Editorial Platforms</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-32 px-6 md:px-12 bg-card">
        <div className="max-w-[1400px] mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Selected Works</h2>
              <p className="text-muted-foreground text-lg">A collection of recent digital and brand projects.</p>
            </div>
            <Button variant="outline" className="rounded-full px-6">
              View all work <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-x-8 gap-y-16">
            {[
              { img: project1, title: "Nexus Spatial", category: "Brand & 3D Design", span: "" },
              { img: project2, title: "Flow UI Kit", category: "Product Design", span: "md:-mt-16" },
              { img: project3, title: "Editorial Standard", category: "Web & Typography", span: "" }
            ].map((project, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className={`group cursor-pointer ${project.span}`}
              >
                <div className="relative overflow-hidden rounded-2xl mb-6 bg-muted">
                  <div className="aspect-[4/3] w-full overflow-hidden">
                    <img 
                      src={project.img} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute top-4 right-4 w-12 h-12 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-1 group-hover:text-muted-foreground transition-colors">{project.title}</h3>
                    <p className="text-muted-foreground">{project.category}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-6 md:px-12 max-w-[1400px] mx-auto">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid lg:grid-cols-2 gap-16"
        >
          <div>
            <motion.h2 variants={fadeInUp} className="text-5xl md:text-7xl font-bold tracking-tight leading-none mb-6">
              Let's create <br/>
              <span className="text-muted-foreground">together.</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-muted-foreground mb-12 max-w-md">
              Available for freelance opportunities. Reach out if you want to collaborate on something great.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col gap-6">
              <a href="mailto:hello@studio.com" className="flex items-center gap-4 text-xl font-medium hover:text-muted-foreground transition-colors w-fit">
                <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                hello@studio.com
              </a>
              <div className="flex gap-4 pt-4">
                {[Twitter, Linkedin, Instagram, Dribbble].map((Icon, i) => (
                  <a key={i} href="#" className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-colors">
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div variants={fadeInUp} className="bg-card p-8 md:p-12 rounded-3xl border border-border">
            <form className="flex flex-col gap-6" onSubmit={e => e.preventDefault()}>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Name</label>
                  <input type="text" className="bg-background border border-border rounded-lg px-4 py-3 outline-none focus:border-foreground transition-colors" placeholder="John Doe" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Email</label>
                  <input type="email" className="bg-background border border-border rounded-lg px-4 py-3 outline-none focus:border-foreground transition-colors" placeholder="john@example.com" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Subject</label>
                <input type="text" className="bg-background border border-border rounded-lg px-4 py-3 outline-none focus:border-foreground transition-colors" placeholder="Project inquiry" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Message</label>
                <textarea rows={5} className="bg-background border border-border rounded-lg px-4 py-3 outline-none focus:border-foreground transition-colors resize-none" placeholder="Tell me about your project..."></textarea>
              </div>
              <Button size="lg" className="w-full rounded-lg bg-foreground text-background hover:bg-foreground/90 h-14 text-base mt-2">
                Send Message
              </Button>
            </form>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 md:px-12 border-t border-border">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-bold tracking-tight text-xl">STUDIO.</div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#home" className="hover:text-foreground transition-colors">Home</a>
            <a href="#about" className="hover:text-foreground transition-colors">About</a>
            <a href="#projects" className="hover:text-foreground transition-colors">Projects</a>
          </div>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Studio. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
