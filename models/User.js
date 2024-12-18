const mongoose = require('mongoose');
const { Schema } = mongoose;


const userSchema = new Schema({
	name: {type: String, default: 'Anonymous'},
	email: { type: String, required: true, unique: true },
	password: { type: Buffer, required: true },
	role: { type: String, default: 'user' },
	orders: { type: [Schema.Types.ObjectId], ref: 'Order' },
	addresses: { type: [Schema.Types.ObjectId], ref: 'Address' },
	salt: Buffer,
	resetPasswordToken: {type: String, default: ''}
}, { timestamps: true });

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



