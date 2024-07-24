import React from 'react'

const FooterInfo = ({footerInfo, footerLinks} : {footerInfo : any, footerLinks: any}) => {
  return (
    <section className='bg-primary-800 w-full h-16 lg:px-10 px-4 text-white items-center flex justify-between'>
        <div>
        <p>{footerInfo.companyName}, všetky práva vyhradené</p>
    <div className='flex gap-2'>
    {footerLinks.map((link: any, index: number) => (
          <a key={index} href={link.url} target="_blank" rel="noreferrer" ><p className="transition transform hover:scale-105 hover:text-green-500">{link.text}</p></a>
        ))}
    </div>
        
        </div>
        
        <p>Navrhol a vytvoril Zsolt Varjú</p>
        <div className='flex '>
        <div className='pr-4'>Odkazy na autora:</div>
        <div className='flex gap-4'>
        <a href="https://www.linkedin.com/in/zsolt-varju-1a1b1a1b1/" target="_blank" rel="noreferrer" className="transition transform hover:scale-105 hover:text-green-500">LinkedIn</a>
<a href="" target="_blank" rel="noreferrer" className="transition transform hover:scale-105 hover:text-green-500">GitHub</a>
<a href="" target="_blank" rel="noreferrer" className="transition transform hover:scale-105 hover:text-green-500">Portfolio</a>

          
        </div>
        </div>
        
      
    </section>
  )
}

export default FooterInfo