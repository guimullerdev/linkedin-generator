import { useEffect, useRef } from 'react'

export function useScrollToRef<T extends HTMLElement>(trigger: unknown) {
    const ref = useRef<T>(null)

    useEffect(() => {
        if (!trigger) return

        const timeout = setTimeout(() => {
            ref.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            })
        }, 80)

        return () => clearTimeout(timeout)
    }, [trigger])

    return ref
}
