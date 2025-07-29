'use client'
import { Award, Users, Heart, Star, TrendingUp, Shield } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const Achievements = () => {
  const { t } = useLanguage()

  const achievements = [
    {
      icon: Award,
      title: 'Excellence in Mental Healthcare',
      subtitle: 'National Healthcare Awards 2023',
      description: 'Recognized for outstanding contribution to mental health services',
      year: '2023'
    },
    {
      icon: Users,
      title: '10,000+ Lives Touched',
      subtitle: 'Community Impact Milestone',
      description: 'Successfully provided care to over 10,000 individuals and families',
      year: '2024'
    },
    {
      icon: Heart,
      title: 'Patient Satisfaction Award',
      subtitle: '98% Patient Satisfaction Rate',
      description: 'Consistently rated as the top psychiatric care center in the region',
      year: '2023'
    },
    {
      icon: Star,
      title: 'Innovation in Treatment',
      subtitle: 'Digital Health Innovation Award',
      description: 'Pioneering teletherapy and digital mental health solutions',
      year: '2024'
    },
    {
      icon: TrendingUp,
      title: 'Research Excellence',
      subtitle: 'Published 15+ Research Papers',
      description: 'Contributing to global mental health research and best practices',
      year: '2023-24'
    },
    {
      icon: Shield,
      title: 'Accreditation Achievement',
      subtitle: 'Joint Commission Accredited',
      description: 'Meeting the highest standards of safety and quality in healthcare',
      year: '2023'
    }
  ]

  const stats = [
    { number: '15+', label: 'Years of Excellence', icon: Award },
    { number: '50+', label: 'Expert Staff', icon: Users },
    { number: '10K+', label: 'Patients Served', icon: Heart },
    { number: '98%', label: 'Success Rate', icon: TrendingUp }
  ]

  return (
    <section id="achievements" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold text-secondary-900 mb-4">
            Our Achievements
          </h2>
          <p className="text-xl text-secondary-600">
            Celebrating milestones in our journey of mental healthcare excellence
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className="text-center p-6 bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Icon className="mx-auto mb-4 text-primary-600" size={40} />
                <div className="text-3xl font-bold text-secondary-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-secondary-600 font-medium">
                  {stat.label}
                </div>
              </div>
            )
          })}
        </div>

        {/* Achievements Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon
            
            return (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-primary-50 border border-primary-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-primary-100 p-3 rounded-xl">
                    <Icon className="text-primary-600" size={32} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-primary-600 font-semibold mb-1">
                      {achievement.year}
                    </div>
                    <h3 className="text-xl font-bold text-secondary-900 mb-2">
                      {achievement.title}
                    </h3>
                    <p className="text-accent-600 font-medium mb-3">
                      {achievement.subtitle}
                    </p>
                    <p className="text-secondary-600 leading-relaxed">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Achievements