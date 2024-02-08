import LoginDAO from "../dao/loginDAO.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export async function login(req, res) {
  const { employeeid, password } = req.body;

  try {
    const user = await LoginDAO.getUserByEmailAndPassword(employeeid, password);
    if (user) {
      const secretKey = crypto.randomBytes(32).toString("hex");
      const jwtToken = jwt.sign(
        { id: user.id, employeeid: user.employeeid },
        secretKey
      );
      res.status(200).json({
        id: user.id,
        employeeid: user.employeeid,
        role: user.role,
        fname: user.fname,
        lname: user.lname,
        mobileno: user.mobileno,
        section: user.section,
        token: jwtToken,
      });
    } else {
      res.status(401).json({
        message: "Invalid employeeid or password",
      });
    }
  } catch (error) {
    console.error("Error logging in:", error); // Log the specific error
    res.status(500).json({
      message: "An error occurred while logging in",
    });
  }
}
