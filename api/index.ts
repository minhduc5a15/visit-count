import express, { urlencoded } from 'express';
import { db, ref, get, set } from '../src/utils/firebase';
import cors from 'cors';
import { formatNumber } from '../src/utils/format-number';

const app = express();

app.use(cors());
app.use(urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/api/visit', async (req, res) => {
    try {
        const visitRef = ref(db, 'visit_count');
        const snapshot = await get(visitRef);
        let count = snapshot.exists() ? snapshot.val() : 0;

        count += 1;
        await set(visitRef, count);

        const svg = `
      <svg width="280" height="80" viewBox="0 0 280 80" style="filter: drop-shadow(0 2px 2px rgb(255 255 255 / 0.1))">
            <style>
                * {
                    font-family: 'Poppins', sans-serif;
                }
                #background {
                    fill: #222222;
                }
                #counter-circle {
                    fill: #222222;
                    animation: pulse 1s infinite;
                }
                #ping-circle {
                    fill: #2dd4bf;
                    opacity: 0.3;
                    animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
                }
                #counter-text {
                    font-family: 'Roboto Mono', monospace;
                    font-weight: bold;
                    fill: #2dd4bf;
                    text-anchor: middle;
                    font-size: 18px;
                }
                #username-text {
                    font-size: 12px;
                    font-weight: 600;
                    fill: #2dd4bf;
                    text-anchor: middle;
                }
                #label-text {
                    font-size: 10px;
                    fill: #2dd4bf;
                    text-anchor: middle;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                @keyframes pulse {
                    0%,
                    100% {
                        fill: #2c2c2c;
                    }
                    50% {
                        fill: #3c3c3c;
                    }
                }
                @keyframes ping {
                    75%,
                    100% {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            </style>
            <defs>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <clipPath id="avatarClip">
                    <circle cx="250" cy="40" r="24" />
                </clipPath>
            </defs>
            <rect id="background" width="280" height="80" rx="40" ry="40" />
            <circle id="counter-circle" cx="40" cy="40" r="32" />
            <circle id="ping-circle" cx="40" cy="40" r="28" />
            <text id="counter-text" x="40" y="48" filter="url(#glow)" class="digits-4">${formatNumber(count)}</text>
            <text id="username-text" x="140" y="35">minhduc5a15</text>
            <text id="label-text" x="140" y="55">visits</text>
            <path d="M195,30 L200,35 L205,30" stroke="#2dd4bf" stroke-width="2" fill="none" />
            <path d="M195,35 L200,40 L205,35" stroke="#2dd4bf" stroke-width="2" fill="none" />
            <image
                x="226"
                y="16"
                width="48"
                height="48"
                href="https://www.gravatar.com/avatar/30e0e9c342d684fc5743fc2c3c735c45?d=identicon&amp;s=135"
                clip-path="url(#avatarClip)"
            />
        </svg>`;

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
