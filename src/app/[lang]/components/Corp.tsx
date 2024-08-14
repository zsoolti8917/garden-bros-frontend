import React from 'react'
import { getStrapiMedia } from '../utils/api-helpers';
import Image from 'next/image';
import { renderButtonStyle } from '../utils/render-button-style';
import Link from 'next/link';
import AIButton from './AIButton';
interface Button {
  id: string;
  url: string;
  text: string;
  type: 'primary' | 'secondary';
  newTab: boolean;
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

interface CorpProps {
  data: {
    id:string,
    title:string,
    description:string,
    smallText:string,
    header: string,
    body: string,
    button: Button,
    features: Feature[]
  }
}

function Feature({title,description,icon}: Feature) {
  const imgUrl = getStrapiMedia(icon.data.attributes.url);
  return (


    <div className="bg-white md:p-8 p-4 shadow-xl flex flex-col gap-4 items-center">
      <div className="bg-green-100 rounded-full p-2">
        <Image 
          src={imgUrl || ""} 
          alt={icon.data.attributes.alternativeText || "icon"} 
          width={24} 
          height={24} 
          className='z-20 h-10 w-10' 
        />
      </div>
      <p className="text-green-800 font-bold text-lg text-center">{title}</p>
    </div>
  )
}

const Corp = ({data}: CorpProps) => {
  return (
    <section className='max-w-[1110px] mx-auto px-4 xl:px-0 grid grid-cols-2 justify-between mb-16 text-center md:text-left '>
      

      
      <div className='w-ful flex flex-col gap-4 md:pr-10 justify-center col-span-2 md:col-span-1 pb-8 md:pb-0'>
        <p className='text-primary-500 font-bold text-xl'>{data.smallText}</p>
        <h2 className='text-primary-700 font-bold text-3xl'>{data.header}</h2>
        <p>{data.body}</p>
        <AIButton 
          url={data.button.url}
          newTab={data.button.newTab}
          type={data.button.type}
          name={data.button.text}
        />
      </div>
      <div className="grid grid-cols-2 grid-rows-2 gap-6 w-full col-span-2 md:col-span-1">
        {data.features.map((feature: Feature, index: number) => (
          <div key={index} className={index === 1 ? "row-span-3 self-center mb-10" : ""}>
            <Feature {...feature} />
          </div>
        ))}
      </div>
    </section>
    
  )
}

export default Corp