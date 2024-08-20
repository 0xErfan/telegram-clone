import { Schema } from "mongoose";

const LocationSchema = new Schema({
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    sender: { type: Schema.ObjectId, ref: 'User', required: true }
}, { timestamps: true })

export default LocationSchema;