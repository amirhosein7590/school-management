const isProd = process.env.NODE_ENV == "production";

const cookieOptions = (
  tokenType,
  path = "/",
  httpOnly = true,
  logout = false
) => {
  return {
    maxAge: !logout
      ? tokenType == "token"
        ? 60 * 60 * 24
        : 60 * 60 * 24 * 7
      : 0,
    path,
    httpOnly,
    secure: !isProd,
    sameSite: isProd ? "lax" : "strict",
  };
};

export default cookieOptions;
