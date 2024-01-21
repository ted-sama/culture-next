interface Collection {
  name: string;
  questionNb: number;
  active: boolean;
}

interface Player {
  userId: string;
  name: string;
  avatar: string;
  color: string;
  answers: any[];
}

interface Room {
  roomId: string;
  hostId: string;
  players: [Player];
  maxPlayers: number;
  playlistSelection: [Collection];
  questions: any[];
  currentQuestion: number;
  currentCorrection: number;
  questionNb: number;
  started: boolean;
}

interface Question {
  question: string;
  answer: string;
  file: string;
  difficulty: "Facile" | "Moyen" | "Difficile";
  theme: string;
}

interface Answer {
  userId: string;
  name: string;
  color: string;
  avatar: string;
  answer: string;
  value: boolean;
}
