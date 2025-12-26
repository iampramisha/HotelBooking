import Error from "@/app/error";
import RoomDetails from "@/components/room/roomDetails";
export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>; // 👈 mark as Promise
}

const getRoom = async (id: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rooms/${id}`);
  return res.json();
};

export default async function RoomDetailsPage({ params }: Props) {
  const { id } = await params; // 👈 await params
  const data = await getRoom(id);

  if (data?.errMessage) {
    return <Error error={data} />;
  }

  return <RoomDetails data={data} />;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params; // 👈 await params
  const data = await getRoom(id);

  return {
    title: data?.room?.name || "Room Details",
  };
}
