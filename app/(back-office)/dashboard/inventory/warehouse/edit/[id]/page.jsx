'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import FormHeader from '@/components/dashboard/FormHeader';
import TextInput from '@/components/formInputs/TextInput';
import TextAreaInput from '@/components/formInputs/TextAreaInput';
import SelectInput from '@/components/formInputs/SelectInput';
import SubmitButton from '@/components/formInputs/SubmitButton';

export default function EditWarehousePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    warehouseType: '',
    description: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [warehouse, setWarehouse] = useState(null);

  const warehouseTypeOptions = [
    { value: 'main', label: 'Main Warehouse' },
    { value: 'branch', label: 'Branch Warehouse' },
    { value: 'distribution', label: 'Distribution Center' },
    { value: 'retail', label: 'Retail Store' },
    { value: 'storage', label: 'Storage Facility' }
  ];

  // Fetch warehouse data on component mount
  useEffect(() => {
    const fetchWarehouse = async () => {
      try {
        const response = await fetch(`/api/warehouse/${id}`);
        if (response.ok) {
          const data = await response.json();
          setWarehouse(data);
          setFormData({
            title: data.title || '',
            location: data.location || '',
            warehouseType: data.warehouseType || '',
            description: data.description || ''
          });
        } else {
          console.error('Failed to fetch warehouse');
          router.push('/dashboard/inventory/warehouse');
        }
      } catch (error) {
        console.error('Error fetching warehouse:', error);
        router.push('/dashboard/inventory/warehouse');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchWarehouse();
    }
  }, [id, router]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Warehouse title is required';
    } else if (formData.title.trim().length < 2) {
      newErrors.title = 'Warehouse title must be at least 2 characters';
    } else if (formData.title.trim().length > 100) {
      newErrors.title = 'Warehouse title must be less than 100 characters';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    } else if (formData.location.trim().length < 5) {
      newErrors.location = 'Location must be at least 5 characters';
    } else if (formData.location.trim().length > 200) {
      newErrors.location = 'Location must be less than 200 characters';
    }

    if (!formData.warehouseType) {
      newErrors.warehouseType = 'Warehouse type is required';
    }

    if (formData.description && formData.description.trim().length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
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
      const response = await fetch(`/api/warehouse/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Warehouse updated successfully:', result);
        // Refresh the cache and navigate back
        router.refresh();
        router.push('/dashboard/inventory/warehouse');
      } else {
        const errorData = await response.json();
        console.error('Failed to update warehouse:', errorData);
        setErrors({ submit: errorData.error || 'Failed to update warehouse' });
      }
    } catch (error) {
      console.error('Error updating warehouse:', error);
      setErrors({ submit: 'An error occurred while updating the warehouse' });
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

  if (!warehouse) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Warehouse Not Found</h2>
          <p className="text-gray-600 mb-4">The warehouse you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/dashboard/inventory/warehouse')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Warehouses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <FormHeader 
          title="Edit Warehouse" 
          backUrl="/dashboard/inventory/warehouse"
        />
        
        <div className="mt-8 bg-white shadow rounded-lg">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextInput
                label="Warehouse Title"
                name="title"
                value={formData.title}
                onChange={(value) => handleInputChange('title', value)}
                error={errors.title}
                placeholder="Enter warehouse title"
                isRequired={true}
              />
              <SelectInput
                label="Warehouse Type"
                name="warehouseType"
                value={formData.warehouseType}
                onChange={(value) => handleInputChange('warehouseType', value)}
                error={errors.warehouseType}
                options={warehouseTypeOptions}
                placeholder="Select warehouse type"
                isRequired={true}
              />
            </div>

            <TextInput
              label="Location"
              name="location"
              value={formData.location}
              onChange={(value) => handleInputChange('location', value)}
              error={errors.location}
              placeholder="Enter warehouse location (address)"
              isRequired={true}
            />

            <TextAreaInput
              label="Description"
              name="description"
              value={formData.description}
              onChange={(value) => handleInputChange('description', value)}
              error={errors.description}
              placeholder="Enter warehouse description (optional)"
              rows={4}
            />

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {errors.submit}
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push('/dashboard/inventory/warehouse')}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <SubmitButton 
                text="Update Warehouse"
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