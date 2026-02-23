import { useEffect, useState } from 'react'

export function useRewrittenFlash(trigger: unknown) {
    const [show, setShow] = useState(false)

    useEffect(() => {
        if (!trigger) return
        setShow(true)
        const t = setTimeout(() => setShow(false), 2500)
        return () => clearTimeout(t)
    }, [trigger])

    return show
}
