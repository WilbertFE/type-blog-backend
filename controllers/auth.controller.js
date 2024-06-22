const isLoggedIn = (req, res, next) => {
  req.user
    ? next()
    : res.status(401).json({ errors: [{ msg: "Not Authorized" }] });
};

export { isLoggedIn };
