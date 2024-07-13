const mongoose = require('mongoose');
const { Schema } = mongoose;


const userSchema = new Schema({
	email: { type: String, required: true, unique: true },
	password: { type: Buffer, required: true },
	role: { type: String, default: 'user' },
	addresses: { type: [Schema.Types.Mixed] },
	orders: { type: [Schema.Types.ObjectId], ref: 'Order' },
	name: { type: String },
	salt: Buffer
});

const virtual = userSchema.virtual('id');

virtual.get(function () {
	return this._id;
})


userSchema.set('toJSON', {
	virtuals: true,
	versionKey: false,
	transform: (doc, ret) => { delete ret._id }
})


exports.User = mongoose.model('User', userSchema);



