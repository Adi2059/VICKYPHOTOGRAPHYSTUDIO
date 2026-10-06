import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  eventDate: { type: String },
  serviceType: { type: String, required: true },
  guestCount: { type: String, default: '300-500' },
  notes: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['New Lead', 'Contacted', 'Deal Closed'], 
    default: 'New Lead' 
  },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Booking', bookingSchema);