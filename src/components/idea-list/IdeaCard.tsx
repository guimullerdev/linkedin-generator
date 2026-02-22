import { Idea } from "@/schemas";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // I'll need to add this

interface IdeaCardProps {
    idea: Idea;
    onSelect: (idea: Idea) => void;
    isSelected?: boolean;
}

const typeMap: Record<Idea['type'], string> = {
    educational: "Educational",
    opinion: "Opinion",
    storytelling: "Storytelling",
    "practical-tip": "Practical Tip",
};

const engagementColorMap: Record<Idea['estimatedEngagement'], string> = {
    low: "bg-gray-500",
    medium: "bg-blue-500",
    high: "bg-green-500",
};

export function IdeaCard({ idea, onSelect, isSelected }: IdeaCardProps) {
    return (
        <Card
            className={`cursor-pointer transition-all hover:border-primary ${isSelected ? 'border-primary ring-1 ring-primary' : ''}`}
            onClick={() => onSelect(idea)}
        >
            <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start gap-2">
                    <Badge variant="secondary" className="text-[10px] uppercase">
                        {typeMap[idea.type]}
                    </Badge>
                    <Badge className={`text-[10px] uppercase ${engagementColorMap[idea.estimatedEngagement]} text-white border-none`}>
                        {idea.estimatedEngagement} Engagement
                    </Badge>
                </div>
                <CardTitle className="text-sm mt-2">{idea.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <CardDescription className="text-xs line-clamp-2">
                    {idea.angle}
                </CardDescription>
            </CardContent>
        </Card>
    );
}
