import mongoose, { Schema } from "mongoose";

const MediaSchema = new Schema({
    file: { type: Buffer, required: true },
    sender: { type: Schema.ObjectId, ref: 'User', required: true },
    roomID: { type: Schema.ObjectId, ref: 'Room', required: true }
}, { timestamps: true })

const MediaModel = mongoose.models.Media || mongoose.model('Media', MediaSchema);
export default MediaModel;