import './globals.css'
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
      </head>
      <body className="overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}

// ✅ Fixed: Removed viewport from metadata
export const metadata = {
  title: 'Vigneshwaran B - React Native Developer',
  description:
    'Passionate React & React Native Developer specializing in offline-first, high-performance mobile apps. 2+ years experience building scalable architecture.',
  keywords: 'React Native, Redux, Mobile Developer, Offline-first, SQLite, Firebase, Coimbatore',
  author: 'Vigneshwaran B',
}

// ✅ Added: Separate viewport export
export const viewport = {
  width: 'device-width',
  initialScale: 1,
}