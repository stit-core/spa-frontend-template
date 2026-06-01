import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './root'
import { bootstrap } from './init'
import '@/app/styles/index.css'

await bootstrap()

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element #root not found')

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
