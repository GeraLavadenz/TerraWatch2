// app/ThemeProvider.jsx
'use client'

import { useEffect, useState } from 'react'

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('system')
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'system'
    setTheme(savedTheme)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (theme === 'system') {
      root.classList.toggle('dark', systemDark)
      localStorage.removeItem('theme')
    } else {
      root.classList.toggle('dark', theme === 'dark')
      localStorage.setItem('theme', theme)
    }
  }, [theme])

  return (
    <>
      {children}
      <button 
        onClick={() => setTheme(prev => 
          prev === 'dark' ? 'light' : prev === 'light' ? 'system' : 'dark'
        )}
        className="fixed bottom-4 right-4 p-3 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-all"
      >
        {theme === 'dark' ? '🌙' : theme === 'light' ? '☀️' : '🌓'}
      </button>
    </>
  )
}
