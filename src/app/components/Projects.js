'use client'
import { Calendar, Users, Target, Award } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const Projects = () => {
  const { t } = useLanguage()

  const projects = [
    {
      title: 'Mental Health Awareness Campaign',
      description: 'Community-wide initiative to reduce stigma and promote mental health literacy',
      status: 'Ongoing',
      participants: '2,500+',
      duration: '12 months',
      impact: 'Reached 10,000+ individuals',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&h=300&fit=crop',
      color: 'primary'
    },
    {
      title: 'Youth Suicide Prevention Program',
      description: 'Comprehensive program targeting adolescent mental health in schools',
      status: 'Completed',
      participants: '500+',
      duration: '6 months',
      impact: '85% reduction in crisis incidents',
      image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=500&h=300&fit=crop',
      color: 'accent'
    },
    {
      title: 'Workplace Mental Wellness',
      description: 'Corporate mental health programs for employee wellbeing',
      status: 'Expanding',
      participants: '1,200+',
      duration: 'Ongoing',
      impact: '40% improvement in productivity',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
      color: 'green'
    }
  ]

  const colorMap = {
    primary: { bg: 'bg-primary-50', border: 'border-primary-200', text: 'text-primary-600' },
    accent: { bg: 'bg-accent-50', border: 'border-accent-200', text: 'text-accent-600' },
    green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600' }
  }

  return (
    <section id="projects" className="py-20 gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold text-secondary-900 mb-4">
            Our Impact Projects
          </h2>
          <p className="text-xl text-secondary-600">
            Making a difference in our community through targeted mental health initiatives
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {projects.map((project, index) => {
            const colors = colorMap[project.color]
            
            return (
              <div
                key={index}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-slide-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className={`absolute top-4 right-4 px-3 py-1 ${colors.bg} ${colors.border} border rounded-full`}>
                    <span className={`text-sm font-medium ${colors.text}`}>
                      {project.status}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-secondary-900 mb-3">
                    {project.title}
                  </h3>
                  <p className="text-secondary-600 mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-sm text-secondary-600">
                      <Users size={16} className="mr-2" />
                      {project.participants}
                    </div>
                    <div className="flex items-center text-sm text-secondary-600">
                      <Calendar size={16} className="mr-2" />
                      {project.duration}
                    </div>
                  </div>
                  
                  <div className={`${colors.bg} rounded-lg p-3`}>
                    <div className="flex items-center">
                      <Target size={16} className={`mr-2 ${colors.text}`} />
                      <span className="text-sm font-medium text-secondary-700">
                        Impact: {project.impact}
                      </span>
                    </div>
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

export default Projects