import mongoose, { Schema } from "mongoose";

export const schema = new Schema({
    sender: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    message: { type: String },
    seen: [{ type: Schema.ObjectId, ref: 'User', required: true, default: [] }],
    replays: [{ type: Schema.ObjectId, ref: 'Message', required: true, default: [] }],
    roomID: { type: Schema.ObjectId, ref: 'Room', required: true },
    replayedTo: { type: { message: String, msgID: String, username: String } || null, default: null },
    isEdited: { type: Boolean, default: false },
    hideFor: [{ type: Schema.ObjectId, ref: 'User', default: [] }],
    pinnedAt: { type: String || null, default: null },
    voiceData: {
        type: {
            src: { type: String, required: true },
            duration: { type: Number, required: true },
            playedBy: [{ type: String }]
        },
        default: null
    }
}, { timestamps: true, strictPopulate: false })

const MessageModel = mongoose.models.Message || mongoose.model('Message', schema);
export default MessageModel;