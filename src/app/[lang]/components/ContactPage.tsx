import React from 'react'
import Phone from './Icons/Phone'
import Link from 'next/link'
import Email from './Icons/Email'
import { IcBaselineFacebook } from './Icons/Facebook'
import { MdiYoutube } from './Icons/Youtube'
import Instagram from './Icons/Instagram'
import ContactForm from './ContactForm'
import { getStrapiMedia } from '../utils/api-helpers'
import Image from 'next/image'
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
<Link href={url} className='flex gap-2 pb-2 hover:text-primary-500 text-black' target={newTabPrefix(newTab)}>
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
  <Link href={preLink(type,url)} className='flex gap-2 pb-2  '>
        {RenderIcons({type})}
        <p className=''>{text}</p>
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
  const imgUrl = getStrapiMedia(data.image.data.attributes.url);

  return (
    <section className='h-full pb-20 pt-10 '>
      <div className='max-w-[1440px] pt-10 px-6 sm:px-10 pb-20 mx-auto grid grid-flow-row grid-cols-1 md:grid-cols-3 gap-y-16 md:gap-x-8'>
      
          <div className='md:col-span-2'>
            <h2 className='text-6xl font-bold text-primary-700 pb-8'>{data.title}</h2>
            <p className=''>{data.description}</p>

          </div>
          
            <Image src={imgUrl || ""} alt={data.image.data.attributes.alt} width={256} height={256} className='place-self-center self-center hidden md:block '/>
          

        


        <div className='md:col-span-2 md:row-start-2'>
          <ContactForm />
        </div>

        <div className='md:col-span-1 md:row-span-2 self-start md:pl-4'>
          <div className=' pb-10'>
            <p className='text-2xl font-bold text-primary-700 pb-2'>{data.headerAdresa}</p>
          <p>{data.adresa}</p>
            <p>{data.ico}</p>
            <p>{data.dic}</p>
          </div>
        <div className='pb-10'>
          <p className='text-2xl font-bold text-primary-700 pb-2'>{data.headerPhone}</p>
          {data.contacts.map((contact: any, index: number) => (
            <ContactLinks key={index} url={contact.url} text={contact.text} type={contact.type} />
          ))}
        </div>

        <div>
          <p className='text-2xl font-bold text-primary-700 pb-2'>{data.socialsText}</p>
          {data.socials.map((social: any, index: number) => (
            <RenderSocialLink key={index} url={social.url} text={social.text} social={social.social} newTab={social.newTab}/>
          ))}
        </div>
        </div>
      </div>
    </section>
  )
}

export default ContactPage
