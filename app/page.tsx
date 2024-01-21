import RoomSelector from "@/components/room/room-selector";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <RoomSelector />
    </main>
  );
}
