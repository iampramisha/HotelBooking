import mongoose,{Document, Types,Schema} from "mongoose";
import { geocodeAddress, locationFromGeocodeResult } from "../utils/geocodeAddress";

export interface IImage {
  alt?: string;
  public_id: string;
  url: string;
}

export interface ILocation {
  type?: string;
  coordinates?: number[];
  formattedAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface IReview {
  user?: Types.ObjectId;
  rating?: number;
  comment?: string;
  createdAt?: Date;
}

export interface IRoom extends Document {
  name?: string;
  description?: string;
  pricePerNight: number;
  address?: string;
  location?: ILocation;
  guestCapacity?: number;
  numOfBeds?: number;
  isInternet?: boolean;
  isBreakfast?: boolean;
  isAirConditioned?: boolean;
  isPetsAllowed?: boolean;
  isRoomCleaning?: boolean;
  ratings?: number;
  numOfReviews?: number;
  images?: IImage[];
  category?: "King" | "Single" | "Twins";
  reviews?: IReview[];
  user?: Types.ObjectId;
  createdAt?: Date;
}



const roomSchema:Schema <IRoom> =new mongoose.Schema({
 
  name:{
    type: String,
    required:[true,'Please enter room name'],
    trim:true,
    maxlength:[200,'Room name cannot exceed 100 characters']
  },
    description:{
    type: String,
    required:[true,'Please enter room description'],
  },
  pricePerNight:{
    type: Number,
    required:[true,'Please enter room price per night'],
    default: 0.0,
  },
  address:{
    type: String,
    required:[true,'Please enter room address'],
  },
  location:{
    type:{
    type:String,
    enum:['Point'] ,
    required:false
    //can only be type point
  },
  coordinates:{
    //latitude and longitude
    type:[Number],

    index:'2dsphere',
    // use 2dsphere to store geospatial data
  },
  formattedAddress:String,
    city:String,
      state:String,
      zipCode:String,
          country:String,
  },
  guestCapacity:{
    type:Number,
    required:[true, "Please enter room guest capacity "],

  },
    numOfBeds:{
    type:Number,
    required:[true, "Please enter number of beds in room "],

  },
  isInternet:{
    type: Boolean,
    default: false,
  },
  isBreakfast:{
    type:Boolean,
    default:false,
  },
  isAirConditioned:{
    type:Boolean,
    default:false,
  },
  isPetsAllowed:{
    type:Boolean,
    default:false,
  },
  isRoomCleaning:{
    type: Boolean,
    default: false,
  },
  ratings:{
    type:Number,
    default:0
  },
  numOfReviews:{
type: Number,
default:0
  },
  images:[
    {
public_id:{
  type: String,
  required: true
},
url:{
  type: String,
  required: true
},
    }
  ],
  category:{
    type: String,
    required:[true,'Please enter room  category'],
    enum:{
      values:['King','Single','Twins'],
      //if doesnoy match with values, the message
      message:"Please select correct category for room"
    },
  },
  reviews:[
    {
      user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:false,
      },
      rating:{
        type: Number,
        required:false,
      },
      comment:{
        type: String,
        required:false
      },
      createdAt:{
        type: Date,
        default: Date.now,
      }
    }
  ],
  user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:false,
      },
      createdAt:{
        type:Date,
        default: Date.now,
        required:false,
      }


})
//Whenever you call Room.create() or room.save(), the address is automatically geocoded.
roomSchema.pre<IRoom>("save", async function (next) {
  // Only geocode if the address is new or modified
  if (!this.isModified("address")) return next();

  try {
    const loc = await geocodeAddress(this.address);
    if (loc) {
      this.location = locationFromGeocodeResult(loc);
    } else {
      console.warn(`Could not geocode address: "${this.address}"`);
    }

    next();
  } catch (err) {
    console.error("Geocoding error:", err);
    next(err as any);
  }
});
//if mongoose model has room use room otherwise we made "Room"
const Room = mongoose.models.Room || mongoose.model<IRoom>("Room", roomSchema);
export default Room;
