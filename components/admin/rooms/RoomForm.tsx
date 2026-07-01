"use client";
import {
  useAdminCreateRoomMutation,
  useAdminUpdateRoomMutation,
} from "@/redux/api/roomApi";
import {
  useAdminUploadRoomImagesMutation,
  useAdminDeleteRoomImageMutation,
} from "@/redux/api/adminApi";
import { useRouter } from "next/navigation";
import { FormEvent, useRef, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
interface Props {
  room?: any;
}
const defaultState = {
  name: "",
  description: "",
  pricePerNight: "",
  address: "",
  guestCapacity: "",
  numOfBeds: "",
  category: "Single",
  isInternet: false,
  isBreakfast: false,
  isAirConditioned: false,
  isPetsAllowed: false,
  isRoomCleaning: false,
};
const RoomForm = ({ room }: Props) => {
  const isEditing = !!room;
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState(
    isEditing
      ? {
          name: room.name,
          description: room.description,
          pricePerNight: room.pricePerNight,
          address: room.address,
          guestCapacity: room.guestCapacity,
          numOfBeds: room.numOfBeds,
          category: room.category,
          isInternet: room.isInternet,
          isBreakfast: room.isBreakfast,
          isAirConditioned: room.isAirConditioned,
          isPetsAllowed: room.isPetsAllowed,
          isRoomCleaning: room.isRoomCleaning,
        }
      : defaultState
  );
  // Image state: existing (from DB) + newly selected previews
  const [existingImages, setExistingImages] = useState<Array<{ public_id: string; url: string }>>(
    room?.images || []
  );
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [imageError, setImageError] = useState("");
  const [createRoom, { isLoading: creating }] = useAdminCreateRoomMutation();
  const [updateRoom, { isLoading: updating }] = useAdminUpdateRoomMutation();
  const [uploadImages, { isLoading: uploading }] = useAdminUploadRoomImagesMutation();
  const [deleteImage, { isLoading: deletingImg }] = useAdminDeleteRoomImageMutation();
  const isSaving = creating || updating;
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    setForm((prev) => ({
      ...prev,
      [target.name]: target.type === "checkbox" ? target.checked : target.value,
    }));
  };
  // Convert selected files to base64 data URIs
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageError("");
    if (files.length + existingImages.length + newImagePreviews.length > 10) {
      setImageError("Maximum 10 images allowed per room.");
      return;
    }
    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        setImageError("Only image files are allowed.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setNewImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
    // Reset input so same file can be re-selected if needed
    e.target.value = "";
  };
  const removeNewPreview = (idx: number) => {
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };
  // Delete an existing image (stored in DB + Cloudinary)
  const handleDeleteExisting = async (publicId: string) => {
    if (!room?._id) return;
    const res = await deleteImage({ roomId: room._id, public_id: publicId });
    if ("data" in res) {
      setExistingImages((prev) => prev.filter((img) => img.public_id !== publicId));
      toast.success("Image removed");
    } else {
      toast.error("Failed to remove image");
    }
  };
  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    const res = isEditing
      ? await updateRoom({ id: room._id, body: form })
      : await createRoom(form);
    if (!("data" in res)) {
      toast.error("Failed to save room");
      return;
    }
    const savedRoomId = (res.data as any)?.room?._id;
    // Upload any newly selected images
    if (newImagePreviews.length > 0 && savedRoomId) {
      const uploadRes = await uploadImages({
        roomId: savedRoomId,
        images: newImagePreviews,
      });
      if ("error" in uploadRes) {
        toast.error("Room saved, but image upload failed. You can re-upload from Edit.");
      }
    }
    toast.success(isEditing ? "Room updated!" : "Room created!");
    router.push("/admin/rooms");
  };
  const textInput = (label: string, name: string, type = "text") => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={(form as any)[name]}
        onChange={handleChange}
        disabled={isSaving}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-400 disabled:bg-gray-100 text-sm"
      />
    </div>
  );
  const checkInput = (label: string, name: string) => (
    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
      <input
        type="checkbox"
        name={name}
        checked={(form as any)[name]}
        onChange={handleChange}
        className="w-4 h-4 rounded accent-rose-600"
      />
      {label}
    </label>
  );
  return (
    <form onSubmit={submitHandler} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-2xl space-y-5">
      <h1 className="text-2xl font-bold text-gray-900">
        {isEditing ? "Edit Room" : "New Room"}
      </h1>
      {/* Basic fields */}
      {textInput("Room Name", "name")}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          disabled={isSaving}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-400 disabled:bg-gray-100 text-sm resize-none"
        />
      </div>
      {textInput("Price Per Night ($)", "pricePerNight", "number")}
      {textInput("Address", "address")}
      <div className="grid grid-cols-2 gap-4">
        {textInput("Guest Capacity", "guestCapacity", "number")}
        {textInput("Number of Beds", "numOfBeds", "number")}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
         name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
        >
          {["King", "Single", "Twins"].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      {/* Amenities */}
      <div>
        <p className="block text-sm font-medium text-gray-700 mb-2">Amenities</p>
        <div className="grid grid-cols-2 gap-3 bg-gray-50 rounded-xl p-4">
          {checkInput("Internet / Wi-Fi", "isInternet")}
          {checkInput("Breakfast Included", "isBreakfast")}
          {checkInput("Air Conditioned", "isAirConditioned")}
          {checkInput("Pets Allowed", "isPetsAllowed")}
          {checkInput("Daily Room Cleaning", "isRoomCleaning")}
        </div>
      </div>
      {/* ── Image Upload Section ── */}
      <div>
        <p className="block text-sm font-medium text-gray-700 mb-2">
          Room Images
          <span className="text-xs text-gray-400 ml-1">(max 10 total)</span>
        </p>
        {/* Existing images grid */}
        {existingImages.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
            {existingImages.map((img) => (
              <div key={img.public_id} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-video">
                <Image
                  src={img.url}
                  alt="Room image"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteExisting(img.public_id)}
                  disabled={deletingImg}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white text-xs rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        {/* New image previews */}
        {newImagePreviews.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
            {newImagePreviews.map((src, idx) => (
              <div key={idx} className="relative group rounded-lg overflow-hidden border-2 border-dashed border-rose-300 aspect-video">
                <Image
                  src={src}
                  alt={`Preview ${idx + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeNewPreview(idx)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white text-xs rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
                <div className="absolute bottom-1 left-1 bg-rose-600 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                  NEW
                </div>
              </div>
            ))}
          </div>
        )}
        {/* File picker drop zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-rose-400 hover:bg-rose-50 transition-colors"
        >
          <div className="text-3xl mb-2">📸</div>
          <p className="text-sm font-medium text-gray-700">Click to select images</p>
          <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP accepted</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        {imageError && (
          <p className="mt-2 text-sm text-red-600">{imageError}</p>
        )}
      </div>
      <button
       type="submit"
        disabled={isSaving || uploading}
        className="w-full py-2.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
      >
                {isSaving || uploading
          ? uploading
            ? "Uploading images..."
            : "Saving..."
          : isEditing
          ? "Update Room"
          : "Create Room"}
      </button>
    </form>
  );
};
export default RoomForm;