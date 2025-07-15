'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import FormHeader from '@/components/dashboard/FormHeader';
import TextInput from '@/components/formInputs/TextInput';
import SubmitButton from '@/components/formInputs/SubmitButton';

export default function EditBrandPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  
  const [formData, setFormData] = useState({
    title: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [brand, setBrand] = useState(null);

  // Fetch brand data on component mount
  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const response = await fetch(`/api/brands/${id}`);
        if (response.ok) {
          const data = await response.json();
          setBrand(data);
          setFormData({
            title: data.title || ''
          });
        } else {
          console.error('Failed to fetch brand');
          router.push('/dashboard/inventory/brands');
        }
      } catch (error) {
        console.error('Error fetching brand:', error);
        router.push('/dashboard/inventory/brands');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchBrand();
    }
  }, [id, router]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Brand title is required';
    } else if (formData.title.trim().length < 2) {
      newErrors.title = 'Brand title must be at least 2 characters';
    } else if (formData.title.trim().length > 50) {
      newErrors.title = 'Brand title must be less than 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/brands/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Brand updated successfully:', result);
        // Refresh the cache and navigate back
        router.refresh();
        router.push('/dashboard/inventory/brands');
      } else {
        const errorData = await response.json();
        console.error('Failed to update brand:', errorData);
        setErrors({ submit: errorData.error || 'Failed to update brand' });
      }
    } catch (error) {
      console.error('Error updating brand:', error);
      setErrors({ submit: 'An error occurred while updating the brand' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Brand Not Found</h2>
          <p className="text-gray-600 mb-4">The brand you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/dashboard/inventory/brands')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Brands
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <FormHeader 
          title="Edit Brand" 
          href="/dashboard/inventory/brands"
        />
        
        <div className="mt-8 bg-white shadow rounded-lg">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <TextInput
                label="Brand Title"
                name="title"
                value={formData.title}
                onChange={(value) => handleInputChange('title', value)}
                error={errors.title}
                placeholder="Enter brand title"
                isRequired={true}
              />
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {errors.submit}
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push('/dashboard/inventory/brands')}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <SubmitButton 
                text="Update Brand"
                isLoading={isSubmitting}
                loadingText="Updating..."
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 