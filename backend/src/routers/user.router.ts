import { Router } from "express";
import { sample_users } from "../data";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { User, UserModel } from "../models/user.model";
import { HTTP_BAD_REQUEST } from "../constants/http_status";
import bcrypt from "bcryptjs";
const router = Router();

router.get(
  "/seed",
  asyncHandler(async (req, res) => {
    const usersCount = await UserModel.countDocuments();
    if (usersCount > 0) {
      res.send("Seed is already done!");
      return;
    }

    await UserModel.create(sample_users);
    res.send("Seed Is Done!");
  })
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.send(generateTokenReponse(user));
    } else {
      res.status(HTTP_BAD_REQUEST).send("Username or password is invalid!");
    }
  })
);

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { name, email, password, address } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      res.status(HTTP_BAD_REQUEST).send("User already exists, please login!");
      return;
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser: User = {
      id: "",
      name,
      email: email.toLowerCase(),
      password: encryptedPassword,
      address,
      isAdmin: false,
      favorites: []
    };

    const dbUser = await UserModel.create(newUser);
    res.send(generateTokenReponse(dbUser));
  })
);

router.get('/user', asyncHandler(async (req: any, res) => {
  const user = await UserModel.findById(req.user.id);
  if (!user) {
    res.status(HTTP_BAD_REQUEST).send("User not found. Please try again!");
    return;
  }
  res.send(user);
}))

router.post(
  "/updateUser",
  asyncHandler(async (req, res) => {
    const { name, email, address } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(HTTP_BAD_REQUEST).send("User not found. Please try again!");
      return;
    }

    const dbUser = await UserModel.updateOne({email}, {name, address});
    res.send(dbUser);
  })
);

router.post(
  "/updatePass",
  asyncHandler(async (req, res) => {
    const { password, email } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(HTTP_BAD_REQUEST).send("User not found. Please try again!");
      return;
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const dbUser = await UserModel.updateOne({email}, {password: encryptedPassword});
    res.send(dbUser);
  })
);

router.post(
  "/editFavourite",
  asyncHandler(async (req: any, res) => {
    const { foodId, userId } = req.body;
    const user = await UserModel.findById(userId);

    if (!user) {
      res.status(HTTP_BAD_REQUEST).send("User not found. Please try again!");
      return;
    }

    const index = user.favorites.indexOf(foodId);
    if (index === -1) {
      user.favorites.push(foodId);
      await user.save();
    } else {
      user.favorites.splice(index, 1);
      await user.save();
    }

    res.send(user);
  })
);


const generateTokenReponse = (user: User) => {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "30d",
    }
  );

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    address: user.address,
    isAdmin: user.isAdmin,
    token: token,
  };
};

export default router;
