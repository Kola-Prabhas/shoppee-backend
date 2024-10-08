const mongoose = require('mongoose');
const { Schema } = mongoose;



const categorySchema = new Schema({
	label: { type: String, required: true, unique: true  },
	value: { type: String, required: true, unique: true },
	checked: { type: Boolean, default: false}
}, { timestamps: true });

const virtual = categorySchema.virtual('id');

virtual.get(function () {
	return this._id;
})


categorySchema.set('toJSON', {
	virtuals: true,
	versionKey: false,
	transform: (doc, ret) => {delete ret._id}
})


exports.Category = mongoose.model('Category', categorySchema);



