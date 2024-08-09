import mongoose, { Schema } from "mongoose"
import { schema as MessageSchema } from "./Message";
import { schema as UserSchema } from "./User";

const LocationSchema = new Schema({
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    sender: UserSchema
})

const MediaSchema = new Schema({
    file: { type: File, required: true },
    sender: UserSchema
})

export const schema = new mongoose.Schema({
    name: { type: String, required: true },
    avatar: { type: String || null },
    participants: [UserSchema],
    medias: [MediaSchema],
    messages: [MessageSchema],
    locations: [LocationSchema]
}, { timestamps: true })

const RoomModel = mongoose.models.Room || mongoose.model('Room', schema);
const MediaModel = mongoose.models.Media || mongoose.model('Media', MediaSchema);
const LocationModel = mongoose.models.Location || mongoose.model('Location', LocationSchema);

export {
    RoomModel,
    MediaModel,
    LocationModel
};