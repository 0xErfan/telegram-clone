import mongoose, { Schema } from "mongoose"

export const schema = new Schema({
    name: { type: String, required: true, minLength: 3, maxLength: 20 },
    lastName: { type: String, default: '', maxLength: 20 },
    username: { type: String, required: true, minLength: 3, maxLength: 20, unique: true },
    phone: { type: String, required: true, unique: true },
    avatar: { type: String || null, required: false },
    biography: { type: String, default: '', maxLength: 70 },
    type: { type: String, enum: ['private'], default: 'private' },
    status: { type: String, enum: ["online", "offline"], default: "offline" },
    password: { type: String, required: true },
    roomMessageTrack: { type: [{ roomId: String, msgId: String }], default: [] } // track the last seen user message seen before leaving the room
}, { timestamps: true })

const UserModel = mongoose.models.User || mongoose.model('User', schema);
export default UserModel;