import React, { useEffect } from 'react';
import Image from 'next/image';
import { getStrapiMedia } from '../utils/api-helpers';
import RichText from './RichText';

const SluzbySections = ({ data }: any) => {



  return (
    <section className='py-10'>
    <div className="max-w-[1440px] mx-auto px-4 py-10 ">
      <h2 className='text-5xl text-center pb-10 text-primary-700 font-bold'>{data.title}</h2>
      <p className='text-center  pb-6 mx-auto max-w-[800px]'>{data.description}</p>
      {data.sluzbySections.map((section: any) => { // Remove the unused index parameter

        // Use getStrapiMedia to get the correct image URL
        const imageUrl = getStrapiMedia(section.image.data.attributes.url);

        return (
          <React.Fragment key={section.id}>
          <div
            id={section.anchor}
            className={`flex flex-col lg:flex-row pb-10 anchor ${section.IsRight ? 'lg:flex-row-reverse' : ''}`}
          >
            <div className="lg:w-1/2 my-auto">
              <Image
                src={imageUrl || ""} 
                alt={section.image.data.attributes.alternativeText || section.title}
                className="w-full h-auto object-cover rounded-xl "
                width={section.image.data.attributes.width}
                height={section.image.data.attributes.height}
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
            <div className="lg:w-1/2 p-4 lg:p-8">
              <RichText data={section} />
            </div>
          </div>
          <hr className="border-t-2 border-gray-200 pb-10" />
          </React.Fragment>
        );
      })}
      
    </div>
    </section>

  );
};

export default SluzbySections;
