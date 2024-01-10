import SignupDAO from "../dao/signupDAO.js";

export default class SignupController {
    static async apiSignup(req, res, next) {
        try {
            const {
                fname,
                lname,
                mobileno,
                employeeid,
                password,
                role,
                section,
                verryfied,
            } = req.body;
            const existingUser = await SignupDAO.getUserByPhoneNo(mobileno);
            if (existingUser) {
                throw new Error("PhoneNo already exists");
            }
            const result = await SignupDAO.addUser(
                fname,
                lname,
                mobileno,
                employeeid,
                password,
                role,
                section,
                verryfied
            );
            if (result.error) {
                throw new Error(result.error);
            }
            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
}
