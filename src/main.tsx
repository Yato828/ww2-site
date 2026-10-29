import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import '@fontsource/cormorant-garamond/cyrillic-400.css'
import '@fontsource/cormorant-garamond/cyrillic-500.css'
import '@fontsource/cormorant-garamond/cyrillic-400-italic.css'
import '@fontsource/cormorant-garamond/latin-400.css'
import '@fontsource/manrope/cyrillic-400.css'
import '@fontsource/manrope/cyrillic-500.css'
import '@fontsource/manrope/cyrillic-600.css'
import '@fontsource/manrope/latin-400.css'
import '@fontsource/manrope/latin-600.css'
import App from './app/App'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <MotionConfig reducedMotion="user"><App /></MotionConfig>
    </BrowserRouter>
  </React.StrictMode>,
)
