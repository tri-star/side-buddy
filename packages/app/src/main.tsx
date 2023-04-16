import React from 'react'
import ReactDOM from 'react-dom/client'
import Sidebar from './panels/sidebar/Sidebar'
import './index.css'
import { isVsCodeEnv } from './api/vs-code/vs-code-api'
import { startExtensionStub } from './api/vs-code/extension-stub'
import { SidebarStateProvider } from './panels/sidebar/SidebarStateProvider'

if(!isVsCodeEnv()) {
  void startExtensionStub()
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <SidebarStateProvider>
      <Sidebar />
    </SidebarStateProvider>
  </React.StrictMode>,
)
