import jwtDecode from "jwt-decode";
import { verify, sign } from "jsonwebtoken";

const isValidToken = (accessToken) => {
  if (!accessToken) {
    return false;
  }
  const decoded = jwtDecode(accessToken);
  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};


const setSession = (accessToken, refreshToken) => {
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    
    
  } else {
    localStorage.removeItem("accessToken");
    
  }
};

export { verify, sign, isValidToken, setSession };
