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
  static async getUserByEmployeeIdFromLoggedinUsers(req, res, next) {
    try {
      const { employeeId } = req.query;
      if (!employeeId) {
        return res
          .status(400)
          .json({ message: "Employee ID is required in query parameters" });
      }
      const user = await SignupDAO.getUserByEmployeeIdFromLoggedinUsers(
        employeeId
      );
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "An error occurred while getting user data from loggedinUsers",
      });
    }
  }

  static async updateUserByEmployeeIdInLoggedinUsers(req, res, next) {
    try {
      const { employeeId } = req.query;
      if (!employeeId) {
        return res
          .status(400)
          .json({ message: "Employee ID is required in query parameters" });
      }
      const updatedData = req.body;
      const success = await SignupDAO.updateUserByEmployeeIdInLoggedinUsers(
        employeeId,
        updatedData
      );
      if (success) {
        res
          .status(200)
          .json({ message: "User data updated successfully in loggedinUsers" });
      } else {
        res.status(404).json({
          message:
            "User not found or unable to update user data in loggedinUsers",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "An error occurred while updating user data in loggedinUsers",
      });
    }
  }
}
