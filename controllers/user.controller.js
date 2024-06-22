import { User } from "../models/user.model.js";

const getMyData = async (req, res) => {
  const { googleId } = req.user;
  const user = await User.findOne({ googleId });
  if (!user) {
    return res.sendStatus(403);
  }
  res.status(200).json(user);
};

const getUser = async (req, res) => {
  const username = req.params.username;
  const user = await User.findOne({ username });

  if (!user) {
    return res.sendStatus(404);
  }
  res.status(200).json(user);
};

export { getMyData, getUser };
