import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MARTAL 2.0',
  description: 'MARTAL — عدسات ملونة كورية',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  )
}
