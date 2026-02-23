import { Idea } from "@/schemas";
import { IdeaCard } from "./IdeaCard";
import { useScrollToRef } from "@/hooks/useScrollToRef";

interface IdeaListProps {
    ideas: Idea[];
    onSelect: (idea: Idea) => void;
    selectedIdea?: Idea | null;
}

export function IdeaList({ ideas, onSelect, selectedIdea }: IdeaListProps) {
    const listRef = useScrollToRef<HTMLDivElement>(ideas.length > 0 ? ideas : null);

    if (ideas.length === 0) return null;

    return (
        <div
            ref={listRef}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 scroll-mt-4 animate-in fade-in duration-200"
        >
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
