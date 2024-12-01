import mongoose, { Document, Schema } from 'mongoose';

interface userQueueDocument extends Document {
    StationRef: mongoose.Schema.Types.ObjectId,
    UserRef: mongoose.Schema.Types.ObjectId,
    success: Boolean
}

const userQueueSchema: Schema<userQueueDocument> = new Schema({
    StationRef: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'Station',
        required: true
    },
    UserRef: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    success: {
        type: Boolean,
        required: true
    }
});

export default mongoose.models.UserQueue || mongoose.model<userQueueDocument>('UserQueue', userQueueSchema);
