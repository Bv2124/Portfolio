import type { MetadataRoute } from 'next'
import { SITE_URL, caseStudyUrl, getCaseStudies } from '@/lib/content'

// Required for metadata routes under `output: 'export'`.
export const dynamic = 'force-static'

// URLs carry the trailing slash the static export serves, matching each page's canonical link.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: 'monthly', priority: 1 },
    ...getCaseStudies().map(study => ({
      url: caseStudyUrl(study.slug),
      changeFrequency: 'yearly' as const,
      priority: 0.8,
    })),
  ]
}
