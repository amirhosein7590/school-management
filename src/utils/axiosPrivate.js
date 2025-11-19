import axios from "axios";

const axiosPrivate = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

axiosPrivate.interceptors.response.use(
  (res) => res,
  async (error) => {
    try {
      const originalReq = error.config;
      const { status } = error.response;
      if (status == 401 && !originalReq?._retry) {
        originalReq._retry = true;
        await axios.post("http://localhost:3000/api/auth/refresh");
        return axiosPrivate(originalReq);
      }
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
    return Promise.reject(error);
  }
);

export default axiosPrivate;
