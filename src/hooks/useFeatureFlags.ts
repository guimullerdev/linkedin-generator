import { useEffect, useState } from 'react'

interface FeatureFlags {
    trendsEnabled: boolean
}

export function useFeatureFlags() {
    const [flags, setFlags] = useState<FeatureFlags>({ trendsEnabled: false })

    useEffect(() => {
        fetch('/api/config/features')
            .then(res => res.json())
            .then(setFlags)
            .catch(() => { }) // fail silently — defaults to disabled
    }, [])

    return flags
}
