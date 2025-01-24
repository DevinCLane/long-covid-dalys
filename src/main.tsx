import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Detect dark mode.
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  // Update bookmark icon.
  const link = document.head.querySelector('link[rel=icon]') as HTMLLinkElement
  link.href = '/icon-dark.svg'
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
