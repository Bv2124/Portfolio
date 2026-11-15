import SectionHeading from '@/components/ui/SectionHeading'
import BoldText from '@/components/ui/BoldText'
import Reveal from '@/components/motion/Reveal'
import Photo from '@/components/ui/Photo'
import IntroVideoPlayer from '@/components/ui/IntroVideoPlayer'
import { IMAGE_WIDTHS } from '@/lib/images'
import { LiveYears } from '@/components/ui/Live'
import { BUILD_NOW } from '@/lib/build-time'
import { yearsSince } from '@/lib/experience'
import type { About as AboutData, IntroVideo, OutsideWork, Personal } from '@/lib/schema'

interface AboutProps {
  personal: Personal
  about: AboutData
  introVideo?: IntroVideo
  outsideWork?: OutsideWork
}

// This section sits on the white band, so its cards use the ground colour as their fill.
const CARD = 'rounded-3xl bg-ground p-7'

export default function About({ personal, about, introVideo, outsideWork }: AboutProps) {
  const tokens = {
    years: <LiveYears start={personal.careerStart} fallback={yearsSince(personal.careerStart, BUILD_NOW)} />,
  }

  return (
    <section id="about" aria-labelledby="about-heading" className="section-pad bg-surface">
      <div className="container-page">
        <SectionHeading id="about" intro="Who I am, what I work on, and what I do away from the keyboard." />

        <div className="grid items-start gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <Reveal className="space-y-5 lg:[@media(min-height:820px)]:sticky lg:[@media(min-height:820px)]:top-28">
            {about.paragraphs.map((para, i) => (
              <p
                key={i}
                className={i === 0 ? 'lead' : 'max-w-[34rem] text-[1.0625rem] leading-relaxed text-ink-soft'}
              >
                <BoldText text={para} tokens={tokens} />
              </p>
            ))}
          </Reveal>

          <div className="space-y-6">
            {/* The intro video: a poster with a play button. Nothing of the video is downloaded
                until the visitor presses play. */}
            {introVideo && (
              <Reveal as="figure" index={1} className="overflow-hidden rounded-3xl bg-ground">
                <IntroVideoPlayer
                  src={introVideo.src}
                  poster={introVideo.poster}
                  title={introVideo.title}
                  describedBy="intro-video-description"
                />
                <figcaption className="p-7">
                  <h3 className="text-lg font-semibold text-ink">{introVideo.title}</h3>
                  <p id="intro-video-description" className="mt-2 text-base leading-relaxed text-ink-soft">
                    {introVideo.description}
                  </p>
                </figcaption>
              </Reveal>
            )}

            <Reveal index={1} className={CARD}>
              <h3 className="text-lg font-semibold text-ink">Key achievements</h3>
              <ul className="mt-5 space-y-4">
                {about.achievements.map(ach => (
                  <li key={ach.text} className="flex items-start gap-3">
                    <span aria-hidden="true" className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span className="text-base leading-relaxed text-ink-soft">{ach.text}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal index={2} className={CARD}>
              <h3 className="text-lg font-semibold text-ink">Quick facts</h3>
              <dl className="mt-5 space-y-3">
                {personal.quickFacts.map(fact => (
                  <div key={fact.label} className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
                    <dt className="meta shrink-0 sm:w-28">{fact.label}</dt>
                    <dd className="text-base text-ink">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            {outsideWork && (
              <Reveal index={3} className="overflow-hidden rounded-3xl bg-ground">
                {outsideWork.photo && (
                  <div className="aspect-[4/3] overflow-hidden">
                    <Photo
                      src={outsideWork.photo.src}
                      alt={outsideWork.photo.alt}
                      width={1200}
                      height={1200}
                      widths={IMAGE_WIDTHS.outsideWork}
                      sizes="(min-width: 1024px) 480px, (min-width: 640px) 600px, 100vw"
                      className="h-full w-full object-cover object-[50%_65%]"
                    />
                  </div>
                )}
                <div className="p-7">
                  <h3 className="meta">Outside work</h3>
                  <p className="mt-2 text-[1.0625rem] leading-relaxed text-ink">{outsideWork.text}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {outsideWork.interests.map(interest => (
                      <li key={interest} className="chip bg-surface">{interest}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
