import axios from "axios";
import decode from "jwt-decode";

const instance = axios.create({
  baseURL: "http://localhost:4000/",
});

const queryInstance = axios.create({
  baseURL: "http://localhost:4000/",
});

instance.interceptors.request.use(async (config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return config;
  const decoded = decode(user.payload.accessToken);
  config.headers.authorization = `Bearer ${user.payload.accessToken}`;
  if (decoded.exp * 1000 <= new Date()) {
    // Get new access token by sending request refresh_token endpoint
    const { data } = await axios.post("http://localhost:4000/refresh_token", {
      token: user.payload.refreshToken,
    });
    const payload = {
      ...user.payload,
      accessToken: data?.accessToken,
      refreshToken: data?.refreshToken,
    };
    localStorage.setItem("user", JSON.stringify({ payload }));
    config.headers.authorization = `Bearer ${data.accessToken}`;
    return config;
  }
  return config;
});

export { queryInstance };
export default instance;
