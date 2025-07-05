"use client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import CollapsibleLink from "./CollapsibleLink";
import { ChevronRight } from "lucide-react";

function SidebarDropdownLink({ title, items, icon: Icon }) {
  return (
    <Collapsible>
      <CollapsibleTrigger className="cursor-pointer flex justify-between items-center w-full">
        <div className="cursor-pointer flex items-center space-x-2 p-2">
          <Icon className="w-4 h-4" />
          <span>{title}</span>
        </div>
        <ChevronRight className="w-4 h-4" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        {items.map((items, i) => {
          return (
            <CollapsibleLink key={i} href={items.href} title={items.title} />
          );
        })}
      </CollapsibleContent>
    </Collapsible>
  );
}

export default SidebarDropdownLink;
