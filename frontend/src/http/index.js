import axios, { Axios } from "axios";
const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const sendOtp = (data) => api.post("/auth/send-otp", data);
export const verifyOtp = (data) => api.post("/auth/verify-otp", data);
export const activateAccount = (data) => api.post("/auth/activate", data);
export const logout = () => api.post("/auth/logout");

export const createroom = (data) => api.post("/rooms", data);
export const getAllRooms = () => api.get("/rooms");
export const getRooms = (roomid) => api.get(`/rooms/${roomid}`);

// interceptors
api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      originalRequest &&
      !originalRequest._isRetry
    ) {
      originalRequest._isRetry = true;
      try {
        await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/refresh`, {
          withCredentials: true,
        });

        return api.request(originalRequest);
      } catch (error) {
        console.log(error.message);
      }
    }
    throw Error();
  }
);

export default api;
