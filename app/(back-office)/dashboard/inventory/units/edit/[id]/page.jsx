'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import FormHeader from '@/components/dashboard/FormHeader';
import TextInput from '@/components/formInputs/TextInput';
import SubmitButton from '@/components/formInputs/SubmitButton';

export default function EditUnitPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  
  const [formData, setFormData] = useState({
    title: '',
    abbreviation: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [unit, setUnit] = useState(null);

  // Fetch unit data on component mount
  useEffect(() => {
    const fetchUnit = async () => {
      try {
        const response = await fetch(`/api/units/${id}`);
        if (response.ok) {
          const data = await response.json();
          setUnit(data);
          setFormData({
            title: data.title || '',
            abbreviation: data.abbreviation || ''
          });
        } else {
          console.error('Failed to fetch unit');
          router.push('/dashboard/inventory/units');
        }
      } catch (error) {
        console.error('Error fetching unit:', error);
        router.push('/dashboard/inventory/units');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchUnit();
    }
  }, [id, router]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Unit title is required';
    } else if (formData.title.trim().length < 2) {
      newErrors.title = 'Unit title must be at least 2 characters';
    } else if (formData.title.trim().length > 50) {
      newErrors.title = 'Unit title must be less than 50 characters';
    }

    if (!formData.abbreviation.trim()) {
      newErrors.abbreviation = 'Abbreviation is required';
    } else if (formData.abbreviation.trim().length < 1) {
      newErrors.abbreviation = 'Abbreviation must be at least 1 character';
    } else if (formData.abbreviation.trim().length > 10) {
      newErrors.abbreviation = 'Abbreviation must be less than 10 characters';
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
      const response = await fetch(`/api/units/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Unit updated successfully:', result);
        alert('Unit updated successfully!');
        router.push('/dashboard/inventory/units');
      } else {
        const errorData = await response.json();
        console.error('Failed to update unit:', errorData);
        setErrors({ submit: errorData.error || 'Failed to update unit' });
      }
    } catch (error) {
      console.error('Error updating unit:', error);
      setErrors({ submit: 'An error occurred while updating the unit' });
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

  if (!unit) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Unit Not Found</h2>
          <p className="text-gray-600 mb-4">The unit you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/dashboard/inventory/units')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Units
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <FormHeader 
          title="Edit Unit" 
          href="/dashboard/inventory/units"
        />
        
        <div className="mt-8 bg-white shadow rounded-lg">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextInput
                label="Unit Title"
                name="title"
                value={formData.title}
                onChange={(value) => handleInputChange('title', value)}
                error={errors.title}
                placeholder="Enter unit title (e.g., Pieces, Kilograms)"
                required
              />
              <TextInput
                label="Abbreviation"
                name="abbreviation"
                value={formData.abbreviation}
                onChange={(value) => handleInputChange('abbreviation', value)}
                error={errors.abbreviation}
                placeholder="Enter abbreviation (e.g., pcs, kg)"
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
                onClick={() => router.push('/dashboard/inventory/units')}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <SubmitButton 
                text="Update Unit"
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