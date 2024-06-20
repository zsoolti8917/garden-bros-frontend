import React from 'react'
import Link from 'next/link'
import { IcBaselineFacebook } from './Icons/Facebook'
import { MdiYoutube } from './Icons/Youtube'
import Instagram from './Icons/Instagram'
import Viber from './Icons/Viber'

interface SocialLink{
  url: string,
  newTab: boolean,
  text: string,
  social: string
}

function renderSocialIcon(social: string){
  switch (social) {
    case 'FACEBOOK':
      return <IcBaselineFacebook className='text-white fill-current hover:text-primary-500' />;
    case 'INSTAGRAM':
      return <Instagram className='text-white fill-current hover:text-primary-500' />;
    case 'YOUTUBE':
      return <MdiYoutube className='text-white fill-current hover:text-primary-500' />;
    default:
      return null;
  }
}

function RenderSocialLink({url, text, social, newTab}: SocialLink){
  return(
<Link href={url} className='flex gap-2  text-white' target={newTabPrefix(newTab)}>
      {renderSocialIcon(social)}
      </Link>
  )
}

function newTabPrefix(newTab: boolean){
  return newTab ? '_blank' : '_self'
}



const Socials = (
  {
    socialsText,
    socialLinks
  }:{
    socialsText: string,
    socialLinks: Array<SocialLink>
  }
) => {
  return (
    <div className='flex gap-4'>
        <p className='text-white hidden md:block'>{socialsText}</p>
        <div className='flex gap-4 '>
          {socialLinks.map((link: SocialLink, index: number) => (
          <RenderSocialLink key={index} url={link.url} text={link.text} social={link.social} newTab={link.newTab}/>
          ))  
          }
        </div>
    </div>
  )
}

export default Socials