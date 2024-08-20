import { Schema } from "mongoose";

const MediaSchema = new Schema({
    file: { type: Buffer, required: true },
    sender: { type: Schema.ObjectId, ref: 'User', required: true }
}, { timestamps: true })

export default MediaSchema;