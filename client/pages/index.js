import React from 'react';

import {buildClient} from '../api/build-client';

const Home = ({currentUser}) => {
  return currentUser ? <h1>Welcome Back</h1> : <h1>Home Page</h1>
};

Home.getInitialProps = async (ctx) => {

  const client = buildClient(ctx);
  let response = {};

  try {
    const { data } = await client.get('/api/users/currentuser');
    response = {
      ...data,
    };
  } catch(err) {
    console.log(err);
    response = {...err.response?.data};
  }

  return response;
};

export default Home;