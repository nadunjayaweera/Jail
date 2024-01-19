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
