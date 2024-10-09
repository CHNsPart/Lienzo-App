"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect, Option } from "@/components/ui/multi-select";
import { useToast } from '@/hooks/use-toast';
import { Product } from "@/types/product";

interface EditProductModalProps {
  product: Product;
}

export default function EditProductModal({ product }: EditProductModalProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [features, setFeatures] = useState<{ name: string; description: string }[]>(JSON.parse(product.features));
  const [selectedDurations, setSelectedDurations] = useState<string[]>(JSON.parse(product.durations));
  const [image, setImage] = useState<File | null>(null);

  const durationOptions: Option[] = [3, 6, 12, 24, 48].map(duration => ({
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

    const formData = new FormData();
    formData.append('id', product.id);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('features', JSON.stringify(features));
    formData.append('durations', JSON.stringify(selectedDurations.map(Number)));
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await fetch('/api/store', {
        method: 'PATCH',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Product Updated",
          description: "The product has been successfully updated.",
        });
        setIsOpen(false);
        router.refresh();
      } else {
        throw new Error(data.error || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Edit Product</Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
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
              <Input
                type="file"
                id="image"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                accept="image/*"
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Product'}
            </Button>
          </div>
        </form>
      </DialogContent>
      </Dialog>
    </>
  );
}