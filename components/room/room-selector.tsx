"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import socket from "@/service/socket";

interface Avatar {
  path: string;
  color: string;
}

export default function RoomSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [previousAvatar, setPreviousAvatar] = useState<Avatar | null>(null);
  const [currentAvatar, setCurrentAvatar] = useState<Avatar | null>(null);
  const [username, setUsername] = useState<string>("");

  const game = searchParams.get("game");

  useEffect(() => {
    changeAvatar();
  }, []);

  const avatars: Avatar[] = [
    { path: "/assets/avatar/1.png", color: "#d02c2c" },
    { path: "/assets/avatar/2.png", color: "#ff8000" },
    { path: "/assets/avatar/3.png", color: "#000000" },
    { path: "/assets/avatar/4.png", color: "#00a2e8" },
    { path: "/assets/avatar/5.png", color: "#7f7f7f" },
    { path: "/assets/avatar/6.png", color: "#b861b8" },
    { path: "/assets/avatar/7.png", color: "#ef3a44" },
    { path: "/assets/avatar/8.png", color: "#22b14c" },
    { path: "/assets/avatar/9.png", color: "#ffc90e" },
    { path: "/assets/avatar/10.png", color: "#4f76ac" },
    { path: "/assets/avatar/11.png", color: "#682f68" },
    { path: "/assets/avatar/12.png", color: "#36da67" },
  ];

  const changeAvatar = () => {
    console.log("change avatar");
    let random = Math.floor(Math.random() * avatars.length);
    let selectedAvatar = avatars[random];

    // Check if the selected avatar is the same as the previous one
    if (selectedAvatar.path === previousAvatar?.path) {
      // If it is, select a new random avatar
      changeAvatar();
    }

    console.log(selectedAvatar);
    setPreviousAvatar(currentAvatar);
    setCurrentAvatar(selectedAvatar);
  };

  const connectToRoom = () => {
    if (username === "") {
      toast.error("Veuillez choisir un nom d'utilisateur");
      return;
    }

    socket.auth = {
      username: username,
      avatar: currentAvatar?.path,
      color: currentAvatar?.color,
    };
    socket.connect();

    if (game === null) {
      socket.emit("create_room");
      socket.on("session", ({ userId, roomId }) => {
        localStorage.setItem("userId", userId);
        localStorage.setItem("roomId", roomId);
      });
      router.replace("/room");

      console.log("Room created successfully !");
    } else {
      socket.emit("join_room", { roomId: game });
      socket.on("session", ({ userId, roomId }) => {
        localStorage.setItem("userId", userId);
        localStorage.setItem("roomId", roomId);
      });
      router.replace("/room");
      console.log("Room joined successfully !");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Créer ou rejoindre une partie</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center mb-16">
          <div className="relative w-[120px] h-[120px]">
            {currentAvatar ? (
              <Image
                src={currentAvatar?.path}
                width={120}
                height={120}
                alt="avatar"
                className="rounded-lg"
              />
            ) : (
              <div className="rounded-lg bg-gray-200 w-[120px] h-[120px]"></div>
            )}
            <button
              className="absolute -bottom-5 -right-5 bg-white p-2 rounded-full cursor-pointer transition-all duration-300 hover:rotate-90"
              onClick={changeAvatar}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-8 h-8 text-[#6d28d9]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            </button>
          </div>
        </div>
        <Input
          value={username}
          placeholder="Pseudo sympa"
          onChange={(e) => setUsername(e.target.value)}
        />
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={connectToRoom}>
          Démarrer une partie
        </Button>
      </CardFooter>
    </Card>
  );
}
