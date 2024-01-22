"use client";

import Trivia from "@/components/game/trivia";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import socket from "@/service/socket";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Check, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Correction() {
  const userId = localStorage.getItem("userId");
  const roomId = localStorage.getItem("roomId");

  // TODO: remove this
  const question1: Question = {
    question: "Complétez le son :",
    answer: "Gros caca mon shit vient de Ketama",
    file: "/assets/questions/140293.mp3",
    difficulty: "Moyen",
    theme: "Musique",
  };

  const question2: Question = {
    question: "Quel est ce son français traduit en anglais :",
    answer: "Bande Organisée - 13'Organisé",
    file: "/assets/questions/182141.jpg",
    difficulty: "Facile",
    theme: "Musique",
  };

  const question3: Question = {
    question: "Qui est ce personnage ?",
    answer: "Rorschach",
    file: "/assets/questions/164213.jpg",
    difficulty: "Difficile",
    theme: "Comics",
  };

  const [currentQuestion, setCurrentQuestion] = useState<Question>();
  const [answers, setAnswers] = useState<[]>([]);
  const [scores, setScores] = useState<{}>({});

  useEffect(() => {
    socket.emit("next_correction", { roomId: roomId, userId: userId });

    socket.on("new_correction", ({ question, answers }) => {
      setCurrentQuestion(question);
      setAnswers(answers);
      console.log(answers);
      setScores({});
    });

    socket.on("new_value", ({ answers }) => {
      setAnswers(answers);
    });
  }, []);

  const nextCorrection = () => {
    socket.emit("send_score", {
      roomId: roomId,
      userId: userId,
      scores: scores,
    });
    socket.emit("next_correction", { roomId: roomId, userId: userId });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      {/* <Trivia question={question2} /> */}
      {currentQuestion && (
        <div className="flex space-x-24">
          <div>
            <Trivia question={currentQuestion} />
            <h2 className="text-2xl text-center mt-8">
              <span className="opacity-70">Réponse: </span>
              {currentQuestion.answer}
            </h2>
          </div>
          <Card className="max-h-full">
            <CardHeader>
              <CardTitle>Corrections</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="flex flex-col space-y-4">
                  {answers.map((answer: Answer) => {
                    return (
                      <Card
                        className="w-96"
                        style={{ backgroundColor: `${answer.color}` }}
                        key={answer.userId}
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">
                            {answer.answer}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center space-x-4 pb-4">
                          <Image
                            src={answer.avatar}
                            width={31}
                            height={31}
                            alt="avatar"
                            className="rounded-sm"
                          />
                          <h3 className="text-sm">{answer.name}</h3>
                        </CardContent>
                        <CardFooter className="space-x-4">
                          <Button variant="outline">
                            <X className="w-4" />
                          </Button>
                          <Button variant="outline">
                            <Check className="w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <Button onClick={nextCorrection}>Suivant</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </main>
  );
}
