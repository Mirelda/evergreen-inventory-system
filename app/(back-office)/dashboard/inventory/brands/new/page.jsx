"use client";
import FormHeader from "@/components/dashboard/FormHeader";
import { Plus, X } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import TextInput from "@/components/formInputs/TextInput";
import { useState } from "react";
import SubmitButton from "@/components/formInputs/SubmitButton";
import TextAreaInput from "@/components/formInputs/TextAreaInput";

function NewBrand() {
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
    const baseUrl = "http://localhost:3000";
    try {
      const response = await fetch(`${baseUrl}/api/brands`, {
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
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }
  return (
    <div>
      {/* Header */}
      <FormHeader title="New Brand" href="/dashboard/inventory/" />

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8 light:bg-gray-800 light:border-gray-700 mx-auto my-3"
      >
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          {/* Comp */}
          <TextInput
            label="Brand Title"
            name="title"
            register={register}
            errors={errors}
            className="w-full"
          />
        </div>
        <SubmitButton isLoading={loading} title="Brand" />
      </form>
    </div>
  );
}

export default NewBrand;
