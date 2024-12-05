const { Address } = require('../models/Address');


exports.fetchUserAddress = async (req, res) => {
	const { id } = req.user;


	try {
		const addresses = await Address.find({ user: id });
		res.status(200).json({
			success: true,
			message: 'User addresses fetched successfully',
			data: { addresses },
			error: null			
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
			data: null,
			error
		});
	}
}


exports.addUserAddress = async (req, res) => { 
	const { id } = req.user;
	const { address } = req.body;
	const { state, city, street, pinCode } = address;

	try {

		if (!state) {
			throw new Error('State is required');
		} else if (!city) {
			throw new Error('City is required');
		} else if (!street) {
			throw new Error('Street is required');
		} else if (!pinCode) {
			throw new Error('Pin code is required');
		}

		const address = new Address({ user: id, state, city, street, pinCode });
		await address.save();

		res.status(201).json({
			success: true,
			message: 'Address added successfully',
			data: { address },
			error: null
		});
	} catch (error) {
		console.log('error ', error);

		res.status(500).json({
			success: false,
			message: error.message,
			data: null,
			error
		});
	}
}

exports.deleteUserAddress = async (req, res) => { 
	const { id } = req.params;

	try {
		const address = await Address.findByIdAndDelete(id);

		if (!address) {
			throw new Error('Address not found');
		}

		res.status(200).json({
			success: true,
			message: 'Address deleted successfully',
			data: { address },
			error: null
		});
	} catch (e) {
		res.status(500).json({
			success: false,
			message: e.message,
			data: null,
			error: e
		});
	}
}


exports.updateUserAddress = async (req, res) => { 
	const { id } = req.params;
	const { address } = req.body;
	const { state, city, street, pinCode } = address;

	try {
		if (!state) {
			throw new Error('State is required');
		} else if (!city) {
			throw new Error('City is required');
		} else if (!street) {
			throw new Error('Street is required');
		} else if (!pinCode) {
			throw new Error('Pin code is required');
		}

		const updatedAddress = await Address.findByIdAndUpdate(id, address, { new: true });

		if (!updatedAddress) {
			throw new Error('Address not found');
		}

		console.log('updatedAddress ', updatedAddress);

		res.status(200).json({
			success: true,
			message: 'Address updated successfully',
			data: { address: updatedAddress },
			error: null
		});
	} catch (e) {
		res.status(500).json({
			success: false,
			message: e.message,
			data: null,
			error: e
		});
	}
}