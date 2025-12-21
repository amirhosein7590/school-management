const { default: axios } = require("axios");

const axiosPublic = axios.create({
  baseURL: "http://localhost:3001/api",
});

export default axiosPublic;
