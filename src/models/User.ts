import mongoose, { Schema } from "mongoose"
import MediaSchema from "./Media";
import LocationSchema from "./Location";
import { schema as MessageSchema } from '@/models/Message'

const RoomSchema = new Schema({
    name: { type: String, required: true },
    avatar: { type: String || null },
    type: { type: String, enum: ['group', 'private', 'chanel'], required: true },
    participants: [{ type: mongoose.Schema.ObjectId, ref: 'User', required: true }],
    admins: [{ type: mongoose.Schema.ObjectId, ref: 'User', default: [] }],
    medias: { type: [MediaSchema], default: [] },
    messages: { type: [MessageSchema], default: [] },
    locations: { type: [LocationSchema], default: [] }
}, { timestamps: true })

export const schema: Schema = new Schema({
    name: { type: String, required: true, minLength: 3, maxLength: 20 },
    lastName: { type: String, required: true, minLength: 3, maxLength: 20 },
    username: { type: String, required: true, minLength: 3, maxLength: 20, unique: true },
    phone: { type: Number, required: true, unique: true },
    rooms: { type: [RoomSchema], default: [] },
    avatar: { type: String || null, required: false },
    password: { type: String, required: true },
}, { timestamps: true })

const UserModel = mongoose.models.User || mongoose.model('User', schema);
export default UserModel;