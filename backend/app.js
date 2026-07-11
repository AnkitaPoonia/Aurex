import express        from 'express';
import cors           from 'cors';
import researchRoutes from './routes/research.routes.js';
import { errorHandler } from './middleware/error.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', researchRoutes);
app.use('/',    researchRoutes);

app.use(errorHandler);

export default app;
