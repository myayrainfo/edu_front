import api from "./axiosClient.js";

export default {
  login(payload) {
    return api.post("/auth/login", payload);
  },
  logout() {
    return api.post("/auth/logout");
  },
};
