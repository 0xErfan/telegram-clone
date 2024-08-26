import mongoose, { Schema } from "mongoose"

const RoomSchema = new Schema({
    name: { type: String, required: true },
    avatar: { type: String || null },
    type: { type: String, enum: ['group', 'private', 'chanel'], required: true },
    participants: [{ type: Schema.ObjectId, ref: 'User', required: true }],
    admins: [{ type: Schema.ObjectId, ref: 'User', required: true }],
    creator: { type: Schema.ObjectId, ref: 'User', required: true },
    medias: [{ type: Schema.ObjectId, ref: 'Media', required: true }],
    messages: [{ type: Schema.ObjectId, ref: 'Message', required: true }],
    locations: [{ type: Schema.ObjectId, ref: 'Location', required: true }]
}, { timestamps: true })

const RoomModel = mongoose.models.Room || mongoose.model('Room', RoomSchema);
export default RoomModel;