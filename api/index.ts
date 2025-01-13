import express, { urlencoded } from 'express';
import { db, ref, get, set } from '../src/utils/firebase';
import cors from 'cors';
import { formatNumber } from '../src/utils/format-number';
import { axiosInstance } from '../src/utils/axios';

const app = express();

app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
    }),
);
app.use(urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (_, res) => {
    res.redirect('https://github.com/minhduc5a15/visit-count');
});

app.get('/api/visit', async (_, res) => {
    try {
        const visitRef = ref(db, 'visit_count');
        const snapshot = await get(visitRef);
        let count = snapshot.exists() ? snapshot.val() : 0;

        count += 1;
        await set(visitRef, count);

        const response = await axiosInstance.get('/api/code/fba61808');

        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.send(response.data.content.replace('{count}', formatNumber(count)));
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).send('Error: ' + errorMessage);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
