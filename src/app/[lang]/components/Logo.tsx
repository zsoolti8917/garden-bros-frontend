import Link from "next/link";
import Image from "next/image";
import Logos from "../../../../public/Logo.png";
export default function Logo({
  logoUrl,
  logoText,
  logoLink,
  children,
}:{
  logoUrl: string;
  logoText: string;
  logoLink: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={logoLink || "/"}
      aria-label="Back to homepage"
      className="flex items-center p-2"
    >
            {logoUrl && <Image src={logoUrl} alt="logo" width={45} height={45} />}
            <div className="ml-2">{children}</div>
    </Link>
  );
}
