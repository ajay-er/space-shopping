const path = require('path');

const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const { mongoConnect } = require('./config/mongo');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// routes
const adminRouter = require('./routes/admin.router');
const shopRouter = require('./routes/shop.router');

//global middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
//* app.use(morgan('combined'));
app.use(cors());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    }
  })
)

//view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// route middlewares
app.use('/admin', adminRouter);
app.use('/', shopRouter);


async function startServer() {
  await mongoConnect();

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}🚀`);
  });
}

startServer();
