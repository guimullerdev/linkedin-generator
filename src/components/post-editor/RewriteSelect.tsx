import { Loader2 } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

const REWRITE_MODES = [
    { value: 'technical', label: 'More technical' },
    { value: 'simple', label: 'Simpler / more accessible' },
    { value: 'shorter', label: 'Shorter' },
    { value: 'storytelling', label: 'More storytelling' },
    { value: 'english', label: 'Translate to English' },
]

interface RewriteSelectProps {
    isRewriting: boolean
    onValueChange: (mode: string) => void
}

export function RewriteSelect({ isRewriting, onValueChange }: RewriteSelectProps) {
    return (
        <div className="flex items-center gap-2">
            {isRewriting && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground animate-in fade-in duration-200">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Rewriting…</span>
                </div>
            )}
            <Select
                onValueChange={onValueChange}
                disabled={isRewriting}
            >
                <SelectTrigger className="w-[180px] h-8 text-xs">
                    <SelectValue placeholder="Rewrite as..." />
                </SelectTrigger>
                <SelectContent>
                    {REWRITE_MODES.map(mode => (
                        <SelectItem key={mode.value} value={mode.value} className="text-xs">
                            {mode.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
