const express = require('express');
const { google } = require('googleapis');
const bodyParser = require('body-parser');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Rate limiter
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 3,
    message: { status: 'failed', message: 'Too many requests' }
});
app.use(limiter);

// Google Sheets API
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const auth = new google.auth.GoogleAuth({
    keyFile: 'serene-bazaar-470210-t2-aad8b0673c74.json',
    scopes: SCOPES
});
const sheets = google.sheets({ version: 'v4', auth });
const SPREADSHEET_ID = '1VGgsJTzPIBzD3hhSF2RtrALMBaYjl2hKLIBjIcDv8NI';


app.post('/submit', async (req, res) => {
    try {
        const { name, phone, address, city, model, plan, service, website } = req.body;

        // Honeypot
        if (website) return res.status(400).json({ status: 'failed', message: 'Bot detected' });


        const row = [
            new Date().toLocaleString("ka-GE"),
            name,
            phone,
            address,
            city,
            model,
            plan,
            service,
            'new',
        ];

        console.log("📩 Received body:", req.body);

        const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
        const sheetNames = spreadsheet.data.sheets.map(s => s.properties.title);
        const sheetName = sheetNames.includes('Orders') ? 'Orders' : sheetNames[0];
        const range = `'${sheetName}'!A:I`;

        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: range,
            valueInputOption: 'RAW',
            resource: { values: [row] }
        });

        res.json({ status: 'success' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'failed', message: 'Server error', error: err.message });
    }
});

app.listen(3000, () => console.log('✅ Server running on http://localhost:3000'));
