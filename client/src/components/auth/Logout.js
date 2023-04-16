import React, { useCallback, useEffect } from 'react'
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

const Logout = () => {

  const router = useRouter();

  const logoutUser = useCallback(async () => {
    const response = await signOut({
      callbackUrl: "/auth/login",
      redirect: false,
    });

    router.replace(response.url);
  }, [router]);

  useEffect(() => {
    logoutUser();
  }, [logoutUser]);

  return null;
}

export default Logout;