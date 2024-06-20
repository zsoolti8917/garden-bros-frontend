import Link from "next/link";
import Image from "next/image";
import Logos from "../../../../public/Logo.png";
export default function Logo({
  logoUrl,
  logoText,
  logoLink,
}:{
  logoUrl: string;
  logoText: string;
  logoLink: string;
}) {
  console.log(logoUrl);
  return (
    <Link
      href={logoLink || "/"}
      aria-label="Back to homepage"
      className=""
    >
      <Image src={logoUrl} alt="Logo" width={124} height={124} />
    </Link>
  );
}
