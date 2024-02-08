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

export async function updateUser(req, res) {
  try {
    const { employeeId } = req.params; // Assuming userId is passed as a URL parameter
    const updatedData = req.body; // Updated user data from request body

    const success = await UsersDAO.updateUser(employeeId, updatedData);
    if (success) {
      res.status(200).json({ message: "User data updated successfully" });
    } else {
      res
        .status(404)
        .json({ message: "User not found or unable to update user data" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while updating user data" });
  }
}
