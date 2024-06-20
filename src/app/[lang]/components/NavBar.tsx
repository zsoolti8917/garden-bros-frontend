"use client";


import React from 'react'
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

import Logo from "./Logo"

interface NavLink{
  id: number,
  url: string,
  newTab: boolean,
  text: string,
}

interface CtaButton{
  id: number,
  url: string,
  newTab: boolean,
  text: string,
  type: string,
}

interface MobileNavLink extends NavLink{
  closeMenu: () => void;
}

function NavLink({ url, text }: NavLink) {
  const path = usePathname();

  return (
    <li className="flex">
      <Link
        href={url}
        className={`flex items-center mx-4 -mb-1 border-b-2 dark:border-transparent ${
          path === url && "dark:text-violet-400 dark:border-violet-400"
        }}`}
      >
        {text}
      </Link>
    </li>
  );
}
function MobileNavLink({ url, text, closeMenu }: MobileNavLink) {
  const path = usePathname();
  const handleClick = () => {
    closeMenu();
  };
  return (
    <a className="flex">
      <Link
        href={url}
        onClick={handleClick}
        className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-100 hover:bg-gray-900 ${
          path === url && "dark:text-violet-400 dark:border-violet-400"
        }}`}
      >
        {text}
      </Link>
    </a>
  );
}



const NavBar = (
  {
    logoUrl,
    logoLink,
    logoText,
    ctaButton,
    navLinks,
    
  }:{
    navLinks: Array<NavLink>;
    ctaButton: CtaButton;
    logoText: string;
    logoUrl: string;
    logoLink: string;
  }
) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const closeMenu = () => {
    setMobileMenuOpen(false);
  };
  return (
    <div>
      <Logo 
      logoUrl={logoUrl}
      logoText={logoText}
      logoLink={logoLink}
      />
      
      <nav>
        <ul>
          {navLinks.map((navLink: any) => (
            <li key={navLink.id}>
              <a href={navLink.url}>{navLink.text}</a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default NavBar