import SalesForm from "@/components/dashboard/SalesForm";
import { getData } from "@/lib/getData";

export default async function NewSale() {
  const items = await getData("items");
  return <SalesForm items={items} />;
} 