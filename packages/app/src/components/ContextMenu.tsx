import { css } from '@emotion/react'
import { type IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useRef } from 'react'

export type MenuEntry = {
  id: string
  icon: IconProp
  label: string
  onClick: () => void
}

type Props = {
  show: boolean
  x: number
  y: number
  entries: MenuEntry[]
  onCancel: () => void
  container: HTMLElement | null
}

export function ContextMenu({
  show,
  x,
  y,
  entries,
  onCancel,
  container = null,
}: Props) {
  const modalRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = (e: KeyboardEvent) => {
    console.log(e)
    if (e.key === 'Escape') {
      onCancel()
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  })

  // メニューをコンテナ要素内に収める
  const adjustPosition = (modal: HTMLElement, container: HTMLElement) => {
    const modalRect = modal.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()

    const newX =
      x + modalRect.width > containerRect.right
        ? containerRect.right - modalRect.width
        : x

    return {
      x: newX,
    }
  }

  if (modalRef.current != null && container != null) {
    const { x: newX } = adjustPosition(modalRef.current, container)
    x = newX
  }

  const modalVisibleStyle = css({
    opacity: show ? 1 : 0,
    pointerEvents: show ? 'auto' : 'none',
    transition: '0.5s all ease',
  })

  const modalMaskStyle = css({
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    zIndex: 1000,
  })

  const modalStyle = css({
    position: 'absolute',
    top: y,
    left: x,
    backgroundColor: 'var(--app-editor-background)',
    color: 'var(--app-editor-foreground)',
    border: '1px solid black',
    borderRadius: '5px',
    '& ul': {
      display: 'block',
    },
    '& li': {
      display: 'block',
      cursor: 'pointer',
      width: '100%',
      height: '100%',
      padding: '5px 10px',
    },
    '& a': {
      display: 'flex',
      textDecoration: 'none',
      fontSize: '0.75rem',
    },
    zIndex: 1001,
  })

  return (
    <div css={modalVisibleStyle}>
      <div css={modalMaskStyle} onClick={onCancel}></div>
      <div css={modalStyle} ref={modalRef}>
        <ul>
          {entries.map((entry) => {
            return (
              <li key={entry.id}>
                <a
                  onClick={() => {
                    entry.onClick()
                    onCancel()
                  }}
                >
                  {entry.icon != null ? (
                    <FontAwesomeIcon icon={entry.icon} />
                  ) : (
                    ''
                  )}
                  {entry.label}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
