import React from 'react'
import Contacts from './Contacts'
import Socials from './Socials'
const HeaderInfo = () => {
  return (
    <section className='bg-primary-800 w-full h-14 lg:px-10 px-4 items-center flex justify-between'>
      
        
          <Contacts />
        

  
          <Socials />
        
      
    </section>
  )
}

export default HeaderInfo