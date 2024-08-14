import React from 'react'

const FooterInfo = ({footerInfo, footerLinks} : {footerInfo : any, footerLinks: any}) => {
  return (
    <section className='bg-primary-800 w-full min-h-16 py-4 h-auto lg:px-10 px-4 text-white  flex  flex-wrap items-center lg:justify-between lg:text-left justify-center text-center gap-2'>
        <div className='min-w-[350px]'>
        <p>{footerInfo.companyName}, všetky práva vyhradené</p>
    <div className='flex gap-2 justify-center items-center lg:justify-start lg:items-start'>
    {footerLinks.map((link: any, index: number) => (
          <a key={index} href={link.url} target="_blank" rel="noreferrer" ><p className="transition transform hover:scale-105 mx-auto lg:mx-0 hover:text-green-500">{link.text}</p></a>
        ))}
    </div>
        
        </div>
        
        <p className='min-w-[350px]'>Navrhol a vytvoril Zsolt Varjú</p>
        <div className='flex min-w-[350px] flex-wrap justify-center items-center md:justify-start md:items-start'>
        <div className='pr-4'>Odkazy na autora:</div>
        <div className='flex gap-4 px-2 md:px-0'>
        <a href="https://www.linkedin.com/in/zsolt-varju-1a1b1a1b1/" target="_blank" rel="noreferrer" className="transition transform hover:scale-105 hover:text-green-500">LinkedIn</a>
<a href="" target="_blank" rel="noreferrer" className="transition transform hover:scale-105 hover:text-green-500">GitHub</a>
<a href="" target="_blank" rel="noreferrer" className="transition transform hover:scale-105 hover:text-green-500">Portfolio</a>

          
        </div>
        </div>
        
      
    </section>
  )
}

export default FooterInfo