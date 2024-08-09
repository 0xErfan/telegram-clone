import mongoose, { Schema } from "mongoose";
import { schema as roomSchema } from "./Room";

const schema = new Schema({
    title: { type: String, required: true },
    rooms: [roomSchema]
})

const RoomModel = mongoose.models.NameSpace || mongoose.model('NameSpace', schema);
export default RoomModel;