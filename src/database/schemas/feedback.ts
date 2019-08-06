import _ from 'lodash';
import mongoose from 'mongoose';
import Utils from '../../Utils';

export interface IFeedback extends mongoose.Document {
	title: string;
    content: string;
    user_id: mongoose.Schema.Types.ObjectId;
    anonymouse: boolean;
}

const feedbackSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
    },
    content: {
        type: String,
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    anonymous: {
        type: Boolean,
        default: true,
    }
});

export const createFeedbackDTO = (obj: object) => _.pick(obj, ['title', 'content', 'user_id', 'anonymous']);

export const feedbackModel = mongoose.model<IFeedback>('Feedback', feedbackSchema);

export const feedbackCRUD = Utils.crud<IFeedback>(feedbackModel);