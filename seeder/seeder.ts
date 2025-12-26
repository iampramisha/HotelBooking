
import mongoose from 'mongoose';
import { rooms } from './data';
import Room, { IRoom } from "../backend/models/room";

const seedRooms=async()=>{
  try{
await mongoose.connect("mongodb://localhost:27017/bookit-v2")
await (Room as any).deleteMany({});


    console.log("Rooms are deleted");
await Room.insertMany(rooms as any[]);


console.log("rooms are inserted");
process.exit();
  } catch(error){
    console.log(error);
process.exit();
  }
}
seedRooms();