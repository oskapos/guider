import React, { useEffect, useState } from 'react';

import UsersList from '../components/UsersList';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Users = () => {
  //utilizing custom http hook
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  //state where we'll store data coming from backend
  const [loadedUsers, setLoadedUsers] = useState();

  useEffect(() => {
    //GET HTTP REQUEST
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + '/users'
        );

        //load response data to state
        setLoadedUsers(responseData.users);
      } catch (err) {
        //handled in the custom hook
      }
    };
    fetchUsers();
  }, [sendRequest]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </>
  );
};

export default Users;
