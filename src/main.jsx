import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { ExplorerProvider } from './leaderboard/ExplorerContext.jsx'
import { PrivacyProvider } from './privacy/PrivacyContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <PrivacyProvider>
        <ExplorerProvider>
          <App />
        </ExplorerProvider>
      </PrivacyProvider>
    </BrowserRouter>
  </StrictMode>,
)
