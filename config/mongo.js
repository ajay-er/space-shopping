const mongoose = require('mongoose');
require('dotenv').config();

const uri = "mongodb://mongo-srv:27017/space" || process.env.MONGO_DB ;

mongoose.connection.once('open', () => {
  console.log('MongoDB connection ready!🚀');
});

mongoose.connection.on('error', (err) => {
  console.error('Database not connected🫡!!!' + err);
});

async function mongoConnect() {
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

module.exports = { mongoConnect };
