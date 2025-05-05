import useAuthStore from "@/store/useAuthStore";
import axios from "axios";

export const useLogin = () => {
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);
  const login = async (data, setApiError) => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    try {
      const response = await axios.post(`${apiBaseUrl}/auth/login`, data);
      const token = response.data.token;
      setToken(response.data.token);

      const user = await axios.get(`${apiBaseUrl}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(user);

      window.location.href = "/";

      // toast.success("Login successful! Redirecting to home...");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error);
        setApiError(error.response?.data.error || error.message);
      } else {
        console.error("Unexpected error:", error);
        setApiError([
          {
            message: error,
          },
        ]);
      }
    }
  };
  return { login };
};
