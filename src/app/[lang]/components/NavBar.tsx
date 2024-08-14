"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { SolarHamburgerMenuOutline } from "./Icons/Hamburger";
import { MaterialSymbolsClose } from "./Icons/Close";
import Logo from "./Logo";
import AIButton from './AIButton';

interface NavLink {
  id: number;
  url: string;
  newTab: boolean;
  text: string;
}

interface CtaButton {
  id: number;
  url: string;
  newTab: boolean;
  text: string;
  type: 'primary' | 'secondary';
}

const NavBar = ({
  logoUrl,
  logoLink,
  logoText,
  ctaButton,
  navLinks,
}: {
  navLinks: Array<NavLink>;
  ctaButton: CtaButton;
  logoText: string;
  logoUrl: string;
  logoLink: string;
}) => {
  const [open, setOpen] = useState(false);

  const handleLinkClick = () => {
    setOpen(false);
  };
  return (
    <>
      {/* Spacer to prevent content from shifting */}
      <div className='sticky top-0 z-50 bg-primary-700 shadow-md'>
        {/* Overlay */}
        <div
          className={`${open ? 'fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-10' : 'hidden'}`}
          onClick={() => setOpen(false)}
        ></div>

        <div className='md:flex items-center justify-between px-4 max-w-container m-auto md:px-8'>
          <div className='font-bold text-xl cursor-pointer flex items-center text-white'>
            <Link href='/' onClick={handleLinkClick}>
              <Logo logoUrl={logoUrl} logoText={logoText}>
                {logoText && <h2 className="text-white">{logoText}</h2>}
              </Logo>
            </Link>
          </div>

          <div
            onClick={() => setOpen(!open)}
            className='text-3xl z-30 absolute right-8  top-8 cursor-pointer  md:hidden text-white'
          >
            {open ? <MaterialSymbolsClose className='text-white' /> : <SolarHamburgerMenuOutline className='text-white' />}
          </div>

          <ul
            className={`md:flex md:gap-8 md:items-center md:justify-center pt-16 md:pt-0 md:flex-row md:pb-0 pb-12 fixed md:static bg-primary-700 md:z-auto z-20 top-0 ${open ? 'right-0 h-screen pt-24' : 'md:h-auto h-screen -right-full'} w-[75%] md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in-out`}
          >
 {navLinks.map((link: NavLink) => {
              // Adjust link.url if needed (e.g., add locale prefix)
              return (
                <li 
                  key={link.id} 
                  className={`text-lg md:my-0 my-7 pb-6 md:pb-0 transition transform hover:scale-105 text-white hover:text-green-500 `}
                >
                  <Link 
                    href={link.url} 
                    className='block'
                    onClick={handleLinkClick}
                  >
                    {link.text}
                  </Link>
                </li>
              );
            })}
            <li className='text-lg'>
            <AIButton 
                url={ctaButton.url}
                newTab={ctaButton.newTab}
                type={ctaButton.type}
                name={ctaButton.text}
                onClick={handleLinkClick} // Close the menu on CTA button click
              />
            </li>
          </ul>
        </div>
      </div>
      {/* The rest of the page content */}
      {/* Add a placeholder to ensure layout consistency */}
      <div style={{ height: 'var(--navbar-height)' }}></div>
    </>
  );
}

export default NavBar;
