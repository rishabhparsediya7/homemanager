export const isAuthenticated = () => {
  try {
    if (typeof window !== undefined) {
      const user = JSON.parse(String(localStorage.getItem("user")));
      const token = JSON.parse(String(localStorage.getItem("token")));
      const loggedIn = !!String(localStorage.getItem("isLoggedIn"));
      const authorized = user && token && loggedIn;
      if (authorized) {
        return true;
      }
    }
  } catch (error) {
  }
  return false;
};
