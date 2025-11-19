const isProd = process.env.NODE_ENV == "production";

const cookieOptions = (
  tokenType,
  path = "/",
  httpOnly = true,
  logout = false
) => {
  const tokens = {
    token: 60 * 60 * 24,
    refreshToken: 60 * 60 * 24 * 7,
  };
  return {
    maxAge: !logout ? tokens[tokenType] : 0,
    path,
    httpOnly,
    secure: isProd,
    sameSite: "lax",
  };
};

export default cookieOptions;
