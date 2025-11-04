// --- Node.js/Express Server for Secure Ringba Bidding ---
const express = require('express');
const path = require('path');
const fetch = require('node-fetch'); // Using node-fetch v2 (CommonJS syntax)

const app = express();
const PORT = process.env.PORT || 3000;
const RTB_ID = '114135cec8f84baf858208a2303ab953';
const RINGBA_API_URL = `https://rtb.ringba.com/v1/production/${RTB_ID}.json`;

// Middleware
app.use(express.json()); // To parse JSON bodies from the front-end
// Serve static files (index.html, etc.) from the root directory
app.use(express.static(path.join(__dirname, '/'))); 

// --- API Endpoint to Handle Ringba Bid ---
app.post('/api/ringba-bid', async (req, res) => {
    // Extract data sent from index.html
    const { CID, zipcode } = req.body;

    if (!CID || !zipcode) {
        return res.status(400).json({ message: 'CID and zipcode are required parameters.' });
    }

    // Construct the payload required by Ringba (using POST Option 2 format)
    const ringbaPayload = {
        CID: CID,
        exposeCallerid: 'yes',
        zipcode: zipcode,
        subid: 'yes' // Preferred, as per instructions
    };

    try {
        console.log(`Pinging Ringba for CID: ${CID}, Zip: ${zipcode}`);
        
        // Securely make the API call from the server
        const response = await fetch(RINGBA_API_URL, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(ringbaPayload)
        });

        // Parse the response from Ringba (bid acceptance or rejection)
        const ringbaResponse = await response.json();
        
        // Send the Ringba response directly back to the client
        res.status(200).json(ringbaResponse);

    } catch (error) {
        console.error('Error contacting Ringba API:', error.message);
        res.status(500).json({ 
            message: 'Failed to contact external Ringba API.', 
            error: error.message 
        });
    }
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Access the application at http://localhost:${PORT}`);
});