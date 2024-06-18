import React from 'react'
import Link from 'next/link'
import { IcBaselineFacebook } from './Icons/Facebook'
import Instagram from './Icons/Instagram'
import Viber from './Icons/Viber'

const Socials = () => {
  return (
    <div className='flex gap-4'>
        <p className='text-white hidden md:block'>Follow Us:</p>
        <div className='flex gap-4 '>
        <Link href={"facebook"} className='flex gap-2  text-white'>
      <IcBaselineFacebook className='text-white fill-current hover:text-primary-500' />
      </Link>

      <Link href={"facebook"} className='flex gap-2  text-white '>
      <Instagram className='text-white fill-current hover:text-primary-500' />
      </Link>

      <Link href={"facebook"} className='flex gap-2  text-white '>
      <Viber className='text-white fill-current hover:text-primary-500' />
      </Link>
        </div>
    </div>
  )
}

export default Socials