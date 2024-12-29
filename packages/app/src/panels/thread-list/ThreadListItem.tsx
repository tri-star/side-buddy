import type { Thread } from '@/domain/thread'
import { css } from '@emotion/react'
import { faBook } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { type MouseEvent as ReactMouseEvent, useRef } from 'react'

type Props = {
  thread: Thread
  handleClick: (threadId: string) => void
  handleRightClick: (e: ReactMouseEvent<HTMLElement>, threadId: string) => void
}

export function ThreadListItem({
  thread,
  handleClick,
  handleRightClick,
}: Props) {
  const menuRef = useRef<HTMLDivElement>(null)

  const lineStyle = css({
    display: 'flex',
    cursor: 'pointer',
    justifyContent: 'start',
    alignItems: 'center',
    padding: '5px 2px',
    gap: '5px,',
    width: '100%',
    color: 'var(--app-editor-foreground)',
    '& > svg': {
      marginLeft: '5px',
    },
    '& > p': {
      flexGrow: 1,
      overflow: 'hidden',
      textOverflow: 'elipsis',
      whiteSpace: 'nowrap',
      marginLeft: '5px',
      width: '100%',
    },
    '&:hover': {
      color: 'var(--app-editor-foreground)',
      backgroundColor: 'var(--app-list-hoverBackground)',
      transition: '0.3s all ease',
    },
    '&:focus': {
      outline: '1ps dashed var(--app-editor-focus-outline)',
    },
  })

  const handleContextMenu = (e: ReactMouseEvent<HTMLElement>) => {
    handleRightClick(e, thread.id)
  }

  return (
    <div
      key={thread.id}
      css={lineStyle}
      onClick={(e) => {
        handleClick(thread.id)
      }}
      onContextMenu={(e) => {
        handleContextMenu(e)
        e.preventDefault()
      }}
    >
      <FontAwesomeIcon icon={faBook} />
      <p ref={menuRef} title={thread.title}>
        {thread.title}
      </p>
    </div>
  )
}
