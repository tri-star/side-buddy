import { type Thread } from '@/domain/thread'
import { css } from '@emotion/react'
import { faBook } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type Props = {
  thread: Thread
  handleClick: (threadId: string) => void
}

export function ThreadListItem({ thread, handleClick }: Props) {
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

  return (
    <a
      key={thread.id}
      css={lineStyle}
      href="void"
      tabIndex={0}
      onClick={() => {
        handleClick(thread.id)
      }}
    >
      <FontAwesomeIcon icon={faBook} />
      <p title={thread.title}>{thread.title}</p>
    </a>
  )
}
