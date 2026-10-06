import mongoose from 'mongoose';

const crewSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'Lead Cinematographer'
    },
    pin: {
        type: String,
        required: true,
        unique: true
    },
    dailyRate: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    assignedEvents: [{
        type: String
    }]
}, {
    timestamps: true
});

const Crew = mongoose.model('Crew', crewSchema);

export default Crew;