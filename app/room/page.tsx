import RoomPlayerlist from "@/components/room/room-playerlist";
import RoomCustomization from "@/components/room/room-customization";

export default function Room() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Room</h1>
      <div className="flex space-x-24">
        <RoomPlayerlist />
        <RoomCustomization />
      </div>
    </main>
  );
}
