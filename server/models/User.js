import mongoose from "mongoose"

const UsersSchema = new mongoose.Schema({
    username:{type: String, required: true, unique: true},
    email:{type: String, required: true, unique: true},
    password:{type: String, required: true, unique: true},
    isVerified: { type: Boolean, default: false } // Add this field
})

const UserModel = mongoose.model("User", UsersSchema)

export {UserModel as User}
