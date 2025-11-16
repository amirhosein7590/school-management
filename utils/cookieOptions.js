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
    resetToken: 60 * 10, // a reset token for access user to reset password
  };
  return {
    maxAge: !logout ? tokens[tokenType] : 0,
    path,
    httpOnly,
    secure: !isProd,
    sameSite: isProd ? "lax" : "strict",
  };
};

export default cookieOptions;
