import Error from "@/app/error";
import RoomForm from "@/components/admin/rooms/RoomForm";

const getRoom = async (id: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rooms/${id}`, { cache: "no-cache" });
  return res.json();
};

interface Props { params: Promise<{ id: string }> }

export default async function EditRoomPage({ params }: Props) {
  const { id } = await params;
  const data = await getRoom(id);
  if (data?.errMessage) return <Error error={data} />;
  return <RoomForm room={data?.room} />;
}