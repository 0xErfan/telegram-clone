import mongoose, { Schema } from "mongoose"
import { RoomSchema } from "./Room";

export const schema: Schema = new Schema({
    name: { type: String, required: true, minLength: 3, maxLength: 20 },
    lastName: { type: String, required: true, minLength: 3, maxLength: 20 },
    username: { type: String, required: true, minLength: 3, maxLength: 20, unique: true },
    phone: { type: Number, required: true, unique: true },
    rooms: [mongoose.Schema.Types.Mixed],
    avatar: { type: String || null, required: false },
    password: { type: String, required: true },
}, { timestamps: true })

const UserModel = mongoose.models.User || mongoose.model('User', schema);
export default UserModel;