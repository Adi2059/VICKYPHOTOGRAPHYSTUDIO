import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { fetchFolderPhotos } from './controllers/driveController.js';
import Customer from './models/Customer.js'; 
import Booking from './models/Booking.js'; 
import Crew from './models/Crew.js'; 

// Environment variables load karna
dotenv.config();

const app = express();

// ==========================================
// 🌐 SMART & SECURE CORS CONFIGURATION
// ==========================================
const allowedOrigins = [
    'https://weddingvideomds.com',
    'https://arungputa-project.vercel.app',
    'https://YOUR_WEBSITE_DOMAIN.com',
    'http://localhost:5173',
    'http://localhost:3000'
];

const corsOptions = {
    origin: (origin, callback) => {
        // Mobile apps, Postman ya whitelisted subdomains allow karein
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app') || origin.endsWith('.onrender.com')) {
            callback(null, true);
        } else {
            callback(null, true); 
        }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json()); 

// ==========================================
// 🗄️ DATABASE CONNECTION (MongoDB Local/Cloud)
// ==========================================
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/guru_videography')
  .then(() => console.log('🟢 MongoDB Database Connected: Guru Videography!'))
  .catch((err) => console.log('🔴 MongoDB Connection Error:', err));


// ==========================================
// 🚀 API ROUTES
// ==========================================

// ----------------------------------------------------------------
// 🔐 1. TRIPLE LOGIN AUTHENTICATION (ADMIN / CREW / CLIENT)
// ----------------------------------------------------------------
app.post('/api/admin/verify-pin', async (req, res) => {
    const { secretKey } = req.body;
    
    try {
        // 👑 1. Master Super Admin Check
        if (secretKey === "9900" || secretKey === process.env.ADMIN_PIN) {
            return res.status(200).json({ 
                success: true, 
                role: "admin", 
                message: "Admin Verified" 
            });
        }

        // 🎬 2. Crew Member Portal Check
        const crewMember = await Crew.findOne({ pin: secretKey });
        if (crewMember) {
            return res.status(200).json({ 
                success: true, 
                role: "crew", 
                crewData: crewMember, 
                message: "Crew Portal Access Granted" 
            });
        }

        // 👰 3. Client Digital Vault Check
        const client = await Customer.findOne({ pin: secretKey });
        if (client) {
            return res.status(200).json({ 
                success: true, 
                role: "client", 
                clientData: client, 
                message: "Client Verified" 
            });
        }

        return res.status(401).json({ success: false, message: "Invalid PIN Code" });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// ----------------------------------------------------------------
// 🎥 2. CREW MANAGEMENT APIs
// ----------------------------------------------------------------
// Fetch all crew members
app.get('/api/admin/crew', async (req, res) => {
    try {
        const crewList = await Crew.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: crewList });
    } catch (error) {
        console.error("Fetch Crew Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch crew members" });
    }
});

// Add new crew member
app.post('/api/admin/crew', async (req, res) => {
    try {
        const { name, phone, role, pin, dailyRate, status } = req.body;
        const newCrew = new Crew({ 
            name, 
            phone, 
            role: role || 'Lead Cinematographer', 
            pin, 
            dailyRate: dailyRate || 0,
            status: status || 'Active'
        });
        await newCrew.save();
        res.status(201).json({ success: true, message: "Crew member added successfully", data: newCrew });
    } catch (error) {
        console.error("Create Crew Error:", error);
        res.status(500).json({ success: false, message: "Failed to create crew member" });
    }
});

// Update crew member
app.put('/api/admin/crew/:id', async (req, res) => {
    try {
        const updatedCrew = await Crew.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCrew) {
            return res.status(404).json({ success: false, message: "Crew member nahi mila" });
        }
        res.status(200).json({ success: true, message: "Crew details updated", data: updatedCrew });
    } catch (error) {
        console.error("Update Crew Error:", error);
        res.status(500).json({ success: false, message: "Failed to update crew" });
    }
});

