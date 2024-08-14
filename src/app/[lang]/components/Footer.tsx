import React from 'react'
import Contacts from './Contacts';
import Socials from './Socials';
import Image from 'next/image';
import { getStrapiMedia } from '../utils/api-helpers';
import GoogleMapsEmbed from '../utils/GoogleMapsEmbedd';
import Link from 'next/link';

const Footer = ({footerAdresa, footerSocials, footerContacts, footerSluzby, footerRo, footerKategorie, socialText, footerMap, roTitle}:{
  footerAdresa: any,
  footerSluzby: any,
  footerSocials: any,
  footerContacts: any,
  footerRo: any,
  footerKategorie: any,
  socialText: any,
  footerMap: any,
  roTitle: any
}) => {
 // Replace with your map URL

  return (
    <section className='bg-primary-700 py-10 text-white'>
      <div className='px-4 w-full gap-6 gap-y-10 flex flex-wrap justify-between max-w-container md:px-8 text-center md:text-left'>
        <div className='flex flex-col gap-2 lg:min-w-[360px] min-w-[260px] items-center md:items-baseline md:justify-start md:text-left mx-auto md:mx-0'>
          <h2 className='text-3xl font-bold pb-2'>{footerAdresa.header}</h2>
          <p className=''>{footerAdresa.adresa}</p>
          <Contacts contactLinks={footerContacts}/>
          <Socials 
          socialLinks={footerSocials}
          socialsText={socialText}
          />
        </div>


        <div className='flex flex-col gap-4 lg:min-w-[360px] min-w-[260px] mx-auto md:mx-0'>
          <h2 className='text-3xl font-bold'>{footerSluzby.header}</h2>
          <ul className='flex flex-col gap-2'>
            {footerSluzby.categories.data.slice(0,5).map((category: any, index: number) => (
              <li key={index}>
                <Link href={`/blog/${category.attributes.slug}`} className='text-white transition transform hover:scale-105 hover:text-green-500 max-w-min cursor-pointer'>
                {category.attributes.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>


        <div className='flex flex-col gap-4 lg:min-w-[360px] min-w-[260px] mx-auto md:mx-0'>
            <h2 className='text-3xl font-bold'>{roTitle}</h2>
            <ul className='flex flex-col gap-2'>
              {footerRo.map((item: any, index: number) => (
                <li key={index} >
                          <Link href={item.url} className='text-white transition transform hover:scale-105 hover:text-green-500 max-w-min cursor-pointer'>{item.text}</Link>
                </li>
              ))}
            </ul>

        </div>


        <div className='lg:min-w-[360px] flex-grow min-w-[260px] mx-auto md:mx-0'>
        <GoogleMapsEmbed mapUrl={footerMap} />


        </div>
      </div>
    </section>
  )
  
}

export default Footer