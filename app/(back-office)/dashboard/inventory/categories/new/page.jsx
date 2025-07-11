"use client";
import FormHeader from "@/components/dashboard/FormHeader";
import { Plus, X } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import TextInput from "@/components/formInputs/TextInput";
import { useState } from "react";
import SubmitButton from "@/components/formInputs/SubmitButton";
import TextAreaInput from "@/components/formInputs/TextAreaInput";

function NewCategory() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);

  async function onSubmit(data) {
    console.log(data);
    setLoading(true);
    try {
      const response = await fetch('/api/categories', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        console.log(response);
        setLoading(false);
        reset();
        alert("Category created successfully!");
      } else {
        const errorData = await response.json();
        console.error("Error creating category:", errorData);
        setLoading(false);
        alert("Error creating category. Please try again.");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      alert("Error creating category. Please try again.");
    }
  }

  return (
    <div>
      {/* Header */}
      <FormHeader title="New Category" href="/dashboard/inventory/" />

      {/* Form */}
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
            validation={{
              minLength: { value: 2, message: "Title must be at least 2 characters" },
              maxLength: { value: 50, message: "Title must be less than 50 characters" },
              pattern: {
                value: /^[a-zA-Z0-9\s\-_]+$/,
                message: "Title can only contain letters, numbers, spaces, hyphens and underscores"
              }
            }}
            placeholder="e.g., Electronics, Clothing"
          />

          {/* Category Description */}
          <TextAreaInput
            label="Category Description"
            name="description"
            register={register}
            errors={errors}
            isRequired={false}
            validation={{
              maxLength: { value: 500, message: "Description must be less than 500 characters" }
            }}
            placeholder="Brief description of the category"
            rows={4}
          />
        </div>
        <SubmitButton isLoading={loading} title="Category" />
      </form>
    </div>
  );
}

export default NewCategory;
