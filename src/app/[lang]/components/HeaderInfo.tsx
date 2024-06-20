import React from 'react'
import Contacts from './Contacts'
import Socials from './Socials'


const HeaderInfo = ({
  socialsText,
  socialLinks,
  contactLinks
}:{
  socialsText: any,
  socialLinks: any,
  contactLinks: any
}) => {
  return (
    <section className='bg-primary-800 w-full h-14 lg:px-10 px-4 items-center flex justify-between'>
      
        
          <Contacts
          contactLinks={contactLinks}
          />
        

  
            <Socials 
            socialsText={socialsText}
            socialLinks={socialLinks}
            />
        
      
    </section>
  )
}

export default HeaderInfo