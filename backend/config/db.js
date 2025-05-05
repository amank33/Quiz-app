
import mongoose from "mongoose";


const connectDB = async (MONGO_URI) => {
  try {
    //
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB database");

  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
