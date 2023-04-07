const path = require('path');

const express = require('express');
const morgan = require('morgan');
const { mongoConnect } = require('./services/mongo');
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

//view engine setup
app.set('view engine', 'hbs');
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
