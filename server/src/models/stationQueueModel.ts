import mongoose, { Document, Schema } from 'mongoose';

interface stationQueueDocument extends Document {
    UserRef: mongoose.Schema.Types.ObjectId,
    StationRef: mongoose.Schema.Types.ObjectId,
}

const StationQueueSchema: Schema<stationQueueDocument> = new Schema({
    UserRef: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    StationRef: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'Station',
        required: true
    }
});

export default mongoose.models.StationQueue || mongoose.model<stationQueueDocument>('StationQueue', StationQueueSchema);
