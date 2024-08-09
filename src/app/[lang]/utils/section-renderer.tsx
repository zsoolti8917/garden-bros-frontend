import Hero from "../components/Hero";
import Features from "../components/Features";
import Corp from "../components/Corp";
import Info from "../components/Info";
import Sluzby from "../components/Sluzby";
import Projekty from "../components/Projekty";
import TabsFAQ from "../components/Faq";
import SluzbySections from "../components/SluzbySections";
import ContactPage from "../components/ContactPage";
export function sectionRenderer(section: any, index: number) {
  switch (section.__component) {
    case "sections.hero":
      return <Hero key={index} data = {section}/>;
    case "sections.features":
      return <Features key={index} data = {section} />;
    case "sections.corp":
      return <Corp key={index} data = {section} />;
    case "sections.info":
      return <Info key={index} data = {section} />;
    case "sections.sluzby": 
      return <Sluzby key={index} data = {section} />;
    case "sections.projekty":
      return <Projekty key={index} data = {section} />;
    case "sections.faq":
      return <TabsFAQ key={index} data = {section} />;
    case "sections.sluzby-info":
        return <SluzbySections key={index} data = {section} />;
    case "sections.contact-info":
      console.log(section);
        return <ContactPage key={index} data = {section} />;
    default:
      return null;
  }
}
