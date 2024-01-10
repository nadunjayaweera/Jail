import mongodb from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const ObjectId = mongodb.ObjectID;

let users;

export default class UserDAO {
    static async injectDB(conn) {
        if (users) {
            return;
        }
        try {
            users = await conn
                .db(process.env.DATA_BASE_NAME)
                .collection("users");
        } catch (e) {
            console.error(
                `Unable to establish collection handles in UserDAO: ${e}`
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
        verryfied
    ) {
        try {
            const count = await users.countDocuments();
            const userId = (count + 1).toString().padStart(3, "0");
            const currentDate = new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
            }); // get current date in ISO format
            const addDoc = {
                userId: userId,
                fname: fname,
                lname: lname,
                mobileno: mobileno,
                employeeid: employeeid,
                password: password,
                role: role,
                section: section,
                verryfied: verryfied,
                createDate: currentDate, // add the current date to the document
            };
            return await users.insertOne(addDoc);
        } catch (e) {
            console.error(`Unable to add user: ${e}`);
            return { error: e };
        }
    }

    static async createUser(userInfo) {
        const {
            fname,
            lname,
            mobileno,
            employeeid,
            role,
            section,
            password,
            verryfied,
        } = userInfo;
        const user = {
            _id: ObjectId(), // generate unique id for user
            fname: fname,
            lname: lname,
            mobileno: mobileno,
            employeeid: employeeid,
            password: password,
            role: role,
            section: section,
            verryfied: verryfied,
        };

        try {
            const existingUser = await users.findOne({
                mobileno: user.mobileno,
            });
            if (existingUser) {
                throw new Error("PhoneNO already exists");
            }

            const result = await users.insertOne(user);
            return result;
        } catch (e) {
            console.error(`Unable to create user: ${e}`);
            throw new Error(`Unable to create user: ${e.message}`);
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
}
