import React from 'react'
import Phone from './Icons/Phone'
import Link from 'next/link'
import Email from './Icons/Email'
const Contacts = () => {
  return (
    <div className='flex gap-6'>
      <div className='no-underline hover:underline text-white hover:text-primary-500'>
      <Link href={"+421915443951"} className='flex gap-2  '>
      <Phone className=' fill-current' />
      <p className='hidden md:block'>+421 915 443 951</p>
      </Link>
      </div>
      <div className='no-underline hover:underline text-white hover:text-primary-500'>
      <Link href={"test@test.com"} className='flex gap-2  '>
      <Email className=' fill-current ' />
      <p className='hidden md:block'>test@test.com</p>
      </Link>
      </div>
    </div>
  )
}

export default Contacts