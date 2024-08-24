import mongoose, { Schema } from "mongoose";

export const schema = new Schema({
    sender: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    message: { type: String, required: true },
    seen: [{ type: Schema.ObjectId, ref: 'User', required: true, default: [] }],
    roomID: { type: Schema.ObjectId, ref: 'Room', required: true }
}, { timestamps: true })

const MessageModel = mongoose.models.Message || mongoose.model('Message', schema);
export default MessageModel;