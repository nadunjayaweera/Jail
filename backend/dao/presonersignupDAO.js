import mongodb from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const ObjectId = mongodb.ObjectID;

let presoners;
let loggedinPrisoners;

export default class PresonnerSignupDAO {
  static async injectDB(conn) {
    if (presoners && loggedinPrisoners) {
      return;
    }
    try {
      presoners = await conn
        .db(process.env.DATA_BASE_NAME)
        .collection("presoners");
      loggedinPrisoners = await conn
        .db(process.env.Data_BASE_NAME)
        .collection("loggedinprisoners");
    } catch (e) {
      console.error(
        `Unable to establish collection handles in PresonnerSignupDAO: ${e}`
      );
    }
  }

  static async addUser(mobileno, attempts, name, presonerid, wardno) {
    try {
      // Check if the user already exists
      const existingUser = await presoners.findOne({ mobileno: mobileno });

      if (existingUser) {
        // Check for lockout expiration first
        if (
          existingUser.lockoutTime &&
          new Date() >= new Date(existingUser.lockoutTime)
        ) {
          // Reset attempts and lockout time if expired
          await presoners.updateOne(
            { _id: existingUser._id },
            { $set: { attempt: 0, lockoutTime: null } }
          );
        } else {
          // Proceed with incrementing attempts and potential lockout

          // Increment attempts count
          const updatedAttempts = existingUser.attempt + 1;

          // Check if attempts exceed 3
          if (updatedAttempts > 2) {
            // Implement lockout logic
            const lockoutTime = new Date();
            lockoutTime.setMinutes(lockoutTime.getMinutes() + 10); // Set lockout for 10 minutes

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
          const newPassword = Math.floor(
            1000 + Math.random() * 9000
          ).toString();

          // Update the existing user with new password and reset lockout time
          await presoners.updateOne(
            { _id: existingUser._id },
            {
              $set: {
                password: newPassword,
                attempt: updatedAttempts,
                lockoutTime: null, // Reset lockout time even on successful password update
              },
            }
          );

          return {
            success: "Password updated successfully",
            password: newPassword,
          };
        }
      } else {
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
          lockoutTime: null,
          Name: name,
          PresonerId: presonerid,
          WardNo: wardno,
          role: "Presoner",
        };
        return await presoners.insertOne(addDoc);
      }
    } catch (e) {
      console.error(`Unable to add user: ${e}`);
      return { error: e };
    }
  }

  static async moveUserToLoggedinCollection(userId) {
    try {
      const user = await presoners.findOne({ _id: ObjectId(userId) });
      if (user) {
        await loggedinPrisoners.insertOne(user);
        await presoners.deleteOne({ _id: ObjectId(userId) });
        return { success: "User moved to loggedinprisoners collection" };
      } else {
        return { error: "User not found in presoners collection" };
      }
    } catch (e) {
      console.error(`Unable to move user to loggedinprisoners: ${e}`);
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
