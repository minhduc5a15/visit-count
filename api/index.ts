import express, { urlencoded } from 'express';
import cors from 'cors';
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { formatNumber } from '../src/utils/format-number';
import { axiosInstance } from '../src/utils/axios';
import { getCollecion } from '../src/lib/mongodb';

const app = express();

const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 100,
    message: 'Too many requests, please try again later.',
});

app.use(limiter);
app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
    }),
);
app.use(urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('combined'));

app.get('/', (_, res) => {
    return res.redirect('https://github.com/minhduc5a15/visit-count');
});

app.get('/api/visit', async (req, res) => {
    const visitCountColl = await getCollecion('visit-count');
    await visitCountColl.updateOne({ type: 'visit_count' }, { $inc: { visit_count: 1 } }, { upsert: true });

    const visitorIpsColl = await getCollecion('visitor-ips');
    const ip = (
        (typeof req.headers['x-forwarded-for'] === 'string'
            ? req.headers['x-forwarded-for']
            : req.connection.remoteAddress) || 'unknown'
    ).replace(/\./g, '_');
    const referer = req.headers['referer'] || req.headers['origin'] || 'unknown';

    const timestamp = Date.now();
    const uniqueKey = `${ip}-${timestamp}-${crypto.randomBytes(4).toString('hex')}`;

    const visitCountDoc = await visitCountColl.findOne({ type: 'visit_count' });
    await visitorIpsColl.insertOne({
        key: uniqueKey,
        ip,
        timestamp: new Date(timestamp).toISOString(),
        referer,
        current_visit: visitCountDoc ? visitCountDoc['visit_count'] : 0,
    });

    const response = await axiosInstance.get('/api/code/fba61808');

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    // return res.send(response.data.content.replace('{count}', formatNumber(visitCountDoc ? visitCountDoc['visit_count'] : 0)));
    return res.redirect('https://github.com/minhduc5a15/visit-count');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
