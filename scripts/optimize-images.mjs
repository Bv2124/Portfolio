// Writes WebP copies of the site's photos and project screenshots at two widths each, next to
// the JPEG originals: public/profile.jpg -> profile-400.webp and profile-800.webp.
// Usage: npm run images   (also runs at the end of npm run shots:projects)
// The widths must match IMAGE_WIDTHS in src/lib/images.ts; a unit test checks every file exists.
import { readdirSync, statSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const pub = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'public')

const jobs = [
  { file: 'profile.jpg', widths: [400, 800] },
  { file: 'about/cycling.jpg', widths: [600, 1200] },
  ...readdirSync(resolve(pub, 'projects'))
    .filter(name => name.endsWith('.jpg'))
    .map(name => ({ file: `projects/${name}`, widths: [640, 1280] })),
]

for (const { file, widths } of jobs) {
  const source = resolve(pub, file)
  const sizes = []
  for (const width of widths) {
    const target = source.replace(/\.jpg$/, `-${width}.webp`)
    await sharp(source).resize({ width, withoutEnlargement: true }).webp({ quality: 72 }).toFile(target)
    sizes.push(`${width}w ${Math.round(statSync(target).size / 1000)} kB`)
  }
  console.log(`${file}  (${Math.round(statSync(source).size / 1000)} kB JPEG)  ->  ${sizes.join(', ')}`)
}
