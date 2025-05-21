const AuthService = {
  login: async (email, password) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  },

  register: async (email, password, role) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Error during registration:", error);
      throw error;
    }
  },
};

export default AuthService;
