import React, { useEffect } from 'react';
import Router from 'next/router';

import { useRequest } from '../../hooks/use-request';

const signout = () => {
  const [errors, sendRequest] = useRequest({ url: "/api/users/signout", method: "POST", body: {} });

  useEffect(() => {
    const signOutUser = async () => {
      return await sendRequest();
    };

    signOutUser()
      .then(response => {
        if (response && response.status === 200) {
          Router.push("/");
        }
      })

  }, []);

  return errors;
}

export default signout;