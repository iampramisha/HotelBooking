import mongoose,{Document, Schema} from "mongoose";
import bcrypt from "bcryptjs";
import crypto from 'crypto'
export interface IUser extends Document{
    name:string
    email:string
    password:string
    avatar:{
        public_id: string
        url:string
    }
    role:string
    createdAt:Date
    resetPasswordToken: string
    resetPasswordExpire:Date
comparePassword(enteredPassword:string):Promise<boolean>
}
const userSchema:Schema <IUser>=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please enter your name']
    },
    email:{
        type:String,
            required:[true,'Please enter your email'],
            unique:true
    },
    password:{
    type:String,
            required:[true,'Please enter your password'],
            minlength:[6,"Your password must be longer than 6 characters"],
          select:false
    },
    avatar:{
        public_id:String,
          url:String
    },
        role:{
        type:String,
      default:"user"
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    resetPasswordToken:{
type:String
    },
    resetPasswordExpire:{
        type:Date
    }
});
//encrypting password before saving the user
//before presave user perform:
// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
//comapre user password
userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

//generate reset password token
userSchema.methods.getResetPasswordToken= function():string{
    //generate the token
const resetToken=crypto.randomBytes(20).toString('hex')
//hash the token
this.resetPasswordToken=crypto.createHash('sha256').update(resetToken).digest('hex');
//set token expire time
this.resetPasswordExpire=Date.now()+30*60*1000;
return resetToken;
}

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
export default User;