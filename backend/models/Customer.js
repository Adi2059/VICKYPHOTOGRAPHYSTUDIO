import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    eventType: { type: String, required: true },
    driveLink: { type: String, required: true },
    pin: { type: String, required: true, unique: true },
    deadlineDate: { type: String, default: '' },
    selectedPhotosCount: { type: Number, default: 0 },
    // 🚀 Exact Photo IDs for Downloader & Hero Shots
    selectedPhotos: { type: [String], default: [] },
    // 💰 Financial & Status Tracking
    totalAmount: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    financialStatus: { 
        type: String, 
        enum: ['Lead', 'Advance Received', 'Full Payment'], 
        default: 'Lead' 
    },
    isOffline: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Customer', customerSchema);