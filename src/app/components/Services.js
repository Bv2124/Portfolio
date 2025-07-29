// app/components/Services.js
'use client'
import { Brain, MessageCircle, Users, Heart, Clock, Shield } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const Services = () => {
  const { t } = useLanguage()

  const services = [
    {
      icon: Brain,
      title: 'Psychiatric Evaluation',
      description: 'Comprehensive mental health assessments and diagnostic services',
      color: 'primary'
    },
    {
      icon: MessageCircle,
      title: 'Individual Therapy',
      description: 'One-on-one counseling sessions tailored to your specific needs',
      color: 'accent'
    },
    {
      icon: Users,
      title: 'Group Therapy',
      description: 'Supportive group sessions fostering community and shared healing',
      color: 'green'
    },
    {
      icon: Heart,
      title: 'Family Counseling',
      description: 'Helping families navigate mental health challenges together',
      color: 'red'
    },
    {
      icon: Clock,
      title: 'Crisis Intervention',
      description: '24/7 emergency mental health support when you need it most',
      color: 'orange'
    },
    {
      icon: Shield,
      title: 'Medication Management',
      description: 'Expert psychiatric medication monitoring and adjustment',
      color: 'blue'
    }
  ]

  const colorMap = {
    primary: { bg: 'bg-primary-50', hover: 'hover:bg-primary-100', icon: 'text-primary-600' },
    accent: { bg: 'bg-accent-50', hover: 'hover:bg-accent-100', icon: 'text-accent-600' },
    green: { bg: 'bg-green-50', hover: 'hover:bg-green-100', icon: 'text-green-600' },
    red: { bg: 'bg-red-50', hover: 'hover:bg-red-100', icon: 'text-red-600' },
    orange: { bg: 'bg-orange-50', hover: 'hover:bg-orange-100', icon: 'text-orange-600' },
    blue: { bg: 'bg-blue-50', hover: 'hover:bg-blue-100', icon: 'text-blue-600' }
  }

  return (
    <section id="services" className="py-20 gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold text-secondary-900 mb-4">
            {t('servicesTitle')}
          </h2>
          <p className="text-xl text-secondary-600">
            {t('servicesSubtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const colors = colorMap[service.color]
            const Icon = service.icon
            
            return (
              <div
                key={index}
                className={`${colors.bg} ${colors.hover} p-8 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 animate-slide-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Icon className={`${colors.icon} mb-6`} size={48} />
                <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-secondary-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Services