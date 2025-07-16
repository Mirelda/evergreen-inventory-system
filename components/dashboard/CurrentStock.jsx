import DataTable from "@/components/dashboard/DataTable";

export default async function CurrentStock({ title, items }) {
  // console.log(items);
  const columns = [
    "imageUrl",
    "title",
    "quantity",
    "fromWarehouse",
    "currentWarehouse",
    "createdAt",
  ];
  return (
    <div className="bg-pink-50 p-8">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      {/* Table */}
      <div className="my-4 ">
        <DataTable data={items} columns={columns} resourceTitle="items" />
      </div>
    </div>
  );
}
