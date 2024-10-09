'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect, Option } from "@/components/ui/multi-select";
import licenseDurations from '@/data/licenseDurations.json';

export default function CreateProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [features, setFeatures] = useState([{ name: '', description: '' }]);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);

  const durationOptions: Option[] = licenseDurations.durations.map(duration => ({
    label: `${duration} months`,
    value: duration.toString(),
  }));

  const handleFeatureChange = (index: number, key: 'name' | 'description', value: string) => {
    const newFeatures = [...features];
    newFeatures[index][key] = value;
    setFeatures(newFeatures);
  };

  const addFeature = () => {
    setFeatures([...features, { name: '', description: '' }]);
  };

  const removeFeature = (index: number) => {
    const newFeatures = features.filter((_, i) => i !== index);
    setFeatures(newFeatures);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    formData.set('features', JSON.stringify(features));
    formData.set('durations', JSON.stringify(selectedDurations.map(Number)));

    try {
      const response = await fetch('/api/store', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      const data = await response.json();

      if (data.success) {
        router.push('/store');
      } else {
        throw new Error(data.error || 'Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      // Handle error (e.g., show an error message to the user)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Product</h1>
      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <Input type="text" id="name" name="name" required />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <Textarea id="description" name="description" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Features</label>
                {features.map((feature, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <Input
                      type="text"
                      placeholder="Feature name"
                      value={feature.name}
                      onChange={(e) => handleFeatureChange(index, 'name', e.target.value)}
                      required
                    />
                    <Input
                      type="text"
                      placeholder="Feature description"
                      value={feature.description}
                      onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                      required
                    />
                    <Button type="button" onClick={() => removeFeature(index)}>Remove</Button>
                  </div>
                ))}
                <Button type="button" onClick={addFeature}>Add Feature</Button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">License Durations</label>
                <MultiSelect
                  options={durationOptions}
                  selected={selectedDurations}
                  onChange={setSelectedDurations}
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">Product Image/Logo</label>
                <Input type="file" id="image" name="image" accept="image/*" required />
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Product'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}