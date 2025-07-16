"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const DeleteBtn = ({ id, endpoint, resourceTitle }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel"
    });

    if (result.isConfirmed) {
      setLoading(true);
      
      try {
        const response = await fetch(`${baseURL}/api/${endpoint}?id=${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          await Swal.fire(
            "Deleted!",
            `${resourceTitle} deleted successfully.`,
            "success"
          );
          // Force page reload to update the data
          window.location.reload();
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to delete");
        }
      } catch (error) {
        console.error("Error deleting:", error);
        await Swal.fire(
          "Error!",
          `Failed to delete ${resourceTitle}.`,
          "error"
        );
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      {loading ? (
        <button
          disabled
          className="text-red-600 hover:text-red-800 transition-colors text-xs"
          title="Deleting..."
        >
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
        </button>
      ) : (
        <button
          onClick={handleDelete}
          className="text-red-600 hover:text-red-800 transition-colors text-xs"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </>
  );
};

export default DeleteBtn; 