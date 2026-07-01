import React from "react";
import { IRoom } from "@/backend/models/room";
import {
  Users,
  Bed,
  Wifi,
  Wind,
  PawPrint,
  Sparkles,
  CheckCircle,
  X,
} from "lucide-react";

interface Props {
  room: IRoom;
}

const FeatureItem = ({
  icon: Icon,
  label,
  available,
  showAlways = false,
}: {
  icon: React.ElementType;
  label: string;
  available?: boolean | number;
  showAlways?: boolean;
}) => {
  const isAvailable = showAlways ? true : Boolean(available);

  return (
    <div className="room-feature flex items-center gap-2">
      <div className="relative flex flex-col items-center">
        {!isAvailable && (
          <X className="w-4 h-4 text-red-600 mb-[-6px]" />
        )}
        <Icon
          className={`w-6 h-6 ${isAvailable ? "text-green-500" : "text-red-500"}`}
        />
      </div>
      <p>{label}</p>
    </div>
  );
};

const RoomFeatures = ({ room }: Props) => {
  return (
    <div className="features mt-5">
      <h3 className="mb-4 text-lg font-semibold">Features:</h3>
      <div className="flex flex-col gap-3">
        <FeatureItem
          icon={Users}
          label={`${room?.guestCapacity} Guests`}
          showAlways
        />
        <FeatureItem
          icon={Bed}
          label={`${room?.numOfBeds} Beds`}
          showAlways
        />
        <FeatureItem icon={Wifi} label="Internet" available={room?.isInternet} />
        <FeatureItem
          icon={Wind}
          label="Air Conditioned"
          available={room?.isAirConditioned}
        />
        <FeatureItem
          icon={PawPrint}
          label="Pets Allowed"
          available={room?.isPetsAllowed}
        />
        <FeatureItem
          icon={Sparkles}
          label="Room Cleaning"
          available={room?.isRoomCleaning}
        />
        <FeatureItem
          icon={CheckCircle}
          label="Breakfast"
          available={room?.isBreakfast}
        />
      </div>
    </div>
  );
};

export default RoomFeatures;
