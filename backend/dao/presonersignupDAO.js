import mongodb from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const ObjectId = mongodb.ObjectID;

let presoners;

export default class PresonnerSignupDAO {
  static async injectDB(conn) {
    if (presoners) {
      return;
    }
    try {
      presoners = await conn
        .db(process.env.DATA_BASE_NAME)
        .collection("presoners");
    } catch (e) {
      console.error(
        `Unable to establish collection handles in PresonnerSignupDAO: ${e}`
      );
    }
  }

  static async addUser(mobileno, attempts) {
    try {
      // Check if the user already exists
      const existingUser = await presoners.findOne({ mobileno: mobileno });

      if (existingUser) {
        // Increment attempts count
        const updatedAttempts = existingUser.attempt + 1;

        // Check if attempts exceed 3
        if (updatedAttempts > 2) {
          // Implement lockout logic (e.g., set a lockout timestamp)
          // For simplicity, let's set a lockout timestamp for 10 minutes
          const lockoutTime = new Date();
          lockoutTime.setMinutes(lockoutTime.getMinutes() + 1);

          // Update the existing user with lockout information
          await presoners.updateOne(
            { _id: existingUser._id },
            {
              $set: {
                attempt: updatedAttempts,
                lockoutTime: lockoutTime,
              },
            }
          );

          return {
            error:
              "Account locked due to multiple unsuccessful attempts. Please try again later.",
          };
        }

        // Generate a new random 5-digit password
        const newPassword = Math.floor(1000 + Math.random() * 9000).toString();

        // Update the existing user with new password and incremented attempts count
        await presoners.updateOne(
          { _id: existingUser._id },
          {
            $set: {
              password: newPassword,
              attempt: updatedAttempts,
              lockoutTime: null, // Reset lockout time
            },
          }
        );

        return {
          success: "Password updated successfully",
          password: newPassword,
        };
      }

      // Generate a random 5-digit password
      const password = Math.floor(1000 + Math.random() * 9000).toString();

      const count = await presoners.countDocuments();
      const userId = (count + 1).toString().padStart(3, "0");
      const currentDate = new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      const addDoc = {
        userId: userId,
        mobileno: mobileno,
        password: password,
        attempt: attempts,
        createDate: currentDate,
        lockoutTime: null, // Initialize lockout time as null
      };
      return await presoners.insertOne(addDoc);
    } catch (e) {
      console.error(`Unable to add user: ${e}`);
      return { error: e };
    }
  }

  static async deleteUser(userId) {
    try {
      return await presoners.deleteOne({ _id: ObjectId(userId) });
    } catch (e) {
      console.error(`Unable to delete user: ${e}`);
      throw new Error(`Unable to delete user: ${e.message}`);
    }
  }

  static async getUserByPhoneNo(mobileno) {
    try {
      return await presoners.findOne({ mobileno: mobileno });
    } catch (e) {
      console.error(`Unable to get user: ${e}`);
      return null;
    }
  }
}
