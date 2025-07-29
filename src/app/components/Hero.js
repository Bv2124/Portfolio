'use client'
import { ArrowRight, Heart, Shield, Users } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const Hero = () => {
  const { t } = useLanguage()

  return (
    <section id="home" className="min-h-screen flex items-center gradient-bg relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-200 rounded-full opacity-10 animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-in-left">
            <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 mb-6 leading-tight">
              {t('heroTitle')}
            </h1>
            <p className="text-xl text-secondary-600 mb-8 leading-relaxed">
              {t('heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-lg shadow-lg hover:bg-primary-700 transform hover:scale-105 transition-all duration-200">
                {t('getStarted')}
                <ArrowRight className="ml-2" size={20} />
              </button>
              <button className="inline-flex items-center px-8 py-4 border-2 border-primary-600 text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-all duration-200">
                {t('learnMore')}
              </button>
            </div>
          </div>
          
          <div className="animate-slide-in-right">
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-6 bg-primary-50 rounded-xl">
                    <Heart className="mx-auto mb-4 text-primary-600" size={32} />
                    <h3 className="font-semibold text-secondary-800">Compassionate Care</h3>
                  </div>
                  <div className="text-center p-6 bg-accent-50 rounded-xl">
                    <Shield className="mx-auto mb-4 text-accent-600" size={32} />
                    <h3 className="font-semibold text-secondary-800">Safe Environment</h3>
                  </div>
                  <div className="text-center p-6 bg-green-50 rounded-xl col-span-2">
                    <Users className="mx-auto mb-4 text-green-600" size={32} />
                    <h3 className="font-semibold text-secondary-800">Expert Team</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero