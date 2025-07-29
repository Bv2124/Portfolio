'use client'
import { Target, Eye, Award, Users } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const About = () => {
  const { t } = useLanguage()

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold text-secondary-900 mb-4">
            {t('aboutTitle')}
          </h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            {t('aboutDescription')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="animate-slide-in-left">
            <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-8">
              <Target className="mb-6 text-primary-600" size={48} />
              <h3 className="text-2xl font-bold text-secondary-900 mb-4">
                {t('ourMission')}
              </h3>
              <p className="text-secondary-600 leading-relaxed">
                {t('missionText')}
              </p>
            </div>
          </div>

          <div className="animate-slide-in-right">
            <div className="bg-gradient-to-br from-accent-50 to-primary-50 rounded-2xl p-8">
              <Eye className="mb-6 text-accent-600" size={48} />
              <h3 className="text-2xl font-bold text-secondary-900 mb-4">
                {t('ourVision')}
              </h3>
              <p className="text-secondary-600 leading-relaxed">
                {t('visionText')}
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 animate-slide-up">
          <div className="text-center p-6 rounded-xl bg-primary-50 hover:bg-primary-100 transition-colors duration-300">
            <Award className="mx-auto mb-4 text-primary-600" size={40} />
            <h4 className="text-xl font-semibold text-secondary-900 mb-2">Excellence</h4>
            <p className="text-secondary-600">Committed to the highest standards of mental health care</p>
          </div>
          
          <div className="text-center p-6 rounded-xl bg-accent-50 hover:bg-accent-100 transition-colors duration-300">
            <Users className="mx-auto mb-4 text-accent-600" size={40} />
            <h4 className="text-xl font-semibold text-secondary-900 mb-2">Community</h4>
            <p className="text-secondary-600">Building supportive communities for mental wellness</p>
          </div>
          
          <div className="text-center p-6 rounded-xl bg-green-50 hover:bg-green-100 transition-colors duration-300">
            <Target className="mx-auto mb-4 text-green-600" size={40} />
            <h4 className="text-xl font-semibold text-secondary-900 mb-2">Innovation</h4>
            <p className="text-secondary-600">Integrating cutting-edge treatments with traditional care</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About