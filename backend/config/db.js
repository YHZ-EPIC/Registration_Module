import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`\n --> MongoDB Connected : ${conn.connection.host}`);
  } catch (error) {
    console.log(`\n Error, Failed to Connect MongoDB : ${error.message}`);
    mongoose.connection.close();
    process.exit(1);
  }
};

export default connectDB;
