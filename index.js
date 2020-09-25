import 'dotenv/config';
import express from 'express';
import csrf from 'csurf';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

import { catchErrors, notFound } from './middlewares/errors';
import { attachUser } from './middlewares/auth';

import auth from './routes/auth';
import users from './routes/users';
import tactics from './routes/tactics';

const csrfProtection = csrf({
  cookie: true,
});

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(csrfProtection);

app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.use('/api/auth', auth());

app.use(attachUser);
app.use('/api/users', users());
app.use('/api/tactics', tactics());

app.use(notFound);
app.use(catchErrors);

const PORT = process.env.PORT || 3000;

async function connect() {
  try {
    mongoose.Promise = global.Promise;
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
  } catch (err) {
    console.log('Mongoose error', err);
  }

  app.listen(PORT, () => console.log(`App listening on localhost:${PORT}`));
}

connect();
