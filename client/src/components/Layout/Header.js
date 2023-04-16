import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import clsx from 'clsx'

import classes from './layout.module.css';

const links = [
  { path: '/auth/login', name: "Login", checkAuth: true, authenticated: false },
  { path: '/auth/signup', name: "Sign Up", checkAuth: true, authenticated: false },
  { path: '/tickets/all', name: "Tickets" },
  { path: '/auth/logout', name: "Logout", checkAuth: true, authenticated: true },
]

const Header = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  let isAuthenticated = false;
  if (status === 'authenticated' && session) {
    isAuthenticated = true;
  }

  return (
    <header>
      <div className={classes.header}>
        <div className={classes.logo}>Ticketing</div>
        <nav className={classes.nav}>
          <ul className={classes.ul}>
            {
              links
              .filter(link => !link.checkAuth || link.authenticated === isAuthenticated)
              .map((link) => (
                <li key={link.path}>
                  <Link
                    className={clsx(
                      router.pathname === link.path && classes.activeLink,
                      classes.link
                    )}
                    href={link.path}
                  >
                    {link.name}
                  </Link>
                </li>
              ))
            }
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;