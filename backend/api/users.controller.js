import UsersDAO from "../dao/usersDAO.js";

export async function getUsers(req, res) {
  try {
    const users = await UsersDAO.getUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while getting users",
    });
  }
}

export async function getUserDetails(req, res) {
  try {
    const { employeeId } = req.query;
    if (!employeeId) {
      return res
        .status(400)
        .json({ message: "Employee ID is required in query parameters" });
    }

    const userDetails = await UsersDAO.getUserDetails(employeeId);

    if (!userDetails) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(userDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while getting user details",
    });
  }
}
