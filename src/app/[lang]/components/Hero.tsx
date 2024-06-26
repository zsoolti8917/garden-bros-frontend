import React from 'react'
import { getStrapiMedia } from '../utils/api-helpers';
import Link from 'next/link';
import Image from 'next/image';
import HighlightedText from './HighlightedText';
import { renderButtonStyle } from '../utils/render-button-style';
interface Picture {
  data: {
    id: string;
    attributes: {
      url: string ;
      name: string;
      alternativeText: string;
    };
  };
}

interface Button {
  id: string;
  url: string;
  text: string;
  type: string;
  newTab: boolean;
}

interface HeroProps {
  data: {
    id:string,
    title:string,
    description:string,
    picture: Picture,
    button: Button
  }
}

const Hero = ({data}: HeroProps) => {
  const imgUrl = getStrapiMedia(data.picture.data.attributes.url);
  console.log(data.button)
  return (
    <section className="relative h-[560px] w-full">
 <Image
        src={imgUrl || ""}
        alt="Hero Background"
        layout="fill"
        objectFit="cover"
        quality={100}
        className="z-0"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">{data.title}</h1>
        
              <Link
                
                href={data.button.url}
                target={data.button.newTab ? "_blank" : "_self"}
                className={renderButtonStyle(data.button.type)}
              >
                {data.button.text}
              </Link>
            
      </div>
    </section>
  )
}

export default Hero