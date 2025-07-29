'use client'
import { createContext, useContext, useState } from 'react'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

const translations = {
  en: {
    // Navigation
    home: 'Home',
    about: 'About',
    services: 'Services',
    team: 'Team',
    projects: 'Projects',
    achievements: 'Achievements',
    gallery: 'Gallery',
    contact: 'Contact',
    
    // Hero
    heroTitle: 'Your Mental Wellness Journey Begins Here',
    heroSubtitle: 'Compassionate care, evidence-based treatment, and personalized support for your mental health needs.',
    getStarted: 'Get Started',
    learnMore: 'Learn More',
    
    // About
    aboutTitle: 'About Akam Psychiatric Care',
    aboutDescription: 'At Akam Psychiatric Care Center, we believe in holistic mental health care that treats the whole person, not just symptoms. Our comprehensive approach combines evidence-based treatments with compassionate care.',
    ourMission: 'Our Mission',
    missionText: 'To provide accessible, compassionate, and effective mental health services that empower individuals to achieve their highest potential.',
    ourVision: 'Our Vision',
    visionText: 'A world where mental health is prioritized, stigma is eliminated, and everyone has access to quality care.',
    
    // Services
    servicesTitle: 'Our Services',
    servicesSubtitle: 'Comprehensive mental health care tailored to your needs',
    
    // Team
    teamTitle: 'Meet Our Expert Team',
    teamSubtitle: 'Dedicated professionals committed to your mental wellness',
    
    // Contact
    contactTitle: 'Get in Touch',
    contactSubtitle: 'Ready to start your mental wellness journey? Contact us today.',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    message: 'Message',
    sendMessage: 'Send Message',
    
    // Footer
    quickLinks: 'Quick Links',
    ourServices: 'Our Services',
    followUs: 'Follow Us',
    rightsReserved: 'All rights reserved.',
  },
  ta: {
    // Navigation (Tamil)
    home: 'முகப்பு',
    about: 'எங்களைப் பற்றி',
    services: 'சேவைகள்',
    team: 'குழு',
    projects: 'திட்டங்கள்',
    achievements: 'சாதனைகள்',
    gallery: 'படங்கள்',
    contact: 'தொடர்பு',
    
    // Hero (Tamil)
    heroTitle: 'உங்கள் மன நலப் பயணம் இங்கே தொடங்குகிறது',
    heroSubtitle: 'அன்பான பராமரிப்பு, சான்று அடிப்படையிலான சிகிச்சை, மற்றும் உங்கள் மன நலத் தேவைகளுக்கான தனிப்பட்ட ஆதரவு.',
    getStarted: 'தொடங்குங்கள்',
    learnMore: 'மேலும் அறிக',
    
    // About (Tamil)
    aboutTitle: 'அகம் மனநல மையத்தைப் பற்றி',
    aboutDescription: 'அகம் மனநல மையத்தில், அறிகுறிகளை மட்டும் அல்லாமல் முழு நபரையும் சிகிச்சை செய்யும் முழுமையான மன நலப் பராமரிப்பில் நாங்கள் நம்புகிறோம்.',
    ourMission: 'எங்கள் நோக்கம்',
    missionText: 'தனிநபர்கள் தங்கள் உயர்ந்த திறனை அடைய அதிகாரம் அளிக்கும் அணுகக்கூடிய, அன்பான மற்றும் பயனுள்ள மன நல சேவைகளை வழங்குவது.',
    ourVision: 'எங்கள் பார்வை',
    visionText: 'மன நலம் முன்னுரிமை பெறும், களங்கம் அகற்றப்படும், மற்றும் அனைவருக்கும் தரமான பராமரிப்பு கிடைக்கும் உலகம்.',
    
    // Services (Tamil)
    servicesTitle: 'எங்கள் சேவைகள்',
    servicesSubtitle: 'உங்கள் தேவைகளுக்கு ஏற்ப வடிவமைக்கப்பட்ட விரிவான மன நலப் பராமரிப்பு',
    
    // Team (Tamil)
    teamTitle: 'எங்கள் நிபுணர் குழுவை சந்திக்கவும்',
    teamSubtitle: 'உங்கள் மன நலத்திற்கு அர்ப்பணிக்கப்பட்ட தொழில் வல்லுநர்கள்',
    
    // Contact (Tamil)
    contactTitle: 'தொடர்பு கொள்ளுங்கள்',
    contactSubtitle: 'உங்கள் மன நலப் பயணத்தை தொடங்க தயாரா? இன்றே எங்களை தொடர்பு கொள்ளுங்கள்.',
    name: 'பெயர்',
    email: 'மின்னஞ்சல்',
    phone: 'தொலைபேசி',
    message: 'செய்தி',
    sendMessage: 'செய்தி அனுப்பு',
    
    // Footer (Tamil)
    quickLinks: 'விரைவு இணைப்புகள்',
    ourServices: 'எங்கள் சேவைகள்',
    followUs: 'எங்களை பின்தொடருங்கள்',
    rightsReserved: 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
  }
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en')
  
  const t = (key) => translations[language][key] || key
  
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ta' : 'en')
  }
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}