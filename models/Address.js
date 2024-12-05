const mongoose = require('mongoose');
const { Schema } = mongoose;


const addressSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	state: { type: String, required: true },
	city: { type: String, required: true },
	street: { type: String, required: true },
	pinCode: { type: Number, required: true },
}, {timestamps: true});

const virtual = addressSchema.virtual('id');


virtual.get(function () {
	return this._id;
});

addressSchema.set('toJSON', {
	virtuals: true,
	versionKey: false,
	transform: (doc, ret) => { delete ret._id }
});


exports.Address = mongoose.model('Address', addressSchema);