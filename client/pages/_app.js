import React from 'react';

import 'bootstrap/dist/css/bootstrap.css';
import {buildClient} from '../api/build-client';
import Header from '../components/Header';

export default function AppComponent ({Component, pageProps, currentUser}) {
  return <React.Fragment>
    <Header currentUser={currentUser} />
    <Component {...pageProps} />
  </React.Fragment>;
};

AppComponent.getInitialProps = async ({Component, ctx}) => {

  const client = buildClient(ctx);
  let response = {};

  try {
    const { data } = await client.get('/api/users/currentuser');
    let pageProps = {};
    if (Component.getInitialProps)
      pageProps = await Component.getInitialProps(ctx);
    
    response = {
      ...data,
      pageProps,
    };
  } catch(err) {
    response = {...err.response?.data};
  }

  return response;
};