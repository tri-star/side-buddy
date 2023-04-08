import React from 'react'
import ReactDOM from 'react-dom/client'
import Sidebar from './panels/sidebar/Sidebar'
import './index.css'
import { listenExtensionMessage } from './api/vs-code/vs-code-api'
import { handleExtensionMessage } from './service/extension-message-handler'
import { sendPanelMessage } from './api/vs-code/send-panel-message'

listenExtensionMessage(handleExtensionMessage)
sendPanelMessage({ type: 'loaded' })

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Sidebar />
  </React.StrictMode>,
)
