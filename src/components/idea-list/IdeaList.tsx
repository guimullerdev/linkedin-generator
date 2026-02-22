import { Idea } from "@/schemas";
import { IdeaCard } from "./IdeaCard";

interface IdeaListProps {
    ideas: Idea[];
    onSelect: (idea: Idea) => void;
    selectedIdea?: Idea | null;
}

export function IdeaList({ ideas, onSelect, selectedIdea }: IdeaListProps) {
    if (ideas.length === 0) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ideas.map((idea, index) => (
                <IdeaCard
                    key={index}
                    idea={idea}
                    onSelect={onSelect}
                    isSelected={selectedIdea?.title === idea.title}
                />
            ))}
        </div>
    );
}
