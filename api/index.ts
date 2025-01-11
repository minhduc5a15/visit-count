import express, { urlencoded } from 'express';
import { db, ref, get, set } from '../src/utils/firebase';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/api/visit', async (req, res) => {
    try {
        // Lấy số lượt truy cập từ Firebase
        const visitRef = ref(db, 'visit_count');
        const snapshot = await get(visitRef);
        let count = snapshot.exists() ? snapshot.val() : 0;

        // Tăng count và lưu vào Firebase
        count += 1;
        await set(visitRef, count);

        // SVG được trả về
        const svg = `
    <svg width="240" height="80" viewBox="0 0 240 80" xmlns="http://www.w3.org/2000/svg">
        <style>
        #counter-text {
            font-size: 24px;
            font-weight: bold;
            fill: #134e4a;
            text-anchor: middle;
        }
        #username-text {
            font-size: 14px;
            fill: #134e4a;
            text-anchor: middle;
        }
        #label-text {
            font-size: 12px;
            fill: #134e4a;
            text-anchor: middle;
            text-transform: uppercase;
        }
        #background {
            fill: #2dd4bf;
            transition: fill 0.3s ease;
        }
        #counter-circle {
            fill: #14b8a6;
        }
        </style>
        <rect id="background" width="240" height="80" rx="10" ry="10" />
        <circle id="counter-circle" cx="40" cy="40" r="30" />
        <text id="counter-text" x="40" y="48">${count}</text>
        <text id="username-text" x="140" y="35">minhduc5a15</text>
        <text id="label-text" x="140" y="55">visits</text>
    </svg>
    `;

        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(svg);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).send('Error: ' + errorMessage);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
