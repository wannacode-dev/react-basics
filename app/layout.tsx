import React from 'react'
import './globals.css'

export const metadata = {
  title: 'React Задания - Интерактивное обучение',
  description: 'Интерактивные задания по React',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>
        {children}
      </body>
    </html>
  )
} 