"use client";

import Link from "next/link";

function OptionCard({ optionData }) {
  const {
    title,
    description,
    link,
    linkTitle,
    enabled,
    icon: Icon,
  } = optionData;
  return (
    <div className="shadow-md bg-white flex flex-col items-center justify-center gap-4 p-6 rounded">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="">
        <Icon strokeWidth=".5px" className="w-36 h-36" />
      </div>
      <p className="line-clamp-1">{description}</p>

      {enabled ? (
        <Link
          href={link}
          className="py-2 px-3 text-white rounded-sm bg-blue-600 inline-flex items-center space-x-2"
        >
          {linkTitle}
        </Link>
      ) : (
        <button className="cursor-pointer py-2 px-3 text-white rounded-sm bg-blue-600 inline-flex items-center space-x-2">
          Enable
        </button>
      )}
    </div>
  );
}

export default OptionCard;
