import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { ReactNode } from 'react'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'ASSAB - Powering the Future of Connectivity & Energy',
    template: '%s | ASSAB'
  },
  description: 'ASSAB provides advanced Telecommunication Infrastructure, Energy Systems, and Engineering Solutions. Powering smart connectivity and sustainable energy across industries in Africa and beyond.',
  keywords: ['telecom', 'energy solutions', 'telecommunications', 'infrastructure', 'solar power', 'network deployment', 'engineering', 'connectivity', 'sustainable energy'],
  authors: [{ name: 'ASSAB' }],
  creator: 'ASSAB',
  publisher: 'ASSAB',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://assab.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en': '/en',
      'fr': '/fr',
      'ar': '/ar'
    }
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://assab.com',
    title: 'ASSAB - Powering the Future of Connectivity & Energy',
    description: 'Advanced Telecommunication Infrastructure, Energy Systems, and Engineering Solutions for smart connectivity and sustainable energy.',
    siteName: 'ASSAB',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ASSAB - Telecom & Energy Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ASSAB - Powering the Future of Connectivity & Energy',
    description: 'Advanced Telecommunication Infrastructure, Energy Systems, and Engineering Solutions for smart connectivity and sustainable energy.',
    images: ['/images/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return children;
}
