import mongodb from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const ObjectId = mongodb.ObjectID;

let users;

class UsersDAO {
  static async injectDB(conn) {
    if (users) {
      return;
    }
    try {
      users = await conn
        .db(process.env.DATA_BASE_NAME)
        .collection("loggedinUsers");
    } catch (e) {
      console.error(`Unable to establish collection handles in UsersDAO: ${e}`);
    }
  }

  static async getUsers() {
    try {
      const userList = await users.find({}).toArray();
      return userList;
    } catch (e) {
      console.error(`Unable to get users: ${e}`);
      return null;
    }
  }

  static async getUserDetails(employeeId) {
    try {
      const projection = {
        userId: 1,
        fname: 1,
        lname: 1,
        mobileno: 1,
        employeeid: 1,
        role: 1,
        section: 1,
        _id: 0, // Exclude the _id field
      };

      const userDetails = await users.findOne(
        { employeeid: employeeId },
        { projection }
      );
      return userDetails;
    } catch (e) {
      console.error(`Unable to get user details: ${e}`);
      return null;
    }
  }
}

export default UsersDAO;
