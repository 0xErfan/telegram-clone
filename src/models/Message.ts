import mongoose, { Schema } from "mongoose";

export const schema = new Schema({
    sender: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    message: { type: String, required: true },
    seen: { type: Boolean, default: false }
}, { timestamps: true })

const MessageSchema = mongoose.models?.Message || mongoose.model('Message', schema);
export default MessageSchema;