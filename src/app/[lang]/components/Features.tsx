import React from 'react'
import { getStrapiMedia } from '../utils/api-helpers';
import Link from 'next/link';
import Image from 'next/image';
interface Feature {
 
  id: string;
  title: string;
  description: string;
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

interface FeaturesProps {
  data: {
    id: string;
    __component: string;
    title: string;
    description: string;
    features: Feature[];
  };
}

function Feature({title,description,icon}: Feature) {
  const imgUrl = getStrapiMedia(icon.data.attributes.url);
  return (
    <div className="p-8 bg-white flex gap-4 max-w-[500px] lg:max-w-[33%] min-w-[310px]  shadow-2xl ">
      <div>
      <div className="bg-primary-200  rounded-full flex items-center justify-center h-14 w-14 z-10">
        <Image src={imgUrl || ""} alt={icon.data.attributes.alternativeText || "icon"} width={24} height={24} className='z-20' />
      </div>
      </div>

      <div>
        <h2 className="mb-2 text-lg font-bold text-primary-700">{title}</h2>
        <div className="text-sm">{description}</div>
      </div>
    </div>
  )
}
const Features = ({data}: FeaturesProps) => {
  return (
    <section className='absolute md:top-[620px] top-[500px] px-6 w-full'>
      <div className='flex max-w-[1110px] min-w-min flex-wrap mx-auto justify-center '>
        {data.features.map((feature: Feature, index: number) => (
          <Feature key={index} {...feature} />
        ))}
      </div>
    </section>
  )
}

export default Features