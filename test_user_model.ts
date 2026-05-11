import dbConnect from "./lib/mongodb";
import User from "./lib/models/User";

async function run() {
  try {
    await dbConnect();
    console.log("DB Connected");
    const user = await User.findOne({ mobileNumber: "3333333333" });
    console.log("User found:", user);
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

run();
