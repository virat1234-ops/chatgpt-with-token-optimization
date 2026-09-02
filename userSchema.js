import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        minLength:3,
        maxLength:50
    },
    age:{
        type:Number, 
        trim:true ,
        min:10,
        max:100
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true 
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    usage:{
        tokenUsed:{// this is the token used in current usage period 
            type:Number,
            default:0 
        },
    },
    resetAt: {
      type: Date,
      default: () => new Date(Date.now() + 5 * 60 * 60 * 1000)
    },
    totalTokenUsed: {
      type: Number,
      default: 0
    }


},{timestamps:true});
const User = mongoose.model("User", userSchema);

export default User;

