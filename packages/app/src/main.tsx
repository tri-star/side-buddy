import React from 'react'
import ReactDOM from 'react-dom/client'
import Sidebar from './panels/sidebar/Sidebar'
import './index.css'
import { isVsCodeEnv } from './api/extension/vs-code-api'
import { SidebarStateProvider } from './panels/sidebar/SidebarStateProvider'
import { ExtensionBridgeProvider } from './providers/ExtensionBridgeStubProvider'
import { SidebarExtensionStub } from './api/extension/extension-stub/sidebar-extension-stub'

let extensionStub = undefined
if (!isVsCodeEnv()) {
  extensionStub = new SidebarExtensionStub()
  void extensionStub.start()
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ExtensionBridgeProvider extensionStubImpl={extensionStub}>
      <SidebarStateProvider>
        <Sidebar />
      </SidebarStateProvider>
    </ExtensionBridgeProvider>
  </React.StrictMode>
)
