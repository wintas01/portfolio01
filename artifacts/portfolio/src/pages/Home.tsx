import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Twitter, Menu, X, ExternalLink, Download } from "lucide-react";

import myPhoto from "@/assets/wintas-photo.png";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
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
          <div className="font-bold text-xl tracking-tight">WINTAS.</div>

          <div className="hidden md:flex items-center gap-8 font-medium text-sm">
            {navLinks.map((link) => (
              <a key={link} href={`#${link.toLowerCase()}`} className="hover:text-muted-foreground transition-colors">
                {link}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a
              href="mailto:nnannaokechukwu1@gmail.com"
              className="hidden md:block bg-foreground text-background px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-foreground/80 transition-colors"
            >
              Start a project
            </a>
            <button
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full border border-border"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

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
                <a
                  href="mailto:nnannaokechukwu1@gmail.com"
                  className="mt-2 bg-foreground text-background px-5 py-3 rounded-full text-sm font-semibold text-center"
                >
                  Start a project
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-28 sm:pt-32 pb-16 px-5 sm:px-8 max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-8 items-center">

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
              <span className="block text-foreground">Designing</span>
              <span className="block text-muted-foreground">Digital Solutions</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-base sm:text-lg text-muted-foreground max-w-md font-light leading-relaxed">
              From web applications and AI integrations to networking projects, I transform ideas into practical, user-focused digital products.
            </motion.p>
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
              src={myPhoto}
              alt="Wintas"
              className="w-full h-full object-cover object-top"
            />

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
                <p className="text-xs sm:text-sm text-background/70 leading-tight">Currently taking on new projects.</p>
              </div>
              <a
                href="mailto:nnannaokechukwu1@gmail.com"
                className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-background/20 flex items-center justify-center hover:bg-background/30 transition-colors"
              >
                <Mail size={16} />
              </a>
            </motion.div>
          </motion.div>

        </div>
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
              <img src={myPhoto} alt="Wintas" className="w-full h-full object-cover object-top" />
            </div>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col gap-6 sm:gap-8">
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              About Me
            </motion.h2>

            <motion.p variants={fadeInUp} className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              I'm constantly learning, experimenting, and building projects that challenge my skills and contribute to my growth as a software engineer. My goal is to create technology that is not only visually appealing but also meaningful and impactful.
            </motion.p>

            <motion.div variants={fadeInUp} className="grid sm:grid-cols-2 gap-6 sm:gap-8 pt-6 sm:pt-8">
              <div>
                <h3 className="font-semibold text-base sm:text-lg mb-3 border-b border-border pb-2">Expertise</h3>
                <ul className="space-y-2 sm:space-y-3 text-muted-foreground text-sm sm:text-base">
                  <li>Web Application Development</li>
                  <li>AI Integrations</li>
                  <li>Networking Projects</li>
                  <li>UI/UX Design</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-base sm:text-lg mb-3 border-b border-border pb-2">Focus Areas</h3>
                <ul className="space-y-2 sm:space-y-3 text-muted-foreground text-sm sm:text-base">
                  <li>Practical Digital Products</li>
                  <li>User-Focused Experiences</li>
                  <li>Continuous Learning</li>
                  <li>Impactful Technology</li>
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
            className="mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3">Projects</h2>
            <p className="text-muted-foreground text-base sm:text-lg">Things I've built and places you can find my work.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
            {/* Pinterest */}
            <motion.a
              href="https://pin.it/6RYs3HQxx"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="group flex items-center gap-5 bg-background border border-border rounded-2xl p-6 sm:p-8 hover:border-foreground/30 transition-all duration-300"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#E60023] flex items-center justify-center flex-shrink-0">
                {/* Pinterest P icon */}
                <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg sm:text-xl font-bold">Pinterest</h3>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <p className="text-muted-foreground text-sm sm:text-base">Browse my design inspiration and creative boards.</p>
              </div>
            </motion.a>

            {/* VTU App */}
            <motion.a
              href="https://sabuss.com/ojsub3"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="group flex items-center gap-5 bg-background border border-border rounded-2xl p-6 sm:p-8 hover:border-foreground/30 transition-all duration-300"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-foreground flex items-center justify-center flex-shrink-0">
                <Download className="w-7 h-7 text-background" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg sm:text-xl font-bold">VTU App</h3>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <p className="text-muted-foreground text-sm sm:text-base">Download my VTU application — fast, simple, and reliable.</p>
              </div>
            </motion.a>
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
          className="max-w-2xl"
        >
          <motion.h2 variants={fadeInUp} className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-none mb-5 sm:mb-6">
            Let's create <br />
            <span className="text-muted-foreground">together.</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-base sm:text-xl text-muted-foreground mb-10 sm:mb-12">
            Available for freelance and collaboration. Reach out and let's build something great.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col gap-5">
            {/* Email */}
            <a
              href="mailto:nnannaokechukwu1@gmail.com"
              className="flex items-center gap-4 group w-fit"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-card border border-border flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors flex-shrink-0">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5 uppercase tracking-wider font-medium">Email</p>
                <p className="text-base sm:text-lg font-semibold group-hover:text-muted-foreground transition-colors">nnannaokechukwu1@gmail.com</p>
              </div>
            </a>

            {/* Twitter / X */}
            <a
              href="https://x.com/wintasblog"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 group w-fit"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-card border border-border flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors flex-shrink-0">
                {/* X (Twitter) icon */}
                <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.632L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
                </svg>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5 uppercase tracking-wider font-medium">Twitter / X</p>
                <p className="text-base sm:text-lg font-semibold group-hover:text-muted-foreground transition-colors">@wintasblog</p>
              </div>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 px-5 sm:px-8 border-t border-border">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="font-bold tracking-tight text-lg sm:text-xl">WINTAS.</div>
          <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
            {navLinks.map((link) => (
              <a key={link} href={`#${link.toLowerCase()}`} className="hover:text-foreground transition-colors">{link}</a>
            ))}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">
            © {new Date().getFullYear()} Wintas. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
