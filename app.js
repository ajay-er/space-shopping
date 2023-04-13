require('dotenv').config();

const path = require('path');

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { mongoConnect } = require('./config/mongo');
const cors = require('cors');
const flash = require('connect-flash');

const app = express();
const PORT = process.env.PORT || 3000;

// routes
const adminRouter = require('./routes/admin.router');
const userRouter = require('./routes/user.router');

//global middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
//* app.use(morgan('combined'));
app.use(cors());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
  })
);
app.use(flash());

//view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// route middlewares
app.use('/dashboard', adminRouter);
app.use('/', userRouter);

async function startServer() {
  await mongoConnect();

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}🚀`);
  });
}

startServer();
