import mongoose, { Schema } from "mongoose";

const schema = new Schema({
    title: { type: String, required: true },
    rooms: [{ type: Schema.ObjectId, ref: 'Room', required: true }]
})

const NameSpaceModel = mongoose.models.NameSpace || mongoose.model('NameSpace', schema);
export default NameSpaceModel;