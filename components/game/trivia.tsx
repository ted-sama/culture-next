import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";

interface TriviaProps {
  question: Question;
}

export default function Trivia({ question }: TriviaProps) {
  const difficultyColors = {
    Facile: "bg-green-500",
    Moyen: "bg-yellow-500",
    Difficile: "bg-red-500",
  };

  const difficultyPoints = {
    Facile: "+1 point",
    Moyen: "+2 points",
    Difficile: "+3 points",
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-16 text-center">
        <h1 className="text-3xl mb-2">{question.question}</h1>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="cursor-default">
              <Badge className={difficultyColors[question.difficulty]}>
                {question.difficulty}
              </Badge>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{difficultyPoints[question.difficulty]}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex w-[800px] h-[400px] justify-center items-center">
        {/* if question.file ends with mp3 or ogg, display audio component */}
        {question.file.endsWith(".mp3") || question.file.endsWith(".ogg") ? (
          <audio controls autoPlay src={question.file}></audio>
        ) : (
          <img
            src={question.file}
            alt="question image"
            fetchPriority="low"
            loading="lazy"
            decoding="async"
            className="max-w-full max-h-full"
          />
        )}
      </div>
    </div>
  );
}
