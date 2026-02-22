import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function LoadingCard() {
    return (
        <Card className="w-full">
            <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start gap-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-5 w-3/4 mt-2" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <Skeleton className="h-3 w-full mt-2" />
                <Skeleton className="h-3 w-4/5 mt-1" />
            </CardContent>
        </Card>
    );
}

export function EmptyState({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-lg bg-slate-50 border-slate-200">
            <p className="text-slate-500 text-sm">{message}</p>
        </div>
    );
}
