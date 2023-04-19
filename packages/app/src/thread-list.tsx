import React from 'react'
import ReactDOM from 'react-dom/client'
import { isVsCodeEnv } from './api/vs-code/vs-code-api'
import { startExtensionStubThreadList } from './api/vs-code/extension-stub-thread-list'
import { ThreadList } from './panels/thread-list/ThreadList'
import './thread-list.css'

if (!isVsCodeEnv()) {
  void startExtensionStubThreadList()
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThreadList />
  </React.StrictMode>
)
