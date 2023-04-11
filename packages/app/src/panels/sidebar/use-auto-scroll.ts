import { useEffect, useRef, type RefObject } from 'react'

export function useAutoScroll<T extends HTMLElement, U extends HTMLElement>(
  componentRef: RefObject<T | undefined>,
  watchComponentRef: RefObject<U | undefined>
) {
  const observerRef = useRef<ResizeObserver | null>(null)
  useEffect(() => {
    const component = componentRef?.current
    const watchComponent = watchComponentRef?.current

    const observer = new ResizeObserver(() => {
      if (component != null) {
        component.scrollTop = component.scrollHeight
      }
    })

    observerRef.current = observer
    if (watchComponent != null) {
      observer.observe(watchComponent)
    }
    return () => {
      observer.disconnect()
    }
  }, [componentRef, watchComponentRef])
}
