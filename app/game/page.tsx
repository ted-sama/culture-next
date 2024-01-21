"use client";

import Trivia from "@/components/game/trivia";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import socket from "@/service/socket";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Game() {
  const router = useRouter();

  const userId = localStorage.getItem("userId");
  const roomId = localStorage.getItem("roomId");
  const maxTimer: number = 30;

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
  const [answer, setAnswer] = useState<string>("");
  const [timer, setTimer] = useState<number>(30);

  useEffect(() => {
    socket.emit("next_question", { roomId: roomId, userId: userId });

    socket.on("new_question", ({ question }) => {
      setCurrentQuestion(question);
    });

    socket.on("timer", ({ timer }) => {
      setTimer(timer);
    });

    socket.on("correction_mode", () => {
      router.replace("/correction");
    });
  }, []);

  useEffect(() => {
    if (timer === 0) {
      sendAnswer();
      socket.emit("next_question", { roomId: roomId, userId: userId });
      setTimer(maxTimer);
    }
  }, [timer]);

  const sendAnswer = () => {
    socket.emit("send_answer", {
      roomId: roomId,
      userId: userId,
      answer: answer,
    });
    setAnswer("");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Progress value={timer} className="w-[800px] h-2 mb-5" />
      {currentQuestion && <Trivia question={currentQuestion} />}
      <Input
        value={answer}
        placeholder="Votre réponse ?"
        onChange={(e) => setAnswer(e.target.value)}
        className="w-[800px] h-12 mt-32"
      />
    </main>
  );
}
