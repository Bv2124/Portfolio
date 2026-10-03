import 'server-only'
import { rawContent } from '@/content'
import { ContentSchema } from './schema'

// Validated once at build time (and on every dev reload). A bad content file
// fails `next build` with the exact path of the problem, and visitors pay nothing.
export const content = ContentSchema.parse(rawContent)

export const getProfile = () => content.profile
export const getExperience = () => content.experience
export const getSkills = () => content.skills.skills
export const getSkillCategories = () => content.skills.categories
export const getProjects = () => content.projects
export const getEducation = () => content.education

// Unique skill names, used for the <meta keywords> tag.
export const getSkillKeywords = () => [...new Set(content.skills.skills.map(s => s.name))]
