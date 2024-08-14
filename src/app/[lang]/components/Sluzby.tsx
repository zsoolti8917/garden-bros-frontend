import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getStrapiMedia } from '../utils/api-helpers';

interface Icon {
  data: {
    id: string;
    attributes: {
      url: string;
      alternativeText: string;
      caption: string | null;
      width: number;
      height: number;
    };
  };
}

interface Feature {
  id: string;
  title: string;
  description: string | null;
  icon: Icon;
  url: string;
  isLink: boolean;
}

interface SluzbyProps {
  data: {
    id: string;
    titles: string;
    description: string;
    smallText: string;
    header: string;
    features: Feature[];
  };
}

const FeatureCard: React.FC<Feature> = ({ title, description, icon, url, isLink }) => {
  const imgUrl = getStrapiMedia(icon.data.attributes.url);
  const cardClasses = isLink
    ? "relative bg-white px-8 py-16 shadow-xl cursor-pointer flex flex-col items-center group overflow-hidden rounded transition-transform duration-300 hover:scale-105 h-[350px]"
    : "relative bg-white px-8 py-16 shadow-xl flex flex-col items-center overflow-hidden rounded h-[350px]";

  const overlayClasses = isLink
    ? "absolute inset-0 bg-gradient-to-r from-[#348E38] to-[#0F4229] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    : "hidden";

  const textClasses = isLink
    ? "text-green-800 font-bold text-lg text-center mt-4 z-10 group-hover:text-white transition-colors duration-300"
    : "text-green-800 font-bold text-lg text-center mt-4 z-10";

  const descriptionClasses = isLink
    ? "text-center mt-2 z-10 group-hover:text-white transition-colors duration-300"
    : "text-center mt-2 z-10";

  return isLink ? (
    <Link href={`/sluzby#${url}`} className="block">
      <div className={cardClasses}>
        <div className={overlayClasses} />
        <div className="relative bg-green-100 rounded-full p-2 mb-4 z-10">
          <Image
            src={imgUrl || "/default-icon.png"} // Fallback URL
            alt={icon.data.attributes.alternativeText || "icon"}
            width={icon.data.attributes.width}
            height={icon.data.attributes.height}
            className={`transition-transform duration-300 group-hover:scale-110`}
          />
        </div>
        <p className={textClasses}>{title}</p>
        <p className={descriptionClasses}>{description}</p>

      </div>
    </Link>
  ) : (
    <div className={cardClasses}>
      <div className={overlayClasses} />
      <div className="relative bg-green-100 rounded-full p-2 mb-4 z-10">
        <Image
          src={imgUrl || "/default-icon.png"} // Fallback URL
          alt={icon.data.attributes.alternativeText || "icon"}
          width={icon.data.attributes.width}
          height={icon.data.attributes.height}
          className={`transition-transform duration-300`}
        />
      </div>
      <p className={textClasses}>{title}</p>
      <p className={descriptionClasses}>{description}</p>
    </div>
  );
};

// Sluzby component to render the feature list
const Sluzby: React.FC<SluzbyProps> = ({ data }) => {
  return (
    <section className='max-w-[1110px] mx-auto p-4 pb-20'>
      <div className="text-center mb-8">
        <h2 className="font-bold mb-4 text-primary-500">{data.titles}</h2>
        <p className='font-bold text-3xl text-primary-700 max-w-[350px] mx-auto'>{data.description}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {data.features.map((feature: Feature, index: number) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </section>
  );
};


export default Sluzby;
