import Link from "next/link";
import Image from "next/image";
import Logos from "../../../../public/Logo.png";
export default function Logo({}) {
  return (
    <Link
      href="/"
      aria-label="Back to homepage"
      className=""
    >
      <Image src={Logos} alt="Logo" width={124} height={124} />
    </Link>
  );
}
