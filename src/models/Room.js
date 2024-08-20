import mongoose, { Schema } from "mongoose"
import { schema as MessageSchema } from "./Message.js";
import connectToDB from "../db/db.js";
import MediaSchema from "./Media.js";
import LocationSchema from "./Location.js";

await connectToDB()

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

const RoomModel = mongoose.models.Room || mongoose.model('Room', RoomSchema);
const MediaModel = mongoose.models.Media || mongoose.model('Media', MediaSchema);
const LocationModel = mongoose.models.Location || mongoose.model('Location', LocationSchema);

export {
    RoomModel,
    MediaModel,
    LocationModel,
    RoomSchema,
};