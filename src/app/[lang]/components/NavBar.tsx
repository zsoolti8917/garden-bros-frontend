"use client";


import React from 'react'
import Link from "next/link";
import { useState } from "react";
import {SolarHamburgerMenuOutline} from "./Icons/Hamburger"
import {MaterialSymbolsClose} from "./Icons/Close"
import Image from 'next/image';
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
  let [open, setOpen] = useState(false);

  return (
    <div className='shadow-md w-full bg-primary-700 z-50'>
    {/* Overlay */}
    <div className={`${open ? 'inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-10' : 'hidden'}`} onClick={() => setOpen(false)}></div>

    
    <div className='md:flex relative items-center justify-between px-4 py-4 md:px-0 max-w-container m-auto md:px-8'>
      <div className='font-bold text-2xl cursor-pointer flex items-center 
      text-primary-100'>
        <Link href='/'> 
        <Logo logoUrl={logoUrl} logoText={logoText} logoLink={logoLink}>
  {logoText && <h2 className="sm:w-[240px] w-[180px]">{logoText}</h2>}
</Logo>
        </Link>
      </div>

      <div onClick={() => setOpen(!open)} className='text-3xl z-30 absolute right-8 sm:top-9 top-6 cursor-pointer md:hidden'>
      <div>
          {open ? <MaterialSymbolsClose className='text-primary-100' /> : <SolarHamburgerMenuOutline className='text-primary-100' />}
        </div> 
      </div>

      <ul className={`md:flex md:gap-8 md:items-center md:justify-center pt-16 md:pt-0 md:flex-row md:pb-0 pb-12 fixed md:static bg-primary-700 md:z-auto z-20 h-full md:h-auto top-0 ${open ? 'right-0' : '-right-full'} w-[75%] md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in-out`}>
        {
          navLinks.map((link: NavLink) => (
            <li key={link.id} className='text-xl md:my-0 my-7 pb-6 md:pb-0'>
              <Link href={link.url} className='text-primary-100 hover:text-primary-300 duration-500'>{link.text}</Link>
            </li>
          ))
        }
        <Link href='/contact'>
        
          Kontaktujte&nbsp;nás
        
        </Link>
      </ul>
    </div>
    
  </div>
  )
}

export default NavBar