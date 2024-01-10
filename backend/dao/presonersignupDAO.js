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

    static async addUser(name, mobileno, presonerid, wardno, attempts) {
        try {
            // Generate a random 5-digit password
            const password = Math.floor(
                10000 + Math.random() * 90000
            ).toString();

            const count = await presoners.countDocuments();
            const userId = (count + 1).toString().padStart(3, "0");
            const currentDate = new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
            });
            const addDoc = {
                userId: userId,
                name: name,
                mobileno: mobileno,
                password: password,
                presonerid: presonerid,
                wardno: wardno,
                attempts: attempts,
                createDate: currentDate,
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
