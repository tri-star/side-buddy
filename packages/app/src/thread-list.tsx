import React from 'react'
import ReactDOM from 'react-dom/client'
import { isVsCodeEnv } from './api/vs-code/vs-code-api'
import { startExtensionStub } from './api/vs-code/extension-stub'
import { ThreadList } from './panels/thread-list/ThreadList'
import './thread-list.css'

if (!isVsCodeEnv()) {
  void startExtensionStub()
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThreadList />
  </React.StrictMode>
)
