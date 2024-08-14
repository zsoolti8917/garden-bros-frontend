import Image from "next/image";

export default function Logo({
  logoUrl,
  logoText,
  children,
}: {
  logoUrl: string;
  logoText: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center p-2">
      {logoUrl && <Image src={logoUrl} alt={logoText} width={72} height={72} />}
      <div className="ml-2">{children}</div>
    </div>
  );
}
