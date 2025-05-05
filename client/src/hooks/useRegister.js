import useAuthStore from "@/store/useAuthStore";
import axios from "axios";

export const useRegister = () => {
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);

  const register = async (data, setApiError) => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    try {
      const response = await axios.post(`${apiBaseUrl}/auth/register`, data);
      const token = response.data.token;

      setToken(token);

      const user = await axios.get(`${apiBaseUrl}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(user);
      setIsLoggedIn(true);
      window.location.href = "/";

      return { success: true };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Registration failed:",
          error.response?.data?.message || error.message
        );
        console.error("Error details:", error.response?.data?.errors);
        setApiError(
          error.response?.data?.errors || [{ message: error.message }]
        );
      } else {
        console.error("Unexpected error:", error);
        setApiError([
          { message: "An unexpected error occurred. Please try again." },
        ]);
      }
      return { success: false, error };
    }
  };

  return { register };
};
