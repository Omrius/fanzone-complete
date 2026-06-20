import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import OneSignal from 'react-onesignal'
import App from './App'
import './i18n'
import './styles/index.css'

OneSignal.init({
  appId: (import.meta as any).env.VITE_ONESIGNAL_APP_ID || '',
  allowLocalhostAsSecureOrigin: true,
  serviceWorkerParam: { scope: '/' },
  serviceWorkerPath: '/OneSignalSDKWorker.js',
}).catch((e) => console.warn('OneSignal init failed:', e))

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a2e',
            color: '#fff',
            border: '1px solid #333',
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>,
)