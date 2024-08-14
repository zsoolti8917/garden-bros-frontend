interface PageHeaderProps {
    heading: string,
    text?: string,
  }
  
  export default function PageHeader({ heading, text } : PageHeaderProps) {
    return (
      <div className="py-10 w-full text-center max-w-[800px] mx-auto">
      
      <h2 className="text-5xl text-center pb-10 text-primary-700 font-bold">{heading}</h2>
      { text && <span className="text-center pb-10 mx-auto ">{text}</span> }
    </div>
    );
  }
  