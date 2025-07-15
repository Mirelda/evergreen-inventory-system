"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import FormHeader from "@/components/dashboard/FormHeader";
import { useForm } from "react-hook-form";
import TextInput from "@/components/formInputs/TextInput";
import TextAreaInput from "@/components/formInputs/TextAreaInput";
import SubmitButton from "@/components/formInputs/SubmitButton";

function EditCategory() {
  const params = useParams();
  const router = useRouter();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Fetch category data
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/categories/${params.id}`);
        if (response.ok) {
          const categoryData = await response.json();
          setCategory(categoryData);
          
          // Set form values
          setValue('title', categoryData.title);
          setValue('description', categoryData.description || '');
        } else {
          setError('Failed to fetch category');
        }
      } catch (err) {
        setError('Failed to fetch category data');
        console.error('Error fetching category:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCategory();
    }
  }, [params.id, setValue]);

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      const response = await fetch(`/api/categories/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert('Category updated successfully!');
        // Refresh the cache and navigate back
        router.refresh();
        router.push('/dashboard/inventory/categories');
      } else {
        const errorData = await response.json();
        alert(`Error updating category: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Error updating category. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Category not found</p>
      </div>
    );
  }

  return (
    <div>
      <FormHeader title={`Edit Category: ${category.title}`} href="/dashboard/inventory/categories" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8 light:bg-gray-800 light:border-gray-700 mx-auto my-3"
      >
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          {/* Category Title */}
          <TextInput
            label="Category Title"
            name="title"
            register={register}
            errors={errors}
            className="w-full"
            validation={{
              minLength: { value: 2, message: "Title must be at least 2 characters" },
              maxLength: { value: 100, message: "Title must be less than 100 characters" }
            }}
          />

          {/* Description */}
          <TextAreaInput
            label="Description"
            name="description"
            register={register}
            errors={errors}
            isRequired={false}
            className="sm:col-span-2"
            validation={{
              maxLength: { value: 500, message: "Description must be less than 500 characters" }
            }}
            placeholder="Brief description of the category"
            rows={4}
          />
        </div>

        <SubmitButton isLoading={submitting} title="Update Category" />
      </form>
    </div>
  );
}

export default EditCategory; 