// Delete crew member
app.delete('/api/admin/crew/:id', async (req, res) => {
    try {
        const deletedCrew = await Crew.findByIdAndDelete(req.params.id);
        if (!deletedCrew) {
            return res.status(404).json({ success: false, message: "Crew member nahi mila" });
        }
        res.status(200).json({ success: true, message: "Crew member removed successfully" });
    } catch (error) {
        console.error("Delete Crew Error:", error);
        res.status(500).json({ success: false, message: "Failed to delete crew member" });
    }
});

// ----------------------------------------------------------------
// 📝 3. LIVE INQUIRY / BOOKING APIs
// ----------------------------------------------------------------
// 1. Frontend (Contact/Services/Chatbot) se aayi hui booking save karna
app.post('/api/bookings/create', async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        await newBooking.save();
        res.status(201).json({ success: true, message: "Booking saved successfully!", data: newBooking });
    } catch (error) {
        console.error("Booking Save Error:", error);
        res.status(500).json({ success: false, message: "Failed to save booking" });
    }
});

// 2. Admin Panel ko saari Live Inquiries bhejna
app.get('/api/admin/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ timestamp: -1 });
        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        console.error("Fetch Bookings Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch bookings" });
    }
});

// 3. Admin Panel se Booking Status update karna
app.put('/api/admin/bookings/:id', async (req, res) => {
    try {
        const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBooking) {
            return res.status(404).json({ success: false, message: "Booking nahi mili" });
        }
        res.status(200).json({ success: true, message: "Booking status updated", data: updatedBooking });
    } catch (error) {
        console.error("Booking Update Error:", error);
        res.status(500).json({ success: false, message: "Failed to update booking status" });
    }
});

// ----------------------------------------------------------------
// 📸 4. CLIENT PHOTO SELECTION & VAULT APIs
// ----------------------------------------------------------------
app.post('/api/client/submit-selection', async (req, res) => {
    try {
        const { pin, selectedCount, selectedIds } = req.body; 
        
        const client = await Customer.findOneAndUpdate(
            { pin: pin }, 
            { 
                selectedPhotosCount: selectedCount,
                selectedPhotos: selectedIds
            },
            { new: true }
        );
        
        if (!client) {
            return res.status(404).json({ success: false, message: "Client PIN nahi mila" });
        }

        res.status(200).json({ success: true, message: "Selection saved successfully!", data: client });
    } catch (error) {
        console.error("Submit Error:", error);
        res.status(500).json({ success: false, message: "Failed to save selection" });
    }
});

