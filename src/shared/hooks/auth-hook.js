import { useState, useEffect, useCallback } from 'react';

let logoutTimer;

export const useAuth = () => {
  //context state and handlers
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(false);

  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);
    //token expiration date: first login => new one is created and stored
    //                       not first time => forward the original date and store it
    const tokenExpirationDate = //this is not the state!
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    //saving the userId and his token in localstorage to keep him logged in across sessions
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    localStorage.removeItem('userData'); //clear token
  }, []);

  //Auto logout  when token expires
  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  //will run only when component mounts, will autoLogin the user with his token from localStorage
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date() //still has time
    ) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration) // forwared the date
      );
    }
  }, [login]);

  return { token, login, logout, userId };
};
