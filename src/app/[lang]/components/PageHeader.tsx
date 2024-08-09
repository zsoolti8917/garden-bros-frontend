interface PageHeaderProps {
    heading: string,
    text?: string,
  }
  
  export default function PageHeader({ heading, text } : PageHeaderProps) {
    return (
      <div className="my-16 w-full text-center">
      { text && <span className="text-primary-500 font-bold">{text}</span> }
      <h2 className="text-4xl text-primary-700 my-4 lg:text-5xl font-bold font-heading">{heading}</h2>
    </div>
    );
  }
  