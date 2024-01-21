"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Link, PlayCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import socket from "@/service/socket";

export default function RoomCustomization() {
  const router = useRouter();

  const userId = localStorage.getItem("userId");
  const roomId = localStorage.getItem("roomId");

  const [roomData, setRoomData] = useState<any>({});
  const [questionNb, setQuestionNb] = useState<number>(10);
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    socket.emit("get_room_data", { roomId: roomId });
    socket.on("room_data", ({ roomData }) => {
      setRoomData(roomData);
      setQuestionNb(roomData.questionsNb);
      setCollections(roomData.playlistSelection);
    });

    //when the host decides to start the game, redirect the user to the game page
    socket.on("load_game", () => {
      router.replace("/game");
    });
  }, []);

  const setQuestionNumber = (number: string) => {
    let questionNumber: number = parseInt(number);
    setQuestionNb(questionNumber);
    socket.emit("set_questionsNb", {
      userId: userId,
      roomId: roomId,
      questionsNb: questionNumber,
    });
  };

  const switchCollection = (collectionName: string) => {
    //find the collection in the array
    let collection = collections.find(
      (collection) => collection.name === collectionName
    );
    //toggle the switch
    collection!.active = !collection!.active;
    //update the state
    setCollections(collections);
    //emit the change
    socket.emit("playlists_change", {
      userId: userId,
      roomId: roomId,
      playlists: collections,
    });
  };

  const inviteLink = () => {
    let url = `http://localhost:3000/?game=${roomId}`;
    navigator.clipboard.writeText(url);
    toast("Lien copié dans le presse-papier");
  };

  const startGame = () => {
    socket.emit("start_game", { roomId: roomId, userId: userId });
  };

  return (
    <Card className="w-[800px]">
      <CardHeader>
        <CardTitle>Personnaliser la partie</CardTitle>
        <CardDescription>Changez les paramètres de la partie.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-sm mb-2">Nombre de questions</h3>
            <Select
              defaultValue="10"
              value={questionNb.toString()}
              onValueChange={(value) => setQuestionNumber(value)}
              disabled={userId !== roomData.hostId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Nombre de questions" />
              </SelectTrigger>
              <SelectContent>
                {/* for test purpose */}
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="30">30</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-2">
              Collections de questions
            </h3>
            <ScrollArea className="h-72 w-full rounded-md border">
              <div className="p-4 space-y-4">
                {collections.map((collection) => {
                  return (
                    <div
                      className="flex justify-between w-full rounded-sm p-4"
                      key={collection.name}
                    >
                      <div>
                        <h4 className="text-sm font-semibold mb-1">
                          {collection.name}
                        </h4>
                        {/* <p className="text-xs text-gray-400">
                          {collection.questionNb} questions
                        </p> */}
                      </div>
                      <Switch
                        checked={collection.active}
                        onCheckedChange={() =>
                          switchCollection(collection.name)
                        }
                        disabled={userId !== roomData.hostId}
                      />
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="space-x-6">
          <Button onClick={inviteLink} disabled={userId !== roomData.hostId}>
            <Link className="mr-2 h-4 w-4" /> Inviter
          </Button>
          <Button onClick={startGame} disabled={userId !== roomData.hostId}>
            <PlayCircle className="mr-2 h-4 w-4" /> Démarrer
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
