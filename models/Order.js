const mongoose = require('mongoose');
const { Schema } = mongoose;


const orderSchema = new Schema({
	items: { type: [Schema.Types.Mixed], required: true },
	user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	totalItems: { type: Number },
	totalPrice: { type: Number },
	totalDiscountPrice: {type: Number},
	selectedAddress: { type: Schema.Types.ObjectId, ref: 'Address', required: true },
	status: { type: String, default: 'pending' },
	paymentStatus: { type: String, default: 'unpaid' }
}, { timestamps: true });

const virtual = orderSchema.virtual('id');

virtual.get(function () {
	return this._id;
})


orderSchema.set('toJSON', {
	virtuals: true,
	versionKey: false,
	transform: (doc, ret) => { delete ret._id }
})


exports.Order = mongoose.model('Order', orderSchema);



