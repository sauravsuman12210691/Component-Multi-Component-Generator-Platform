const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const dbname ="multicompo";
    await mongoose.connect(`${process.env.MONGO_URI}/${dbname}`);
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
