import { type MenuEntry } from '@/components/ContextMenu'
import { type MouseEvent as ReactMouseEvent, useState } from 'react'

export function useContextMenu() {
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const [show, setShow] = useState(false)
  const [entries, setEntries] = useState<MenuEntry[]>([])
  const [container, setContainer] = useState<HTMLElement | null>(null)

  const showMenu = (
    event: ReactMouseEvent<HTMLElement, MouseEvent>,
    entries: MenuEntry[],
    container: HTMLElement | null
  ) => {
    event.preventDefault()

    const parentRect = container?.getBoundingClientRect()

    setX(event.clientX)
    setY(event.clientY - ((parentRect?.top ?? 0) + (container?.scrollTop ?? 0)))
    setEntries(entries)
    setShow(true)
    setContainer(container)
  }

  const closeMenu = () => {
    setShow(false)
  }

  return {
    props: {
      x,
      y,
      entries,
      show,
      container,
    },
    showMenu,
    closeMenu,
  }
}
