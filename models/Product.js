const mongoose = require('mongoose');
const { Schema } = mongoose;



const productSchema = new Schema({
	title: { type: String, required: true, unique: true  },
	description: { type: String, required: true },
	price: { type: Number, required: true, min: [1, 'Invalid min price'], max: [10000, 'Invalid max price'] },
	discountPercentage: { type: Number, min: [0, 'Invalid min discount'], max: [99, 'Invalid max discount'] },
	rating: { type: Number, min: [1, 'Invalid min rating'], max: [5, 'Invalid max rating'], default: 1 },
	stock: { type: Number, min: [0, 'Invalid stock amount'], default: 0 },
	brand: { type: String, required: true },
	category: { type: String, required: true },
	thumbnail: { type: String, required: true },
	images: { type: [String], required: true },
	deleted: { type: Boolean, default: false }
});

const virtual = productSchema.virtual('id');

virtual.get(function () {
	return this._id;
})


productSchema.set('toJSON', {
	virtuals: true,
	versionKey: false,
	transform: (doc, ret) => {delete ret._id}
})


exports.Product = mongoose.model('Product', productSchema);



