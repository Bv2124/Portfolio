// app/components/Team.js
'use client'
import { useLanguage } from '../contexts/LanguageContext'

const Team = () => {
  const { t } = useLanguage()

  const teamMembers = [
    {
      name: 'Dr. Priya Sharma',
      role: 'Chief Psychiatrist',
      specialization: 'Adult Psychiatry, Mood Disorders',
      experience: '15+ years',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=faces',
      description: 'Leading expert in mood disorders with extensive experience in cognitive behavioral therapy.'
    },
    {
      name: 'Dr. Rajesh Kumar',
      role: 'Child Psychiatrist',
      specialization: 'Pediatric Mental Health, ADHD',
      experience: '12+ years',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=faces',
      description: 'Specialized in child and adolescent mental health with a focus on developmental disorders.'
    },
    {
      name: 'Dr. Meera Nair',
      role: 'Clinical Psychologist',
      specialization: 'Trauma Therapy, Anxiety Disorders',
      experience: '10+ years',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=faces',
      description: 'Expert in trauma-informed care and evidence-based psychological interventions.'
    },
    {
      name: 'Dr. Arjun Reddy',
      role: 'Addiction Specialist',
      specialization: 'Substance Abuse, Rehabilitation',
      experience: '8+ years',
      image: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=400&fit=crop&crop=faces',
      description: 'Dedicated to helping individuals overcome addiction through comprehensive treatment programs.'
    }
  ]

  return (
    <section id="team" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold text-secondary-900 mb-4">
            {t('teamTitle')}
          </h2>
          <p className="text-xl text-secondary-600">
            {t('teamSubtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative mb-6">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-48 object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-2">
                {member.name}
              </h3>
              <p className="text-primary-600 font-semibold mb-2">
                {member.role}
              </p>
              <p className="text-sm text-secondary-600 mb-2">
                {member.specialization}
              </p>
              <p className="text-sm text-accent-600 font-medium mb-3">
                {member.experience}
              </p>
              <p className="text-secondary-600 text-sm leading-relaxed">
                {member.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Team