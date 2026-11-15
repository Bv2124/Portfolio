import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  SITE_URL,
  caseStudyUrl,
  getCaseStudies,
  getCaseStudy,
  getCaseStudyNeighbors,
  getJobForCaseStudy,
  getProfile,
  navPersonal,
  siteOpenGraph,
} from '@/lib/content'
import ScrollProgressBar from '@/components/layout/ScrollProgressBar'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CaseStudyHero from '@/components/case-study/CaseStudyHero'
import CaseStudyBody from '@/components/case-study/CaseStudyBody'
import JsonLd from '@/components/ui/JsonLd'

interface PageProps {
  params: Promise<{ slug: string }>
}

// Only the slugs below exist; anything else is a 404 (required for the static export).
export const dynamicParams = false

export function generateStaticParams() {
  return getCaseStudies().map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const study = getCaseStudy(slug)
  if (!study) return {}

  const url = caseStudyUrl(study.slug)
  return {
    title: study.title, // the layout's title template appends the site name
    description: study.seoDescription,
    alternates: { canonical: url },
    openGraph: { ...siteOpenGraph, type: 'article', url, title: study.title, description: study.seoDescription },
    twitter: { card: 'summary_large_image', title: study.title, description: study.seoDescription },
  }
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params
  const study = getCaseStudy(slug)
  if (!study) notFound()

  const { personal } = getProfile()
  const job = getJobForCaseStudy(study)
  const { prev, next } = getCaseStudyNeighbors(study.slug)
  const related = (study.related ?? []).flatMap(rel => {
    const other = getCaseStudy(rel)
    return other ? [{ slug: other.slug, title: other.title }] : []
  })

  const url = caseStudyUrl(study.slug)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        '@id': `${url}#article`,
        headline: study.title,
        description: study.tagline,
        url,
        mainEntityOfPage: url,
        author: { '@id': `${SITE_URL}/#person` },
        inLanguage: 'en',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Case studies', item: `${SITE_URL}/#case-studies` },
          { '@type': 'ListItem', position: 3, name: study.title, item: url },
        ],
      },
    ],
  }

  return (
    <div className="min-h-screen bg-ground text-ink">
      <JsonLd data={jsonLd} />
      <ScrollProgressBar />
      <Navbar personal={navPersonal} />

      <main id="main" tabIndex={-1} className="pb-24">
        <article className="container-page">
          <CaseStudyHero study={study} job={job} />
          <CaseStudyBody
            study={study}
            related={related}
            prev={prev ? { slug: prev.slug, title: prev.title } : null}
            next={next ? { slug: next.slug, title: next.title } : null}
            sourceUrl={
              personal.sourceRepo
                ? `${personal.sourceRepo}/blob/main/src/content/case-studies/${study.slug}.json`
                : null
            }
          />
        </article>
      </main>

      <Footer personal={personal} />
    </div>
  )
}