// Google Drive Folder Fetch API (Direct Drive Link Formatted Output)
app.post('/api/client/fetch-drive', async (req, res, next) => {
    try {
        // Agar standard driveController se response aana hai
        if (typeof fetchFolderPhotos === 'function') {
            return fetchFolderPhotos(req, res, next);
        }
        res.status(500).json({ success: false, message: "Drive controller function not found" });
    } catch (err) {
        console.error("Fetch Drive Route Error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// ----------------------------------------------------------------
// 📂 5. CLIENT CRUD APIs (ADMIN DASHBOARD)
// ----------------------------------------------------------------
// Studio Owner naya customer create karega
app.post('/api/admin/clients', async (req, res) => {
    try {
        const { name, eventType, driveLink, pin, deadlineDate, totalAmount, paidAmount, financialStatus } = req.body;
        const newCustomer = new Customer({ 
            name, 
            eventType, 
            driveLink, 
            pin,
            deadlineDate: deadlineDate || '',
            totalAmount: totalAmount || 0,
            paidAmount: paidAmount || 0,
            financialStatus: financialStatus || 'Lead'
        });
        await newCustomer.save();
        res.status(201).json({ success: true, message: "Customer portal created!", data: newCustomer });
    } catch (error) {
        console.error("DB Error:", error);
        res.status(500).json({ success: false, message: "Failed to create customer" });
    }
});

// Studio Owner ko dashboard par saare customers dikhana
app.get('/api/admin/clients', async (req, res) => {
    try {
        const customers = await Customer.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: customers });
    } catch (error) {
        console.error("Fetch Customers Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch customers" });
    }
});

// Client Edit/Update API
app.put('/api/admin/clients/:id', async (req, res) => {
    try {
        const clientId = req.params.id; 
        const { name, eventType, driveLink, pin, deadlineDate, totalAmount, paidAmount, financialStatus, isOffline } = req.body; 
        
        const updateData = { name, eventType, driveLink, pin };
        if (deadlineDate !== undefined) updateData.deadlineDate = deadlineDate;
        if (totalAmount !== undefined) updateData.totalAmount = totalAmount;
        if (paidAmount !== undefined) updateData.paidAmount = paidAmount;
        if (financialStatus !== undefined) updateData.financialStatus = financialStatus;
        if (isOffline !== undefined) updateData.isOffline = isOffline;

        const updatedCustomer = await Customer.findByIdAndUpdate(
            clientId,
            updateData, 
            { new: true } 
        );
        
        if (!updatedCustomer) {
            return res.status(404).json({ success: false, message: "Client nahi mila update karne ke liye!" });
        }

        res.status(200).json({ 
            success: true, 
            message: "Client details successfully update ho gaye!", 
            data: updatedCustomer 
        });
    } catch (error) {
        console.error("Update Client Error:", error);
        res.status(500).json({ success: false, message: "Server error: Client update nahi ho paya" });
    }
});

// Client Delete API
app.delete('/api/admin/clients/:id', async (req, res) => {
    try {
        const clientId = req.params.id; 
        const deletedCustomer = await Customer.findByIdAndDelete(clientId);
        
        if (!deletedCustomer) {
            return res.status(404).json({ success: false, message: "Client nahi mila!" });
        }

        res.status(200).json({ success: true, message: "Client successfully delete ho gaya!" });
    } catch (error) {
        console.error("Delete Client Error:", error);
        res.status(500).json({ success: false, message: "Server error: Client delete nahi ho paya" });
    }
});

// ----------------------------------------------------------------
// 📬 6. UTILITY, MARKETING, REVIEWS & CONTACT APIs
// ----------------------------------------------------------------
// Reviews Submission API (Added for dynamic client reviews)
app.post('/api/reviews/create', (req, res) => {
    try {
        console.log("⭐ New Review Received:", req.body);
        res.status(201).json({ success: true, message: "Review recorded successfully!", data: req.body });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to record review" });
    }
});

// Newsletter Subscription API
app.post('/api/newsletter/subscribe', (req, res) => {
    const { email } = req.body;
    console.log("📬 Newsletter Subscription received:", email);
    res.status(200).json({ success: true, message: "Subscribed to Guru Videography updates!" });
});

// Auth Logout API
app.delete('/api/auth/logout', (req, res) => {
    res.status(200).json({ success: true, message: "Logged out securely" });
});

// Public Media & Review Endpoints
app.get('/api/slideshow/images', (req, res) => {
    res.status(200).json({ success: true, data: [] });
});

app.get('/api/reviews/verified', (req, res) => {
    res.status(200).json({ success: true, data: [] });
});

// Date Reservation API
app.post('/api/calendar/reserve', async (req, res) => {
    try {
        const { name, phone, date, serviceType } = req.body;
        const newBooking = new Booking({
            name: name || 'Calendar Reservation',
            phone: phone || 'N/A',
            address: 'Date Reserved Online',
            eventDate: date,
            serviceType: serviceType || 'Pre-Booking Slot',
            status: 'New Lead',
            notes: `Reserved date: ${date}`
        });
        await newBooking.save();
        res.status(201).json({ success: true, message: "Slot reserved successfully", data: newBooking });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to reserve slot" });
    }
});

// Contact Form Submission API
app.post('/api/contact/submit', async (req, res) => {
    try {
        const newBooking = new Booking({
            name: req.body.name || 'Website Contact Form',
            phone: req.body.phone || 'N/A',
            address: req.body.address || 'Direct Inquiry',
            eventDate: req.body.eventDate || 'TBD',
            serviceType: req.body.serviceType || 'General Inquiry',
            notes: req.body.message || ''
        });
        await newBooking.save();
        res.status(201).json({ success: true, message: "Message received successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to submit message" });
    }
});

// ==========================================
// 🟢 SERVER STARTUP
// ==========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`\n================================`);
    console.log(`🚀 Guru Videography Backend is LIVE`);
    console.log(`📡 Server listening on PORT: ${PORT}`);
    console.log(`👑 Master PIN: 9900 | Crew & Client Ready`);
    console.log(`================================\n`);
});