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
        designation,
        otp,
      } = req.body;
      const result = await SignupDAO.addUser(
        fname,
        lname,
        mobileno,
        employeeid,
        password,
        role,
        section,
        designation,
        otp
      );
      if (result.error) {
        throw new Error(result.error);
      }
      res.json({ status: "success", otp: result.otp });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiLogin(req, res, next) {
    try {
      const { mobileno, otp } = req.body;

      // Check if the password matches
      const existingUser = await SignupDAO.getUserByPhoneNo(mobileno);
      if (existingUser && existingUser.otp === otp) {
        // Move the user to the loggedinprisoners collection
        await SignupDAO.moveUserToUserLoggedinCollection(existingUser._id);

        res.json({ status: "success" });
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}
