"use client";

import Image from "next/image";
import Link from "next/link";
import { getStrapiMedia, formatDate } from "../utils/api-helpers";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

interface Article {
  id: number;
  attributes: {
    title: string;
    description: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    cover: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
    category: {
      data: {
        attributes: {
          name: string;
          slug: string;
        };
      };
    };
    authorsBio: {
      data: {
        attributes: {
          name: string;
          avatar: {
            data: {
              attributes: {
                url: string;
              };
            };
          };
        };
      };
    };
  };
}

const Card = ({
  imageUrl,
  authorsBio,
  avatarUrl,
  url,
  title,
  publishedAt,
  description,
  name,

}: {
  imageUrl: string;
  
  authorsBio: any;
  avatarUrl: string;
  url: string;
  title: string;
  publishedAt: string;
  description: string;
  name: string;
}) => {
  return (
    <motion.div whileHover="hover" className="w-full h-[300px] relative shadow-2xl">
      <Link href={url}
        rel="nofollow"
        className="">
      <div className="bg-primary-700 h-full ">
      
              <div className=" text-white flex p-[19px] ">
                <div>
                <h3 className="text-2xl font-semibold group-hover:underline group-focus:underline">
                  {title}
                </h3>
                <span className="text-xs dark:text-gray-400">
                    {formatDate(publishedAt)}
                  </span>

                </div>



                

                
                  

                
              </div>
      </div>
      <motion.div
        initial={{
          top: "0%",
          right: "0%",
        }}
        variants={{
          hover: {
            top: "50%",
            right: "50%",
          },
        }}
        className="absolute inset-0 bg-slate-200 z-10"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div
        className="w-1/2 h-1/2 absolute bottom-0 right-0 z-0 grid place-content-center bg-[#0000004e] text-white transition-colors"
      >
        
        <div className="flex items-center">
          <span className="text-xs">VIAC</span>
          <FiArrowUpRight className="text-lg" />
        </div>
        </div>
        </Link>
    </motion.div>
  );
};

export default function PostList({
  data: articles,
  children,
}: {
  data: Article[];
  children?: React.ReactNode;
}) {
  return (
    <section className="pb-20">
    <div className="xl:px-0 px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-[1440px] mx-auto ">
    {articles.map((article, index: number) => {
          const imageUrl = getStrapiMedia(
            article.attributes.cover.data?.attributes.url
          );

          const category = article.attributes.category.data?.attributes;
          const authorsBio = article.attributes.authorsBio.data?.attributes;

          const avatarUrl = getStrapiMedia(
            authorsBio?.avatar.data.attributes.url
          );
          return (
            <Card
            key={index}
            imageUrl= {imageUrl|| ""}
            authorsBio= {authorsBio}
            avatarUrl= {avatarUrl|| ""}
            url= {`/blog/${category?.slug}/${article.attributes.slug}`}
            title= {article.attributes.title}
            publishedAt= {article.attributes.publishedAt}
            description = {article.attributes.description}
            name = {authorsBio?.name}
/>
          )
        })}
    
    </div>
    {children && children}
  </section>
  );
}       

