import mongoose, { Schema } from "mongoose"

export const schema = new Schema({
    name: { type: String, required: true, minLength: 3, maxLength: 20 },
    lastName: { type: String, required: true, minLength: 3, maxLength: 20 },
    username: { type: String, required: true, minLength: 3, maxLength: 20, unique: true },
    phone: { type: Number, required: true, unique: true },
    avatar: { type: String || null, required: false },
    status: { type: String, enum: ["online", "offline"], default: "offline" },
    password: { type: String, required: true },
}, { timestamps: true })

const UserModel = mongoose.models.User || mongoose.model('User', schema);
export default UserModel;