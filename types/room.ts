import { IRoom } from "@/backend/models/room";

export interface RoomWithDistance extends IRoom {
  distanceKm?: number;
}
