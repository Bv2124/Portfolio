// app/components/Footer.js
'use client'
import { Heart, Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const Footer = () => {
  const { t } = useLanguage()

  return (
    <footer className="bg-secondary-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-gradient mb-4">
              Akam Psychiatric Care
            </h3>
            <p className="text-secondary-300 mb-6 leading-relaxed">
              Your trusted partner in mental wellness. We provide compassionate, 
              evidence-based mental health care to help you achieve your highest potential.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="bg-secondary-800 p-3 rounded-lg hover:bg-primary-600 transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="bg-secondary-800 p-3 rounded-lg hover:bg-primary-600 transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="bg-secondary-800 p-3 rounded-lg hover:bg-primary-600 transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="bg-secondary-800 p-3 rounded-lg hover:bg-primary-600 transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('quickLinks')}</h4>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-secondary-300 hover:text-white transition-colors duration-200">
                  {t('home')}
                </a>
              </li>
              <li>
                <a href="#about" className="text-secondary-300 hover:text-white transition-colors duration-200">
                  {t('about')}
                </a>
              </li>
              <li>
                <a href="#team" className="text-secondary-300 hover:text-white transition-colors duration-200">
                  {t('team')}
                </a>
              </li>
              <li>
                <a href="#projects" className="text-secondary-300 hover:text-white transition-colors duration-200">
                  {t('projects')}
                </a>
              </li>
              <li>
                <a href="#contact" className="text-secondary-300 hover:text-white transition-colors duration-200">
                  {t('contact')}
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('ourServices')}</h4>
            <ul className="space-y-2">
              <li>
                <a href="#services" className="text-secondary-300 hover:text-white transition-colors duration-200">
                  Psychiatric Evaluation
                </a>
              </li>
              <li>
                <a href="#services" className="text-secondary-300 hover:text-white transition-colors duration-200">
                  Individual Therapy
                </a>
              </li>
              <li>
                <a href="#services" className="text-secondary-300 hover:text-white transition-colors duration-200">
                  Group Therapy
                </a>
              </li>
              <li>
                <a href="#services" className="text-secondary-300 hover:text-white transition-colors duration-200">
                  Family Counseling
                </a>
              </li>
              <li>
                <a href="#services" className="text-secondary-300 hover:text-white transition-colors duration-200">
                  Crisis Intervention
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-secondary-800 mt-12 pt-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-center space-x-3">
              <Phone size={20} className="text-primary-400" />
              <span className="text-secondary-300">+91 98765 43210</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail size={20} className="text-primary-400" />
              <span className="text-secondary-300">info@akamcare.com</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-secondary-400 text-sm">
            © 2024 Akam Psychiatric Care Center. {t('rightsReserved')}
          </p>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <span className="text-secondary-400 text-sm">Made with</span>
            <Heart size={16} className="text-red-400" />
            <span className="text-secondary-400 text-sm">for mental wellness</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer