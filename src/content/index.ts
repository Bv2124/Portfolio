// Raw, unvalidated content. Import validated content from '@/lib/content' instead.
import profile from './profile.json'
import experience from './experience.json'
import skills from './skills.json'
import projects from './projects.json'
import education from './education.json'
import salesforceMigration from './case-studies/salesforce-to-django-migration.json'
import productionOwnership from './case-studies/production-ownership.json'
import offlineSync from './case-studies/offline-first-field-sync.json'

// Order here is the order shown on the site and used for previous/next navigation.
const caseStudies = [salesforceMigration, productionOwnership, offlineSync]

export const rawContent = { profile, experience, skills, projects, caseStudies, education }
