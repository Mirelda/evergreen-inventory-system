"use client";
import FormHeader from "@/components/dashboard/FormHeader";
import { Plus, X } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import TextInput from "@/components/formInputs/TextInput";
import { useState } from "react";
import SubmitButton from "@/components/formInputs/SubmitButton";
import TextAreaInput from "@/components/formInputs/TextAreaInput";

function NewUnit() {
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
      const response = await fetch('/api/units', {
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
        alert("Unit created successfully!");
      } else {
        const errorData = await response.json();
        console.error("Error creating unit:", errorData);
        setLoading(false);
        alert("Error creating unit. Please try again.");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      alert("Error creating unit. Please try again.");
    }
  }

  return (
    <div>
      {/* Header */}
      <FormHeader title="New Unit" href="/dashboard/inventory/" />

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8 light:bg-gray-800 light:border-gray-700 mx-auto my-3"
      >
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          {/* Unit Title */}
          <TextInput
            label="Unit Title"
            name="title"
            register={register}
            errors={errors}
            className="w-full"
            validation={{
              minLength: { value: 2, message: "Unit name must be at least 2 characters" },
              maxLength: { value: 30, message: "Unit name must be less than 30 characters" },
              pattern: {
                value: /^[a-zA-Z0-9\s\-_]+$/,
                message: "Unit name can only contain letters, numbers, spaces, hyphens and underscores"
              }
            }}
            placeholder="e.g., Kilogram, Piece, Liter"
          />

          {/* Unit Abbreviation */}
          <TextInput
            label="Unit Abbreviation"
            name="abbreviation"
            register={register}
            errors={errors}
            className="w-full"
            validation={{
              minLength: { value: 1, message: "Abbreviation must be at least 1 character" },
              maxLength: { value: 10, message: "Abbreviation must be less than 10 characters" },
              pattern: {
                value: /^[A-Z0-9]+$/,
                message: "Abbreviation must be uppercase letters and numbers only"
              }
            }}
            placeholder="e.g., KG, PCS, L"
          />
        </div>
        <SubmitButton isLoading={loading} title="Unit" />
      </form>
    </div>
  );
}

export default NewUnit;
