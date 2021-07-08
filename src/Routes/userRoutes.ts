import { Router } from "express";

import UserValidation from "../middlewares/UserMiddleware";
import UserController from "../controllers/UserController";
import verifyToken from "../middlewares/JWTMiddleware";

const UserRoutes = Router();

// middleware of the users
const userValidation = new UserValidation();

// controllers of the user's routes
const userController = new UserController();

UserRoutes.post(
  "/register",
  userValidation.passedCrendentials,
  userController.createUser
);

// route that gonna send all the users of the app
UserRoutes.get("/user", userController.getAllUsers);

// route that gonna create a new user
UserRoutes.post(
  "/register",
  userValidation.passedCrendentials,
  userController.createUser
);

UserRoutes.post(
  "/login",
  userValidation.passedCrendentials,
  userController.login
);

UserRoutes.post(
  "/test",
  userValidation.passedCrendentials,
  verifyToken,
  userController.teste
);

// class UserRoutes {}

export default UserRoutes;