'use client'

import { useState, useEffect } from 'react'
import {
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Download,
  ExternalLink,
  Smartphone,
  Database,
  Shield,
  Zap,
  Code,
  Layers,
  Globe,
  ChevronDown,
  Monitor,     // For HTML
  Palette,     // For CSS
  Box,         // For Bootstrap
  Feather,     // For Tailwind
  Atom,        // For React
  Apple,       // For Xcode
  Compass,
  Wind,
  Flame,
  Terminal,
  Code2,
  Server
} from 'lucide-react'
import ScrollProgressBar from './components/Scrollable'
export default function Home() {
  const [isVisible, setIsVisible] = useState(false)
  const roles = [
    "Hybrid Mobile App Developer",
    "React Web Developer", 
    "Next.js Developer"
  ];
  
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  useEffect(() => {
    const currentRole = roles[currentRoleIndex];
    
    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (charIndex < currentRole.length) {
          setDisplayText(currentRole.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else {
          // Pause before deleting
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        // Deleting
        if (charIndex > 0) {
          setDisplayText(currentRole.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else {
          // Move to next role
          setIsDeleting(false);
          setCurrentRoleIndex((currentRoleIndex + 1) % roles.length);
        }
      }
    }, isDeleting ? 50 : 100); // Faster deletion, slower typing

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, currentRoleIndex, roles]);
  useEffect(() => {
    setIsVisible(true)
  }, [])
  useEffect(() => {
    const container = document.querySelector('.scroll-grow');
    if (!container) return;

    let scrollTimeout;

    const handleScroll = () => {
      container.classList.add('scrolling');

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        container.classList.remove('scrolling');
      }, 500); // Shrinks after 500ms idle
    };

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);



  const skills = [
    // Frontend
    { name: 'HTML5', icon: Monitor, color: 'text-orange-600', category: 'Frontend', level: 'Expert' },
    { name: 'CSS3', icon: Palette, color: 'text-blue-400', category: 'Frontend', level: 'Expert' },
    { name: 'React', icon: Atom, color: 'text-cyan-500', category: 'Frontend', level: 'Intermediate' },
    { name: 'Next.js', icon: Globe, color: 'text-gray-700', category: 'Frontend', level: 'Basic' },
    { name: 'Bootstrap', icon: Box, color: 'text-purple-700', category: 'Frontend', level: 'Basic' },
    { name: 'Tailwind CSS', icon: Wind, color: 'text-sky-500', category: 'Frontend', level: 'Basic' },

    // Backend
    { name: 'Firebase', icon: Flame, color: 'text-orange-500', category: 'Backend', level: 'Basic' },
    { name: 'CryptoJS', icon: Shield, color: 'text-red-500', category: 'Backend', level: 'Basic' },

    // Tools
    { name: 'React Native CLI', icon: Smartphone, color: 'text-blue-500', category: 'Tools', level: 'Expert' },
    { name: 'Expo', icon: Compass, color: 'text-black', category: 'Tools', level: 'Basic' },
    { name: 'Xcode', icon: Apple, color: 'text-gray-800', category: 'Tools', level: 'Intermediate' },
    { name: 'Android Studio', icon: Terminal, color: 'text-green-600', category: 'Tools', level: 'Intermediate' },
    { name: 'TypeScript', icon: Code2, color: 'text-blue-600', category: 'Tools', level: 'Basic' },
    { name: 'Redux Toolkit', icon: Layers, color: 'text-purple-500', category: 'Tools', level: 'Basic' },

    // Database
    { name: 'SQLite', icon: Database, color: 'text-green-500', category: 'Database', level: 'Intermediate' },
    { name: 'MySQL', icon: Server, color: 'text-teal-600', category: 'Database', level: 'Basic' },
  ];


  const projects = [
    {
      title: 'Mission-Critical Enterprise Application',
      description:
        'Revolutionized facility management with an offline-first mobile solution serving 2,000+ field technicians. Designed with military-grade encryption, advanced barcode scanning, and intelligent media capture to enable seamless offline functionality in enterprise environments.',
      tech: ['React Native', 'Redux Toolkit', 'SQLite', 'CryptoJS'],
      highlights: [
        'Zero-downtime operations',
        'Encrypted data fortress',
        'Cross-platform excellence'
      ]
    },
    {
      title: 'Customer Experience Command Center',
      description:
        'Built a dynamic customer management platform with live visit tracking, instant service escalation, backend sync, and features like digital signatures and intelligent retry mechanisms for robust field operations.',
      tech: ['React Native', 'Redux', 'SQLite', 'Custom APIs'],
      highlights: [
        'Real-time client intelligence',
        'Professional documentation suite',
        'Bulletproof sync architecture'
      ]
    },
    {
      title: 'Smart Attendance Revolution',
      description:
        'Created a GPS-powered workforce management app using geofencing, QR code validation, and offline logging to handle attendance in remote areas with military precision.',
      tech: ['React Native', 'Redux', 'SQLite', 'GeoLocation'],
      highlights: [
        'GPS-intelligent validation',
        'Offline-first resilience',
        'Enterprise scalability'
      ]
    },
    {
      title: 'WebView Application Hybrid',
      description:
        'Converted web-based systems into native apps using react-native-webview, merging hybrid architecture with native integration and optimized rendering for smooth enterprise use.',
      tech: ['React Native', 'react-native-webview'],
      highlights: [
        'Hybrid excellence',
        'Native capability integration',
        'Performance optimization'
      ]
    }
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 bg-gradient-to-b from-blue-500 to-purple-600">
      <ScrollProgressBar />
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-50 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-xl font-bold gradient-text">
              Vigneshwaran B
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#about" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">About</a>
              <a href="#skills" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">Skills</a>
              <a href="#projects" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">Projects</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <>
              <div className="text-center max-w-5xl mx-auto">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                  Hi I&apos;m
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Vigneshwaran</span>
                  <br />
                  <span className="text-3xl sm:text-4xl lg:text-4xl">
                    {displayText}
                    <span className="animate-pulse">|</span>
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                  Passionate about creating innovative digital solutions and bringing ideas to life through code.
                </p>
              </div>
            </>

            <div className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed space-y-7">
              <p>
                🚀 Passionate about crafting <strong>game-changing mobile experiences</strong> that work everywhere!
                Specializing in bulletproof offline-first architecture with React Native & SQLite that keeps
                <strong> 2000+ field technicians powered up</strong> across the globe.
              </p>

              <p>
                From zero connectivity zones to lightning-fast syncing - I build apps that never let you down!
                🔥 <strong>Fast learner & tech explorer</strong> - currently mastering React Web & Next.js to expand
                from mobile-first to full-stack powerhouse!
              </p>

              <p>
                💪 Ready to transform your next big idea into mobile magic? ✨
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="#projects"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
              >
                View Projects
              </a>
              <a
                href="./VIGNESHWARAN.pdf"
                download
                className="group relative overflow-hidden border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-lg font-semibold hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 flex items-center gap-2  hover:shadow-lg"
              >
                <Download
                  size={20}
                  className="transition-transform duration-300 group-hover:translate-y-[-4px] group-hover:text-blue-500"
                />
                <span className="transition-colors duration-300 group-hover:text-blue-500">
                  Download Resume
                </span>
              </a>

            </div>
          </div>
          <div className="mt-16 animate-bounce" onClick={() => {
            const e = document.getElementById("about")
            if (e) {
              e.scrollIntoView({ behavior: "smooth" })
            }
          }}>
            <ChevronDown className="mx-auto text-gray-400" size={32} />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              About Me
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                I&apos;m a passionate React & React Native Developer based in <strong>Coimbatore, India</strong>,
                with over <strong>2 years of experience</strong> specializing in building offline-first,
                high-performance mobile applications.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Currently at <strong>Nanosoft Engineers Pvt Ltd</strong>, I&apos;ve led the development of mobile apps
                that serve <strong>2000 + field technicians globally</strong>. My expertise lies in creating
                scalable architecture, implementing secure data solutions, and delivering blazing-fast UI
                experiences across Android and iOS platforms.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                I&apos;m proficient in <strong>Redux</strong>, <strong>Context API</strong>, and
                <strong> Next.js basics</strong>, enabling me to build robust apps and sleek user experiences
                for both mobile and web platforms.
              </p>

              <div className="flex items-center gap-4 pt-4">
                <MapPin className="text-blue-600" size={20} />
                <span className="text-gray-600 dark:text-gray-300">Coimbatore, Tamil Nadu, India</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-700 dark:to-slate-600 p-8 rounded-2xl">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Key Achievements</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <span className="text-gray-600 dark:text-gray-300">Led full-cycle app releases to Play Store and App Store</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                  <span className="text-gray-600 dark:text-gray-300">Implemented custom sync logic for low-connectivity environments</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <span className="text-gray-600 dark:text-gray-300">Secured apps with encrypted local storage using CryptoJS</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                  <span className="text-gray-600 dark:text-gray-300">Enhanced app performance and designed elegant mobile interfaces</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Heading */}
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Tech Stack
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto"></div>
          </div>

          {/* Category Groups with Slide-Up */}
          {['Frontend', 'Backend', 'Tools', 'Database'].map((category, catIndex) => (
            <div
              key={category}
              className="mb-12 animate-slide-up"
              style={{ animationDelay: `${catIndex * 0.2}s`, animationFillMode: 'both' }}
            >
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">{category}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {skills
                  .filter((skill) => skill.category === category)
                  .map((skill, index) => {
                    const IconComponent = skill.icon;
                    return (
                      <div
                        key={skill.name}
                        className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 text-center relative animate-fade-in"
                        style={{
                          animationDelay: `${index * 0.1}s`,
                          animationFillMode: 'both'
                        }}
                      >
                        <IconComponent className={`mx-auto mb-3 ${skill.color}`} size={32} />
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                          {skill.name}
                        </h3>
                        <span className="inline-block mt-2 text-xs text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full border border-gray-300 dark:border-gray-500">
                          {skill.level}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}

          {/* Highlight Section with Fade-In */}
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center animate-fade-in">
            <h3 className="text-2xl font-bold mb-4">Specialized in Offline-First Architecture</h3>
            <p className="text-lg opacity-90 max-w-3xl mx-auto">
              Expert in building mobile apps that work seamlessly without internet connectivity,
              featuring custom synchronization logic, encrypted local storage, and optimized performance
              for field operations in remote environments.
            </p>
          </div>
        </div>
      </section>




      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Projects
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div
                key={project.title}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-600 p-6 rounded-xl shadow-lg card-hover border border-gray-200 dark:border-gray-600"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {project.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  {project.description}
                </p>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  {project.highlights.map((highlight) => (
                    <div key={highlight} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="https://github.com/Bv2124"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-300"
            >
              <Github size={20} />
              View More on GitHub
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Let&apos;s Build Something Powerful
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Ready to create code that works <strong>offline</strong>, performs <strong>reliably</strong>,
              and <strong>scales with confidence</strong>? Let&apos;s connect!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 animate-fade-in-up">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Get In Touch
              </h3>

              {/* Phone */}
              <a
                href="tel:+919487941025"
                className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg"
              >
                <Phone className="text-green-600" size={24} />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">Phone / Whatsapp</div>
                  <div className="text-gray-600 dark:text-gray-300">+91 9487941025</div>
                  <div className="text-gray-600 dark:text-gray-300">+91 8610075771</div>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:bvjamalian@gmail.com"
                className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg"
              >
                <Mail className="text-blue-600" size={24} />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">Email</div>
                  <div className="text-gray-600 dark:text-gray-300">bvjamalian@gmail.com</div>
                </div>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com/in/vignesh-waran-18599a2b2"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg"
              >
                <Linkedin className="text-blue-600" size={24} />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">LinkedIn</div>
                  <div className="text-gray-600 dark:text-gray-300">Connect with me</div>
                </div>
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/Bv2124"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg"
              >
                <Github className="text-gray-700 dark:text-gray-300" size={24} />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">GitHub</div>
                  <div className="text-gray-600 dark:text-gray-300">Check out my code</div>
                </div>
              </a>
            </div>


            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-8 rounded-2xl text-white">
              <h3 className="text-2xl font-bold mb-6">Why Work With Me?</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Shield className="mt-1 flex-shrink-0" size={20} />
                  <span><strong>Security-First:</strong> Encrypted storage and secure authentication flows</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="mt-1 flex-shrink-0" size={20} />
                  <span><strong>Performance-Driven:</strong> Optimized for speed and efficiency</span>
                </li>
                <li className="flex items-start gap-3">
                  <Smartphone className="mt-1 flex-shrink-0" size={20} />
                  <span><strong>Cross-Platform:</strong> Native performance on both iOS and Android</span>
                </li>
                <li className="flex items-start gap-3">
                  <Database className="mt-1 flex-shrink-0" size={20} />
                  <span><strong>Offline-Ready:</strong> Works seamlessly without internet connectivity</span>
                </li>
                <li className="flex items-start gap-3">
                  <Code className="mt-1 flex-shrink-0" size={20} />
                  <span><strong>Clean Architecture:</strong> Scalable and maintainable codebase with reusable components</span>
                </li>
                <li className="flex items-start gap-3">
                  <Monitor className="mt-1 flex-shrink-0" size={20} />
                  <span><strong>Pixel-Perfect UI:</strong> Delightful user interfaces crafted with attention to detail</span>
                </li>
                <li className="flex items-start gap-3">
                  <Feather className="mt-1 flex-shrink-0" size={20} />
                  <span><strong>Design-Driven:</strong> Collaborates effectively with designers and follows best UX practices</span>
                </li>
                <li className="flex items-start gap-3">
                  <Globe className="mt-1 flex-shrink-0" size={20} />
                  <span><strong>Global Mindset:</strong> Builds apps that are localization-ready and timezone-aware</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <h3 className="text-2xl font-bold gradient-text mb-4">Vigneshwaran B</h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Passionate about building mobile apps that work offline, perform reliably, and scale with confidence.
              Let&apos;s create something amazing together!
            </p>
          </div>

          <div className="flex justify-center space-x-6 mb-8">
            <a
              href="https://github.com/Bv2124"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Github size={24} />
            </a>
            <a
              href="https://linkedin.com/in/vignesh-waran-18599a2b2"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Linkedin size={24} />
            </a>
            <a
              href="mailto:bvjamalian@gmail.com"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Mail size={24} />
            </a>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <p className="text-gray-400">
              © 2025 Vigneshwaran B. Built with Next.js and Tailwind CSS.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}