import { css } from '@emotion/react'
import { useRef } from 'react'

export type MenuEntry = {
  label: string
  onClick: () => void
}

type Props = {
  show: boolean
  x: number
  y: number
  parent?: HTMLElement
  entries: MenuEntry[]
}

export function ContextMenu({ show, x, y, parent, entries }: Props) {
  const modalRef = useRef(null)

  const modalVisibleStyle = css({
    display: show ? 'block' : 'none',
    opacity: show ? 1 : 0,
    transition: '0.5s all ease',
  })

  const modalMaskStyle = css({
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  })

  const modalStyle = css({
    position: 'absolute',
    top: y,
    left: x,
    padding: '10px',
    backgroundColor: 'var(--app-editor-background)',
    color: 'var(--app-editor-foreground)',
    border: '1px solid black',
    borderRadius: '5px',
    '& ul': {
      display: 'block',
    },
    '& li': {
      display: 'block',
    },
    '& a': {
      display: 'flex',
      textDecoration: 'none',
    },
    zIndex: 1001,
  })

  return (
    <div css={modalVisibleStyle}>
      <div css={modalMaskStyle}></div>
      <div css={modalStyle} ref={modalRef}>
        <ul>
          <li>
            <a href="void">DELETE</a>
          </li>
        </ul>
      </div>
    </div>
  )
}
