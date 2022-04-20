import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () => {
  //states to handle visibility of Loading Spinner and ErrorModal
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  //create an array as a REFERENCE so it wont change across render cycles
  const activeHttpRequest = useRef([]);

  const sendRequest = useCallback(
    async (url, method = 'GET', body = null, headers = {}) => {
      setIsLoading(true);

      //create an abort contoller to abort http request when needed
      const httpAbortCtrl = new AbortController();
      activeHttpRequest.current.push(httpAbortCtrl);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal, //link the abort contoller to this http request
        });

        //parsing response
        const responseData = await response.json();

        //remove the abortCtrl for the current request if it goes through without interruptions
        activeHttpRequest.current = activeHttpRequest.current.filter(
          reqCtrl => reqCtrl !== httpAbortCtrl
        );

        if (!response.ok) {
          //400'sh or 500'sh status code (isn't considered as an error, we have to throw one ourselves )
          throw new Error(responseData.message);
        }

        setIsLoading(false);
        return responseData;
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  //close ErrorModal
  const clearError = () => {
    setError(null);
  };

  //use an abort contoller from the array and abort this request if during it the component unmounts
  useEffect(() => {
    return () => {
      activeHttpRequest.current.forEach(abortCtrl => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
