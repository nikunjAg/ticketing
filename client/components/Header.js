import React from 'react';
import Link from 'next/link';

const Header = ({currentUser}) => {

  const links = [
    { label: 'Sign Up', href: "/auth/signup" },
    { label: 'Sign In', href: "/auth/signin" },
    { label: 'Sign Out', href: "/auth/signout", isAuthenticated: true },
  ]

  const navLinks = links
		.filter((link) => !(link.isAuthenticated ^ !!currentUser))
		.map(({href, label}) => (
      <li key={label} className="nav-item">
        <Link href={href}>
          <a className="nav-link">{label}</a>
        </Link>
      </li>
		));

  return (
		<nav className="navbar navbar-light bg-light px-3 mb-3">
			<Link href="/">
				<a className="navbar-brand">
					<h4>
            GitTix
          </h4>
				</a>
			</Link>
			<div className="d-flex justify-content-end">
				<ul className="nav d-flex align-items-center">{navLinks}</ul>
			</div>
		</nav>
  );
}

export default Header;