import mongodb from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const ObjectId = mongodb.ObjectID;

let users;

class LoginDAO {
  static async injectDB(conn) {
    if (users) {
      return;
    }
    try {
      users = await conn
        .db(process.env.DATA_BASE_NAME)
        .collection("loggedinUsers");
    } catch (e) {
      console.error(
        `Unable to establish collection handles in loggedinUsersDAO: ${e}`
      );
    }
  }

  static async getUserByEmailAndPassword(employeeid, password) {
    try {
      return await users.findOne({
        employeeid: employeeid,
        password: password,
      });
    } catch (e) {
      console.error(`Unable to get user: ${e}`);
      return null;
    }
  }
}

export default LoginDAO;
