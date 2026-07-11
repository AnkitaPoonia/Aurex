
import 'dotenv/config';
import app from './app.js';
import { PORT } from './config/config.js';

app.listen(PORT, () => {
  console.log(`Backend server (LangChain enabled) running on http://localhost:${PORT}`);
});
