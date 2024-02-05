import PresonnerSignupDAO from "../../dao/presonersignupDAO.js";

export default class PresonnerSignupController {
  static async apiSignup(req, res, next) {
    try {
      const { mobileno, attempts, name, presonerid, wardno } = req.body;
      const result = await PresonnerSignupDAO.addUser(
        mobileno,
        attempts,
        name,
        presonerid,
        wardno
      );
      if (result.error) {
        throw new Error(result.error);
      }
      res.json({ status: "success", password: result.password });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiLogin(req, res, next) {
    try {
      const { mobileno, password } = req.body;

      // Check if the password matches
      const existingUser = await PresonnerSignupDAO.getUserByPhoneNo(mobileno);
      if (existingUser && existingUser.password === password) {
        // Move the user to the loggedinprisoners collection
        await PresonnerSignupDAO.moveUserToLoggedinCollection(existingUser._id);

        res.json({ status: "success", userdata: existingUser });
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}
