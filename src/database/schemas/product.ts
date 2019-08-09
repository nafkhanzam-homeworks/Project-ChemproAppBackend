import _ from 'lodash';
import mongoose from 'mongoose';
import Utils from '../../Utils';

export interface IProduct extends mongoose.Document {
	img: string;
	price: number;
	description: string;
}

const productSchema = new mongoose.Schema({
	img: {
		type: String,
		required: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    qty: {
        type: Number,
    },
    description: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        default: NaN,
    }
});

export const createProductDTO = (obj: object) => _.pick(obj, ['img', 'price', 'description']);

export const productModel = mongoose.model<IProduct>('Product', productSchema);

export const productCRUD = Utils.crud<IProduct>(productModel);