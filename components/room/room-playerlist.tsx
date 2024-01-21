"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { useEffect, useState } from "react";
import socket from "@/service/socket";
import Image from "next/image";
import { Crown } from "lucide-react";

export default function RoomPlayerlist() {
  const userId = localStorage.getItem("userId");
  const roomId = localStorage.getItem("roomId");
  const [roomData, setRoomData] = useState<any>({});
  const [playersNb, setPlayersNb] = useState<number>(0);
  const [playersData, setPlayersData] = useState<Player[]>([]);

  useEffect(() => {
    socket.emit("get_room_data", { roomId: roomId });
    socket.on("room_data", ({ roomData }) => {
      setRoomData(roomData);
      setPlayersNb(Object.keys(roomData.players).length);

      //put each player in an array
      let playersData: Player[] = [];
      Object.keys(roomData.players).map((playerId) => {
        playersData.push(roomData.players[playerId]);
      });
      setPlayersData(playersData);
    });
  }, []);

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>
          Joueurs {playersNb}/{roomData.maxPlayers}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-full w-full">
          <div className="flex flex-col space-y-4">
            {playersData.map((player) => (
              <div
                key={player.userId}
                className="flex items-center space-x-4 justify-between"
              >
                <div className="flex items-center space-x-4">
                  <Image
                    src={player.avatar}
                    width={62}
                    height={62}
                    alt="avatar"
                    className="rounded-sm"
                  />
                  <span className="text-lg font-semibold">{player.name}</span>
                </div>
                {player.userId === roomData.hostId && (
                  <Crown className="text-yellow-500 w-6 h-6" />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
