import type { Metadata } from "next";
import "./globals.css";
import { getStrapiMedia, getStrapiURL } from "./utils/api-helpers";
import { fetchAPI } from "./utils/fetch-api";

import { i18n } from "../../../i18n-config";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import HeaderInfo from "./components/HeaderInfo";
import FooterInfo from "./components/FooterInfo";
import {FALLBACK_SEO} from "@/app/[lang]/utils/constants";
import { get } from "http";

async function getGlobal(lang: string): Promise<any> {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

  if (!token) throw new Error("The Strapi API Token environment variable is not set.");

  const path = `/global`;
  const options = { headers: { Authorization: `Bearer ${token}` } };

  const urlParamsObject = {
    populate: [
      "metadata.shareImage",
      "favicon",
      "navbar.links",
      "navbar.button",
      "navbar.navbarLogo",
      "navbar.navbarLogo.logoImg",
      "footer.adresa",
      "footer.sluzby",
      "footer.sluzby.categories",
      "footer.ro",
      "headerInfo",
      "headerInfo.contacts",
      "headerInfo.socials",
      "footerInfo",
      "footerInfo.legalLinks",
    ],
    locale: lang,
  };
  return await fetchAPI(path, urlParamsObject, options);
}

export async function generateMetadata({ params } : { params: {lang: string}}): Promise<Metadata> {
  const meta = await getGlobal(params.lang);

  if (!meta.data) return FALLBACK_SEO;

  const { metadata, favicon } = meta.data.attributes;
  const { url } = favicon.data.attributes;

  return {
    title: metadata.metaTitle,
    description: metadata.metaDescription,
    icons: {
      icon: [new URL(url, getStrapiURL())],
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  readonly children: React.ReactNode;
  readonly params: { lang: string };
}) {
  const global = await getGlobal(params.lang);
  // TODO: CREATE A CUSTOM ERROR PAGE
  if (!global.data) return null;
  
  const { navbar, footer, headerInfo, footerInfo } = global.data.attributes;


const navBarLogoUrl = getStrapiMedia(navbar.navbarLogo.logoImg.data?.attributes.url);
  return (
    <html lang={params.lang}>
      <body>
        <HeaderInfo 
        socialsText={headerInfo.socialsText}
        socialLinks={headerInfo.socials}
        contactLinks={headerInfo.contacts}
        />
        <NavBar 
        logoUrl={navBarLogoUrl || ""}
        logoLink={navbar.navbarLogo.url}
        logoText={navbar.navbarLogo.logoText}
        ctaButton={navbar.button}
        navLinks={navbar.links}
        />

        
        <main className="min-h-[80vh]">{children}</main>

        <Footer 
        footerAdresa = {footer.adresa}
        footerSluzby = {footer.sluzby}
        footerRo = {footer.ro}
        footerKategorie = {footer.sluzby.categories}
        />
        <FooterInfo 
        footerInfo={footerInfo}
        footerLinks={footerInfo.legalLinks}
        /> 
      </body>
    </html>
  );
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}
