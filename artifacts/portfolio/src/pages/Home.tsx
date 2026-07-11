import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowUpRight, Mail, Twitter, Linkedin, Instagram, Dribbble, Menu, X } from "lucide-react";
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

const navLinks = ["Home", "About", "Projects", "Contact"];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background font-sans overflow-x-hidden">

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tight">STUDIO.</div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8 font-medium text-sm">
            {navLinks.map((link) => (
              <a key={link} href={`#${link.toLowerCase()}`} className="hover:text-muted-foreground transition-colors">
                {link}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden md:block bg-foreground text-background px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-foreground/80 transition-colors">
              Start a project
            </button>
            {/* Mobile hamburger */}
            <button
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full border border-border"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden border-t border-border/40 bg-background overflow-hidden"
            >
              <div className="px-5 py-6 flex flex-col gap-5">
                {navLinks.map((link) => (
                  <a
                    key={link}
                    href={`#${link.toLowerCase()}`}
                    className="text-lg font-medium hover:text-muted-foreground transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link}
                  </a>
                ))}
                <button className="mt-2 bg-foreground text-background px-5 py-3 rounded-full text-sm font-semibold w-full">
                  Start a project
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-28 sm:pt-32 pb-16 px-5 sm:px-8 max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-8 items-center">

          {/* Text content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col gap-6 sm:gap-8"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] leading-[1.05] font-bold tracking-tight"
            >
              <span className="block text-foreground">Digital</span>
              <span className="block text-muted-foreground">Experience</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-base sm:text-lg text-muted-foreground max-w-md font-light leading-relaxed">
              Crafting refined interfaces, brands, and digital experiences for ambitious founders and creative teams.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-3">
              <Button size="lg" className="rounded-full px-6 sm:px-8 bg-foreground text-background hover:bg-foreground/90 h-12 sm:h-14 text-sm sm:text-base">
                View projects
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-6 sm:px-8 h-12 sm:h-14 text-sm sm:text-base border-border">
                Get in touch
              </Button>
            </motion.div>

            <motion.div variants={staggerContainer} className="grid grid-cols-3 gap-4 sm:gap-8 pt-8 mt-4 border-t border-border/50">
              {[
                { label: "Projects completed", value: "120+" },
                { label: "Years Experience", value: "8yr" },
                { label: "Happy clients", value: "40+" }
              ].map((stat, i) => (
                <motion.div key={i} variants={fadeInUp}>
                  <div className="text-2xl sm:text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground leading-tight">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Image Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="relative bg-card rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden border border-border"
            style={{ aspectRatio: "4/5" }}
          >
            <img
              src={heroPhoto}
              alt="Creative Professional"
              className="w-full h-full object-cover grayscale opacity-90"
            />

            {/* Floating widget */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 bg-foreground text-background p-4 sm:p-5 rounded-xl sm:rounded-2xl flex items-center gap-3 sm:gap-4 max-w-[200px] sm:max-w-[240px] shadow-2xl"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0"></div>
                  <span className="text-xs font-semibold uppercase tracking-wider">Available</span>
                </div>
                <p className="text-xs sm:text-sm text-background/70 leading-tight">Currently taking on new projects for 2025.</p>
              </div>
              <button className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-background/20 flex items-center justify-center hover:bg-background/30 transition-colors">
                <ArrowUpRight size={16} />
              </button>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* Marquee Section */}
      <section className="py-10 border-y border-border overflow-hidden bg-card/30">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
          className="flex whitespace-nowrap"
          style={{ width: "max-content" }}
        >
          {["Codify", "Flowboard", "Agentify", "TodoFusion", "Identify", "Nexus AI", "Landify",
            "Codify", "Flowboard", "Agentify", "TodoFusion", "Identify", "Nexus AI", "Landify"].map((logo, i) => (
            <span key={i} className="text-xl sm:text-2xl md:text-3xl font-bold text-muted-foreground/40 uppercase tracking-widest px-6 sm:px-10">
              {logo}
            </span>
          ))}
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 sm:py-32 px-5 sm:px-8 max-w-[1400px] mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center"
        >
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-muted max-w-sm mx-auto lg:max-w-none">
              <img src={aboutPhoto} alt="Portrait" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col gap-6 sm:gap-8">
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Design with purpose.<br />
              <span className="text-muted-foreground">Built with precision.</span>
            </motion.h2>

            <motion.p variants={fadeInUp} className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              I am an independent designer focused on digital products and brand identities.
              My approach bridges the gap between aesthetic beauty and functional architecture.
              Every project is an opportunity to distill complexity into simple, memorable experiences.
            </motion.p>

            <motion.div variants={fadeInUp} className="grid sm:grid-cols-2 gap-6 sm:gap-8 pt-6 sm:pt-8">
              <div>
                <h3 className="font-semibold text-base sm:text-lg mb-3 border-b border-border pb-2">Expertise</h3>
                <ul className="space-y-2 sm:space-y-3 text-muted-foreground text-sm sm:text-base">
                  <li>Digital Product Design</li>
                  <li>Brand Identity</li>
                  <li>Design Systems</li>
                  <li>Creative Direction</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-base sm:text-lg mb-3 border-b border-border pb-2">Selected Clients</h3>
                <ul className="space-y-2 sm:space-y-3 text-muted-foreground text-sm sm:text-base">
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
      <section id="projects" className="py-20 sm:py-32 px-5 sm:px-8 bg-card">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-16"
          >
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3">Selected Works</h2>
              <p className="text-muted-foreground text-base sm:text-lg">A collection of recent digital and brand projects.</p>
            </div>
            <Button variant="outline" className="rounded-full px-6 self-start sm:self-auto flex-shrink-0">
              View all work <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-8 sm:gap-x-8 sm:gap-y-12 lg:gap-y-16">
            {[
              { img: project1, title: "Nexus Spatial", category: "Brand & 3D Design", offset: "" },
              { img: project2, title: "Flow UI Kit", category: "Product Design", offset: "sm:mt-[-4rem]" },
              { img: project3, title: "Editorial Standard", category: "Web & Typography", offset: "" }
            ].map((project, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className={`group cursor-pointer ${project.offset}`}
              >
                <div className="relative overflow-hidden rounded-xl sm:rounded-2xl mb-4 sm:mb-6 bg-muted">
                  <div className="aspect-[4/3] w-full overflow-hidden">
                    <img
                      src={project.img}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-1 group-hover:text-muted-foreground transition-colors">{project.title}</h3>
                <p className="text-muted-foreground text-sm sm:text-base">{project.category}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 sm:py-32 px-5 sm:px-8 max-w-[1400px] mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid lg:grid-cols-2 gap-12 lg:gap-16"
        >
          <div>
            <motion.h2 variants={fadeInUp} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-none mb-5 sm:mb-6">
              Let's create <br />
              <span className="text-muted-foreground">together.</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-base sm:text-xl text-muted-foreground mb-8 sm:mb-12 max-w-md">
              Available for freelance opportunities. Reach out if you want to collaborate on something great.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col gap-5 sm:gap-6">
              <a href="mailto:hello@studio.com" className="flex items-center gap-4 text-base sm:text-xl font-medium hover:text-muted-foreground transition-colors w-fit">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-border flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                hello@studio.com
              </a>
              <div className="flex gap-3 sm:gap-4 pt-2">
                {[Twitter, Linkedin, Instagram, Dribbble].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-card border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-colors">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div variants={fadeInUp} className="bg-card p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl border border-border">
            <form className="flex flex-col gap-5 sm:gap-6" onSubmit={e => e.preventDefault()}>
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Name</label>
                  <input type="text" className="bg-background border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-foreground transition-colors" placeholder="John Doe" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Email</label>
                  <input type="email" className="bg-background border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-foreground transition-colors" placeholder="john@example.com" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Subject</label>
                <input type="text" className="bg-background border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-foreground transition-colors" placeholder="Project inquiry" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Message</label>
                <textarea rows={5} className="bg-background border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-foreground transition-colors resize-none" placeholder="Tell me about your project..."></textarea>
              </div>
              <Button size="lg" className="w-full rounded-lg bg-foreground text-background hover:bg-foreground/90 h-12 sm:h-14 text-sm sm:text-base mt-1">
                Send Message
              </Button>
            </form>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 px-5 sm:px-8 border-t border-border">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="font-bold tracking-tight text-lg sm:text-xl">STUDIO.</div>
          <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
            <a href="#home" className="hover:text-foreground transition-colors">Home</a>
            <a href="#about" className="hover:text-foreground transition-colors">About</a>
            <a href="#projects" className="hover:text-foreground transition-colors">Projects</a>
            <a href="#contact" className="hover:text-foreground transition-colors">Contact</a>
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">
            © {new Date().getFullYear()} Studio. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
