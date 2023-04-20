import { listenExtensionMessage } from '@/api/vs-code/listen-extension-message'
import { sendPanelMessage } from '@/api/vs-code/send-panel-message'
import { type ExtensionMessage } from '@/domain/extension-message'
import { type Thread } from '@/domain/thread'
import {
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  useEffect,
  useState,
  useRef,
} from 'react'
import { ThreadListItem } from './ThreadListItem'
import { ContextMenu } from '@/components/ContextMenu'
import { useContextMenu } from '@/hooks/use-context-menu'
import { faTrash, faUpload } from '@fortawesome/free-solid-svg-icons'

export function ThreadList(): ReactElement {
  const containerRef = useRef(null)
  const [threads, setThreads] = useState<Thread[]>([])
  const contextMenu = useContextMenu()

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

  const handleRightClick = (
    e: ReactMouseEvent<HTMLElement, MouseEvent>,
    threadId: string
  ) => {
    const menues = [
      {
        id: 'open',
        icon: faUpload,
        title: 'load',
        onClick: () => {
          sendPanelMessage({
            type: 'load-thread',
            source: 'side-buddy-panel',
            threadId,
          })
        },
      },
      {
        id: 'remove',
        icon: faTrash,
        title: 'remove',
        onClick: () => {
          sendPanelMessage({
            type: 'remove-thread',
            source: 'side-buddy-panel',
            threadId,
          })
        },
      },
    ]

    contextMenu.showMenu(e, menues, containerRef.current)
  }
  const handleCancel = () => {
    contextMenu.closeMenu()
  }

  return (
    <div ref={containerRef}>
      {threads.map((thread) => {
        return (
          <ThreadListItem
            thread={thread}
            handleClick={handleClick}
            handleRightClick={(e, threadId) => {
              handleRightClick(e, threadId)
            }}
            key={thread.id}
          />
        )
      })}
      <ContextMenu {...contextMenu.props} onCancel={handleCancel} />
    </div>
  )
}
