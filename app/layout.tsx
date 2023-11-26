import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  style: ['normal', 'italic']
})

export const metadata: Metadata = {
  title: 'Age Calculator App',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`bg-offwhite ${poppins.className}`}>
      <main>
        {children}
      </main>
      </body>
    </html>
  )
}
