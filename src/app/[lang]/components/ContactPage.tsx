import React from 'react'
import Phone from './Icons/Phone'
import Link from 'next/link'
import Email from './Icons/Email'
import { IcBaselineFacebook } from './Icons/Facebook'
import { MdiYoutube } from './Icons/Youtube'
import Instagram from './Icons/Instagram'

interface ContactLink{
  url: string,
  text: string,
  type: 'tel' | 'mail' | string;

}

interface SocialLink{
  url: string,
  newTab: boolean,
  text: string,
  social: string
}

function renderSocialIcon(social: string){
  switch (social) {
    case 'FACEBOOK':
      return <IcBaselineFacebook className='text-black fill-current hover:text-primary-500' />;
    case 'INSTAGRAM':
      return <Instagram className='text-black fill-current hover:text-primary-500' />;
    case 'YOUTUBE':
      return <MdiYoutube className='text-black fill-current hover:text-primary-500' />;
    default:
      return null;
  }
}

function RenderSocialLink({url, text, social, newTab}: SocialLink){
  return(
<Link href={url} className='flex gap-2  text-black' target={newTabPrefix(newTab)}>
      {renderSocialIcon(social)}
      <p>{text}</p>
      </Link>
  )
}

function newTabPrefix(newTab: boolean){
  return newTab ? '_blank' : '_self'
}

function ContactLinks({url, text, type}: ContactLink){
  return(
    <div className='no-underline hover:underline text-black hover:text-primary-500'>
  <Link href={preLink(type,url)} className='flex gap-2  '>
        {RenderIcons({type})}
        <p className='hidden md:block'>{text}</p>
        </Link>
        </div>
  )
  }
  
  function RenderIcons({type}: {type: String | undefined}){
    switch (type) {
      case 'tel':
        return <Phone className=' fill-current' />;
      case 'email':
        return <Email className=' fill-current' />;
      default:
        return null;
    }
  }
  
  const preLink = (type: string, url: string): string => {
    switch (type) {
      case 'tel':
        return `tel:${url}`;
      case 'email':
        return `mailto:${url}`;
      default:
        return url;
    }
  };


const ContactPage = ({data}: any) => {
  console.log(data);
  return (
    <section>
      <div>
        <div>
          <div>
            <h2>{data.header}</h2>
            <p>{data.description}</p>
            <p>{data.adresa}</p>
            <p>{data.ico}</p>
            <p>{data.dic}</p>
          </div>
        <div>
          {data.contacts.map((contact: any, index: number) => (
            <ContactLinks key={index} url={contact.url} text={contact.text} type={contact.type} />
          ))}
        </div>

        <div>
          <p>{data.socialsText}</p>
          {data.socials.map((social: any, index: number) => (
            <RenderSocialLink key={index} url={social.url} text={social.text} social={social.social} newTab={social.newTab}/>
          ))}
        </div>
        </div>


        <div>

        </div>
      </div>
    </section>
  )
}

export default ContactPage