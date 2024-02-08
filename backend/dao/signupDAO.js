import mongodb from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const ObjectId = mongodb.ObjectID;
import { sendSMS } from "../services/smsgateway.js";

let users;
let loggedinUsers;

export default class SignupDAO {
  static async injectDB(conn) {
    if (users && loggedinUsers) {
      return;
    }
    try {
      users = await conn.db(process.env.DATA_BASE_NAME).collection("users");
      loggedinUsers = await conn
        .db(process.env.Data_BASE_NAME)
        .collection("loggedinUsers");
    } catch (e) {
      console.error(
        `Unable to establish collection handles in SignupDAO: ${e}`
      );
    }
  }

  static async addUser(
    fname,
    lname,
    mobileno,
    employeeid,
    password,
    role,
    section,
    designation,
    otp,
    attempts
  ) {
    try {
      // Check if the user already exists
      const existingUser = await users.findOne({ mobileno: mobileno });

      if (existingUser) {
        // Check for lockout expiration first
        if (
          existingUser.lockoutTime &&
          new Date() >= new Date(existingUser.lockoutTime)
        ) {
          // Reset attempts and lockout time if expired
          await users.updateOne(
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

            await users.updateOne(
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
          const newOtp = Math.floor(1000 + Math.random() * 9000).toString();

          // Update the existing user with new password and reset lockout time
          await users.updateOne(
            { _id: existingUser._id },
            {
              $set: {
                otp: newOtp,
                attempt: updatedAttempts,
                lockoutTime: null, // Reset lockout time even on successful password update
              },
            }
          );

          // Send the new password via SMS
          const smsMessage = `Your OTP is: ${newOtp}`;
          sendSMS(mobileno, smsMessage);

          return {
            success: "OUT updated successfully",
            otp: newOtp,
          };
        }
      } else {
        const generateTimestamp = () => {
          const timestamp = Math.floor(Date.now() / 1000); // Convert milliseconds to seconds
          return timestamp.toString();
        };

        // Generate a random 5-digit password
        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        const userId = generateTimestamp();
        const currentDate = new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
        const addDoc = {
          userId: userId,
          fname: fname,
          lname: lname,
          mobileno: mobileno,
          employeeid: employeeid,
          password: password,
          role: "users",
          designation: designation,
          section: section,
          otp: otp,
          attempt: attempts,
          createDate: currentDate,
          lockoutTime: null,
        };

        // Send the new password via SMS
        const smsMessage = `Your OTP is: ${otp}`;
        sendSMS(mobileno, smsMessage);

        return await users.insertOne(addDoc);
      }
    } catch (e) {
      console.error(`Unable to add user: ${e}`);
      return { error: e };
    }
  }

  static async moveUserToUserLoggedinCollection(_id) {
    try {
      const user = await users.findOne({ _id: ObjectId(_id) });
      console.log("Users data collection:", user);

      if (user) {
        // Remove the _id field from the user object
        delete user._id;

        await loggedinUsers.insertOne(user);
        console.log("User successfully entered into loggedinUsers collection");

        await users.deleteOne({ _id: ObjectId(_id) });
        return { success: "User moved to loggedinUsers collection" };
      } else {
        return { error: "User not found in users collection" };
      }
    } catch (e) {
      console.error(`Unable to move user to loggedinUsers: ${e}`);
      return { error: e };
    }
  }

  static async deleteUser(_id) {
    try {
      return await users.deleteOne({ _id: ObjectId(_id) });
    } catch (e) {
      console.error(`Unable to delete user: ${e}`);
      throw new Error(`Unable to delete user: ${e.message}`);
    }
  }

  static async getUserByPhoneNo(mobileno) {
    try {
      return await users.findOne({ mobileno: mobileno });
    } catch (e) {
      console.error(`Unable to get user: ${e}`);
      return null;
    }
  }

  static async getUserByEmployeeIdFromLoggedinUsers(employeeId) {
    try {
      const user = await loggedinUsers.findOne({ employeeid: employeeId });
      return user;
    } catch (e) {
      console.error(
        `Unable to get user by employeeId from loggedinUsers: ${e}`
      );
      return null;
    }
  }

  static async updateUserByEmployeeIdInLoggedinUsers(employeeId, updatedData) {
    try {
      const result = await loggedinUsers.updateOne(
        { employeeid: employeeId },
        { $set: updatedData }
      );
      return result.modifiedCount > 0;
    } catch (e) {
      console.error(
        `Unable to update user by employeeId in loggedinUsers: ${e}`
      );
      return false;
    }
  }
}
