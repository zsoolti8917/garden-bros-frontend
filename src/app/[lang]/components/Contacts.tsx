import React from 'react'
import Phone from './Icons/Phone'
import Link from 'next/link'
import Email from './Icons/Email'


interface ContactLink{
  url: string,
  text: string,
  type: 'tel' | 'mail' | string;

}

function ContactLinks({url, text, type}: ContactLink){
return(
  <div className='no-underline hover:underline text-white hover:text-primary-500'>
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
  

const Contacts = ({
  contactLinks
}:{
  contactLinks: Array<ContactLink>
}) => {
  return (
    
      <div className='flex gap-6'>
        {contactLinks.map((contactLink: ContactLink, index: number) => (
        <ContactLinks key={index} url={contactLink.url} text={contactLink.text} type={contactLink.type} />
        ))  
        }
      </div>
    
  )
}

export default Contacts