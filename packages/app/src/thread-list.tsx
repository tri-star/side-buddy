import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThreadList } from './panels/thread-list/ThreadList'
import './thread-list.css'
import { ExtensionBridgeProvider } from './providers/ExtensionBridgeStubProvider'
import { isVsCodeEnv } from './api/extension/vs-code-api'
import { ThreadListExtensionStub } from './api/extension/extension-stub/thread-list-extension-stub'

let extensionStub

if (!isVsCodeEnv()) {
  extensionStub = new ThreadListExtensionStub()
  void extensionStub.start()
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ExtensionBridgeProvider extensionStubImpl={extensionStub}>
      <ThreadList />
    </ExtensionBridgeProvider>
  </React.StrictMode>
)
