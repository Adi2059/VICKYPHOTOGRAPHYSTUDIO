import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

const drive = google.drive({ 
    version: 'v3', 
    auth: process.env.GOOGLE_API_KEY 
});

export const fetchFolderPhotos = async (req, res) => {
    try {
        // 🚨 THE FIX: Humne dono options de diye. Frontend jo bhi bheje, ye pakad lega!
        const link = req.body.driveLink || req.body.folderLink;

        // Agar link aayi hi nahi (undefined hai), toh code yahi ruk jayega aur crash nahi hoga
        if (!link) {
            return res.status(400).json({ 
                success: false, 
                message: "Error: Google Drive Link frontend se backend tak nahi pahunchi!" 
            });
        }

        // 1. Google Drive Link se Folder ID nikalna (ab 'link' variable use kar rahe hain)
        const match = link.match(/folders\/([a-zA-Z0-9_-]+)/) || link.match(/id=([a-zA-Z0-9_-]+)/);
        if (!match) {
            return res.status(400).json({ success: false, message: "Invalid Google Drive Folder Link format" });
        }
        const folderId = match[1];

        let allFiles = [];
        let pageToken = null;

        // 2. 🚀 LOOP FOR UNLIMITED PHOTOS
        do {
            const response = await drive.files.list({ 
                q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
                fields: 'nextPageToken, files(id, name, webViewLink, thumbnailLink)',
                pageSize: 1000, 
                pageToken: pageToken || undefined 
            });

            if (response.data.files && response.data.files.length > 0) {
                allFiles = [...allFiles, ...response.data.files]; 
            }
            
            pageToken = response.data.nextPageToken; 
        } while (pageToken); 

        // 3. Frontend ke liye data format karna
        const formattedPhotos = allFiles.map(file => ({
            id: file.id,
            name: file.name,
            thumbUrl: file.thumbnailLink,
            fullUrl: file.webViewLink
        }));

        res.status(200).json({ success: true, data: formattedPhotos });

    } catch (error) {
        console.error("🔥 FULL Drive Fetch Error:", error.message || error);
        res.status(500).json({ success: false, message: "Drive se photos fetch nahi ho paye" });
    }
};