'use client'

import { useEffect, useRef, useState } from 'react'
import { Play } from 'lucide-react'

interface IntroVideoPlayerProps {
  src: string
  poster: string
  title: string
  // id of the element that describes what the video shows.
  describedBy: string
}

// Shows the poster frame with a play button; the video element is only created when the visitor
// presses it. Until then nothing of the video is downloaded and no media element is on the page.
// Without JavaScript the button is an ordinary link to the video file.
export default function IntroVideoPlayer({ src, poster, title, describedBy }: IntroVideoPlayerProps) {
  const [playing, setPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Keyboard users stay where they were: focus moves from the play button to the video controls.
  useEffect(() => {
    if (playing) videoRef.current?.focus()
  }, [playing])

  if (playing) {
    return (
      <video
        ref={videoRef}
        controls
        autoPlay
        playsInline
        poster={poster}
        width={1280}
        height={720}
        aria-label={title}
        aria-describedby={describedBy}
        className="block aspect-video w-full bg-tint"
      >
        <source src={src} type="video/mp4" />
      </video>
    )
  }

  return (
    <a
      href={src}
      onClick={event => {
        event.preventDefault()
        setPlaying(true)
      }}
      aria-label={`Play video: ${title}`}
      aria-describedby={describedBy}
      className="group relative block aspect-video overflow-hidden bg-tint"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- a single small poster frame; next/image cannot resize in a static export */}
      <img
        src={poster}
        alt=""
        width={1280}
        height={720}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
      />
      <span
        aria-hidden="true"
        className="absolute bottom-4 left-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 text-[0.9375rem] font-semibold text-white transition-colors group-hover:bg-accent-ink"
      >
        {/* In the corner, so it does not cover the name in the middle of the poster frame. */}
        <Play size={16} fill="currentColor" />
        Play intro
      </span>
    </a>
  )
}
