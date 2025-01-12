import express, { urlencoded } from 'express';
import { db, ref, get, set } from '../src/utils/firebase';
import cors from 'cors';
import { formatNumber } from '../src/utils/format-number';
import { axiosInstance } from '../src/utils/axios';

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

        const response = await axiosInstance.get('/api/code/fba61808');

        console.log('Response:', response.data);
        res.setHeader('Content-Type', 'image/svg+xml');
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
