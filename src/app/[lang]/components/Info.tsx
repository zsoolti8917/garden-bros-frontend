import React from 'react'
import { getStrapiMedia } from '../utils/api-helpers';
import Image from 'next/image';
import Link from 'next/link';
import AIButton from './AIButton';
interface Picture {
  data: {
    id: string;
    attributes: {
      url: string;
      name: string;
      alternativeText: string;
    };
  };
}

interface Feature {
  id: string;
  title: string;
  description: string | null;
  icon: Icon;
}

interface Icon {
  data: {
    id: string;
    attributes: {
      url: string;
      alternativeText: string;
      caption: null | string;
      width: number;
      height: number;
    };
  };
}

interface Button {
  id: string;
  url: string;
  text: string;
  type: 'primary' | 'secondary';
  newTab: boolean;
}

interface InfoProps {
  data: {
    id: string;
    title: string;
    description: string;
    picture: Picture;
    rok: string;
    smallText: string;
    header: string;
    button: Button;
    features: Feature[];
  }
}

function Feature({title,description,icon}: Feature) {
  const imgUrl = getStrapiMedia(icon.data.attributes.url);
  return (
    <div className="p-8 flex-col gap-4 ">
      <div>
        <Image src={imgUrl || ""} alt={icon.data.attributes.alternativeText || "icon"} width={42} height={42} className='z-20' />
      
      </div>

      <div>
        <h3 className="mb-2 text-xl font-bold text-primary-700">{title}</h3>
        <div className="text-sm">{description}</div>
      </div>
    </div>
  )
}

const Info = ({data}: InfoProps) => {
  return (
    <section className='max-w-[1110px] mb-16 mx-auto px-2 grid grid-cols-3 gap-10 justify-between pt-[120px] sm:pt-[150px] md:pt-[250px] lg:pt-0'>


      <div className='grid gap-10 grid-cols-2 w-full lg:col-span-2 col-span-3'>
        <Image 
        
          src={getStrapiMedia(data.picture.data.attributes.url) || ""} 
          alt={data.picture.data.attributes.alternativeText || "image"} 
          width={250}
          height={370}
          className='rounded-xl w-full h-full min-w-[300px] max-w-[400px] col-span-2 md:col-span-1 mx-auto md:mx-0'
        />
        <div className='flex flex-col gap-4 justify-center items-center text-center md:text-left md:items-start col-span-2 md:col-span-1'>
        <p className='text-7xl font-bold text-primary-500'>{data.rok}</p>

        <p className='text-primary-500'>{data.smallText}</p>
        <h3 className='text-primary-700 text-3xl font-bold'>{data.header}</h3>

        <p>{data.description}</p>
        <AIButton 
          url={data.button.url}
          newTab={data.button.newTab}
          type={data.button.type}
          name={data.button.text}
        />
        </div>
        </div>
        
        <div className='relative flex lg:flex-col col-span-3 lg:col-span-1'>
        <hr className='bg-primary-500 opacity-25 w-1 h-full absolute lg:block hidden' />
        
          {data.features.map((feature: Feature, index: number) => (
            <Feature key={index} {...feature} />
          ))}
        </div>
      
    </section>
  )
}

export default Info