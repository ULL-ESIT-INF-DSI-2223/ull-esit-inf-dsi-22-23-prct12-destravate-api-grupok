import { connect } from "mongoose";

// Connection to MongoDB server
try {
  await connect(process.env.MONGODB_URL!);
  console.log("Connection to MongoDB server established");
} catch (error) {
  console.log(error);
}
