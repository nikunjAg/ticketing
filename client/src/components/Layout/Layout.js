import React from 'react'
import Header from './Header'
import { Fab } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/router';

import classes from './layout.module.css';

const Layout = (props) => {

  const router = useRouter();

  return (
    <>
      <Header />
      <main>
        {props.children}
        <Fab
          className={classes.createTicketFab}
          style={{ backgroundColor: 'var(--primary-color)', color: '#fff' }}
          aria-label="add"
          onClick={() => router.push("/tickets/new")}
        >
          <AddIcon />
        </Fab>
      </main>
    </>
  );
}

export default Layout