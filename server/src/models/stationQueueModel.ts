import mongoose, { Document, Schema } from 'mongoose';

interface StationQueueDocument extends Document {
    UserRef: mongoose.Schema.Types.ObjectId;
    StationRef: mongoose.Schema.Types.ObjectId;
    success: boolean;
    createdAt?: Date; 
    updatedAt?: Date; 
}

const StationQueueSchema: Schema<StationQueueDocument> = new Schema(
    {
        UserRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        StationRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Station',
            required: true,
        },
        success: {
            type: Boolean,
            required: true,
        },
    },
    {
        timestamps: true, 
    }
);

export default mongoose.models.StationQueue || mongoose.model<StationQueueDocument>('StationQueue', StationQueueSchema);
