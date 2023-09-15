import jwtDecode from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";
import { isValidToken } from "./jwt";

/**
 * @typedef {Object} TAuth
 * @property {string} token
 * @property {boolean} pendingAuth
 * @property {boolean} isAuthenticated
 * @property {(accessToken: string) => void} authenticate
 */

/**
 * @type {React.Context<TAuth>}
 */
const Context = createContext();

const AuthProvider = ({ children }) => {
  const [pendingAuth, setPendingAuth] = useState(true);
  const [token, setToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [refreshToken, setRefreshToken] = useState("");
 
  // Authenticate Users
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    if (token ) {
      setRefreshToken(refreshToken);
      setToken(token);
      try {
        const payload = jwtDecode(token);
        setIsAuthenticated(Boolean(payload && isValidToken(token)));
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setPendingAuth(false);
      }
    } else {
      setPendingAuth(false);
      setIsAuthenticated(false);
    }
  }, []);

  const authenticate = (accessToken, refreshAccessToken) => {
    
    try {
      console.log(" auth is " + accessToken)
      isValidToken(accessToken);
      setToken(accessToken);
      isValidToken(refreshAccessToken);
      setRefreshToken(refreshAccessToken);
      setIsAuthenticated(true);
    } catch (error) {
      setToken("");
      setIsAuthenticated(false);
    }
  };

  return (
    <Context.Provider
      value={{ token, refreshToken, origin, pendingAuth, isAuthenticated, authenticate }}
    >
      {children}
    </Context.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(Context);

  if (!context) {
    throw new Error(`useAuth() was called outside a AuthProvider`);
  }

  return context;
};

export default AuthProvider;
