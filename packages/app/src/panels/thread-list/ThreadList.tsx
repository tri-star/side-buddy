import type { ExtensionMessage } from '@/domain/extension-message'
import type { Thread } from '@/domain/thread'
import {
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  useEffect,
  useState,
  useRef,
  useContext,
} from 'react'
import { ThreadListItem } from './ThreadListItem'
import { ContextMenu } from '@/components/ContextMenu'
import { useContextMenu } from '@/hooks/use-context-menu'
import { faTrash, faUpload } from '@fortawesome/free-solid-svg-icons'
import { ExtensionBridgeContext } from '@/providers/ExtensionBridgeStubProvider'

export function ThreadList(): ReactElement {
  const containerRef = useRef(null)
  const [threads, setThreads] = useState<Thread[]>([])
  const contextMenu = useContextMenu()
  const { extensionBridge } = useContext(ExtensionBridgeContext)

  useEffect(() => {
    extensionBridge?.listenExtensionMessage((message: ExtensionMessage) => {
      switch (message.type) {
        case 'update-thread-list':
          setThreads(message.threads)
          break
        case 'load-thread':
        case 'updateConfig':
          break
      }
    })
    extensionBridge?.sendPanelMessage({
      type: 'loaded',
      source: 'side-buddy-panel',
    })
  }, [extensionBridge])

  const handleClick = (threadId: string) => {
    extensionBridge?.sendPanelMessage({
      type: 'load-thread',
      source: 'side-buddy-panel',
      threadId,
    })
  }

  const handleRightClick = (
    e: ReactMouseEvent<HTMLElement>,
    threadId: string
  ) => {
    const menues = [
      {
        id: 'open',
        icon: faUpload,
        title: 'load',
        onClick: () => {
          extensionBridge?.sendPanelMessage({
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
          extensionBridge?.sendPanelMessage({
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
      {threads.map((thread) => (
        <ThreadListItem
          thread={thread}
          handleClick={handleClick}
          handleRightClick={(e, threadId) => {
            handleRightClick(e, threadId)
          }}
          key={thread.id}
        />
      ))}
      <ContextMenu {...contextMenu.props} onCancel={handleCancel} />
    </div>
  )
}
