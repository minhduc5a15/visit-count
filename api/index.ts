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
      <svg width="200" height="70" viewBox="0 0 200 70" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 2px 2px rgb(0 0 0 / 0.06));">
        <style>
          #counter-text {
            font-family: 'Roboto Mono', monospace;
            font-size: 18px;
            font-weight: bold;
            fill: #134e4a;
            text-anchor: middle;
          }
          #username-text {
            font-size: 12px;
            font-weight: 600;
            fill: #134e4a;
            text-anchor: middle;
          }
          #label-text {
            font-size: 10px;
            fill: #134e4a;
            text-anchor: middle;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          #background {
            fill: #2dd4bf;
            animation: pulse 2s infinite;
          }
          #counter-circle {
            fill: #14b8a6;
          }
          #ping-circle {
            fill: #0d9488;
            opacity: 0.75;
            animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
          }
          #chevron {
            animation: bounce 1s infinite;
          }
          @keyframes pulse {
            0%, 100% { fill: #2dd4bf; }
            50% { fill: #5eead4; }
          }
          @keyframes ping {
            75%, 100% {
              transform: scale(2);
              opacity: 0;
            }
          }
          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(3px);
            }
          }
        </style>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <rect id="background" width="200" height="70" rx="10" ry="10" />
        <circle id="counter-circle" cx="35" cy="35" r="25" />
        <circle id="ping-circle" cx="35" cy="35" r="20" />
        <text id="counter-text" x="35" y="41" filter="url(#glow)">${count}</text>
        <text id="username-text" x="120" y="30">minhduc5a15</text>
        <text id="label-text" x="120" y="50">visits</text>
        <g id="chevron">
          <path d="M180,25 L185,30 L190,25" stroke="#134e4a" stroke-width="2" fill="none" />
          <path d="M180,30 L185,35 L190,30" stroke="#134e4a" stroke-width="2" fill="none" />
        </g>
      </svg>
    `;

        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(svg);
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
        res.status(500).send('Error: ' + errorMessage);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
