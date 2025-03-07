import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Inv from './Inv.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    {/* <Inv/> */}
  </StrictMode>,
)
