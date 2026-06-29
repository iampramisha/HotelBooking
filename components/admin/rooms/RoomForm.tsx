"use client";
import { useAdminCreateRoomMutation, useAdminUpdateRoomMutation } from "@/redux/api/roomApi";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

interface Props {
  room?: any;  // pass existing room when editing
}

const defaultState = {
  name: "", description: "", pricePerNight: "", address: "",
  guestCapacity: "", numOfBeds: "", category: "Single",
  isInternet: false, isBreakfast: false, isAirConditioned: false,
  isPetsAllowed: false, isRoomCleaning: false,
};

const RoomForm = ({ room }: Props) => {
  const isEditing = !!room;
  const router = useRouter();

  const [form, setForm] = useState(
    isEditing ? {
      name: room.name, description: room.description,
      pricePerNight: room.pricePerNight, address: room.address,
      guestCapacity: room.guestCapacity, numOfBeds: room.numOfBeds,
      category: room.category, isInternet: room.isInternet,
      isBreakfast: room.isBreakfast, isAirConditioned: room.isAirConditioned,
      isPetsAllowed: room.isPetsAllowed, isRoomCleaning: room.isRoomCleaning,
    } : defaultState
  );

  const [createRoom, { isLoading: creating }] = useAdminCreateRoomMutation();
  const [updateRoom, { isLoading: updating }] = useAdminUpdateRoomMutation();
  const isLoading = creating || updating;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    setForm((prev) => ({
      ...prev,
      [target.name]: target.type === "checkbox" ? target.checked : target.value,
    }));
  };

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    const res = isEditing
      ? await updateRoom({ id: room._id, body: form })
      : await createRoom(form);

    if ("data" in res) {
      toast.success(isEditing ? "Room updated" : "Room created");
      router.push("/admin/rooms");
    } else {
      toast.error("Something went wrong");
    }
  };

  const textInput = (label: string, name: string, type = "text") => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type} name={name}
        value={(form as any)[name]}
        onChange={handleChange}
        disabled={isLoading}
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:bg-gray-100"
      />
    </div>
  );

  const checkInput = (label: string, name: string) => (
    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
      <input
        type="checkbox" name={name}
        checked={(form as any)[name]}
        onChange={handleChange}
        className="w-4 h-4"
      />
      {label}
    </label>
  );

  return (
    <form onSubmit={submitHandler} className="bg-white rounded shadow p-6 max-w-2xl space-y-4">
      <h1 className="text-2xl font-semibold">{isEditing ? "Edit Room" : "New Room"}</h1>

      {textInput("Room Name", "name")}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description" value={form.description} onChange={handleChange}
          rows={3} disabled={isLoading}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:bg-gray-100"
        />
      </div>
      {textInput("Price Per Night", "pricePerNight", "number")}
      {textInput("Address", "address")}
      {textInput("Guest Capacity", "guestCapacity", "number")}
      {textInput("Number of Beds", "numOfBeds", "number")}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          name="category" value={form.category} onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          {["King", "Single", "Twins"].map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        {checkInput("Internet", "isInternet")}
        {checkInput("Breakfast", "isBreakfast")}
        {checkInput("Air Conditioned", "isAirConditioned")}
        {checkInput("Pets Allowed", "isPetsAllowed")}
        {checkInput("Room Cleaning", "isRoomCleaning")}
      </div>

      <button
        type="submit" disabled={isLoading}
        className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-70"
      >
        {isLoading ? "Saving..." : isEditing ? "Update Room" : "Create Room"}
      </button>
    </form>
  );
};

export default RoomForm;