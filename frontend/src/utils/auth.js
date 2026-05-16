export const saveAuthData = ({ token, user }) => {
  localStorage.setItem("auth_token", token);
  localStorage.setItem("auth_user", JSON.stringify(user));
  localStorage.setItem("auth_role", user?.role || "");
};

export const getAuthToken = () => {
  return localStorage.getItem("auth_token");
};

export const getAuthUser = () => {
  const user = localStorage.getItem("auth_user");

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
};

export const getAuthRole = () => {
  return localStorage.getItem("auth_role");
};

export const isLoggedIn = () => {
  return Boolean(getAuthToken());
};

export const logout = () => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_user");
  localStorage.removeItem("auth_role");
  localStorage.removeItem("otp_email");
};