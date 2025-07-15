import { X } from "lucide-react";
import Link from "next/link";

function FormHeader({ title, href, backUrl }) {
  const linkUrl = href || backUrl;
  
  return (
    <div className="flex items-center justify-between bg-white py-3 px-16">
      <h2 className="text-xl font-semibold">{title}</h2>
      {linkUrl && (
        <Link href={linkUrl}>
          <X />
        </Link>
      )}
    </div>
  );
}

export default FormHeader;
