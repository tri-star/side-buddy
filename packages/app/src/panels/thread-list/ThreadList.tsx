import { listenExtensionMessage } from '@/api/vs-code/listen-extension-message'
import { sendPanelMessage } from '@/api/vs-code/send-panel-message'
import { type ExtensionMessage } from '@/domain/extension-message'
import { type Thread } from '@/domain/thread'
import { type ReactElement, useEffect, useState } from 'react'
import { ThreadListItem } from './ThreadListItem'

export function ThreadList(): ReactElement {
  const [threads, setThreads] = useState<Thread[]>([])

  useEffect(() => {
    listenExtensionMessage((message: ExtensionMessage) => {
      switch (message.type) {
        case 'update-thread-list':
          setThreads(message.threads)
          break
      }
    })
    sendPanelMessage({
      type: 'loaded',
      source: 'side-buddy-panel',
    })
  }, [])

  const handleClick = (threadId: string) => {
    sendPanelMessage({
      type: 'load-thread',
      source: 'side-buddy-panel',
      threadId,
    })
  }

  return (
    <div>
      {threads.map((thread) => {
        return (
          <ThreadListItem
            thread={thread}
            handleClick={handleClick}
            key={thread.id}
          />
        )
      })}
    </div>
  )
}
