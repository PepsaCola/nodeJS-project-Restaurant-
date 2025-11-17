import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import app from './app.js';

dotenv.config();
const PORT = 3000;
const { NAME, PASS, LINK, DBNAME } = process.env;

mongoose
  .connect(`mongodb+srv://${NAME}:${PASS}@${LINK}/${DBNAME}?appName=main`)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
    console.log('MongoDB Connected');
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
