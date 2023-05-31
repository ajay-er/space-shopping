require('dotenv').config();

const {categoryMiddleware, loggedInMiddleware,cartProducts} = require('./middlewares/custom.middleware');

const path = require('path');

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { mongoConnect } = require('./config/mongo');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
var xss = require('xss-clean')


const app = express();
const PORT = process.env.PORT || 3000;

// routes
const adminRouter = require('./routes/admin.router');
const userRouter = require('./routes/user.router');

//global middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(mongoSanitize());
app.use(xss())

app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('short'));
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

//custom middlewares
app.use(categoryMiddleware);
app.use(loggedInMiddleware);
app.use(cartProducts);

//view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// route middlewares
app.use('/admin', adminRouter);
app.use('/', userRouter);

console.clear()

async function startServer() {
  await mongoConnect();
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}🚀`);
  });
}

startServer();
