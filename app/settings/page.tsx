"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import LicenseDurationModal from '@/components/modals/LicenseDurationModal';
import ProductVersionModal from '@/components/modals/ProductVersionModal';
import { Role, Roles } from '@/lib/roles';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Product {
  id: string;
  name: string;
  versions: string;
}

export default function SettingsPage() {
  const [userRole, setUserRole] = useState<Role>(Roles.USER);
  const [durations, setDurations] = useState<number[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDuration, setEditingDuration] = useState<number | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetch('/api/user-claims')
      .then(response => response.json())
      .then(data => {
        if (data.role !== Roles.ADMIN) {
          router.push('/dashboard');
        } else {
          setUserRole(data.role);
          fetchDurations();
        }
      })
      .catch(error => console.error('Error fetching user claims:', error));
  }, [router]);

  useEffect(() => {
    // Fetch products when component mounts
    fetch('/api/store')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const fetchDurations = async () => {
    const response = await fetch('/api/settings/license-durations');
    const data = await response.json();
    setDurations(data.durations);
  };

  const handleOpenModal = (duration: number | null = null) => {
    setEditingDuration(duration);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDuration(null);
  };

  const handleSaveDuration = async (duration: number) => {
    try {
      const method = editingDuration ? 'PUT' : 'POST';
      const url = editingDuration 
        ? `/api/settings/license-durations/${editingDuration}`
        : '/api/settings/license-durations';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duration }),
      });

      if (response.ok) {
        toast({
          title: `Duration ${editingDuration ? 'updated' : 'added'} successfully`,
          description: `License duration of ${duration} months has been ${editingDuration ? 'updated' : 'added'}.`,
        });
        fetchDurations();
        handleCloseModal();
      } else {
        throw new Error('Failed to save duration');
      }
    } catch (error) {
      console.error('Error saving duration:', error);
      toast({
        title: "Error",
        description: `Failed to ${editingDuration ? 'update' : 'add'} duration. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteDuration = async (duration: number) => {
    try {
      const response = await fetch(`/api/settings/license-durations/${duration}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "Duration deleted successfully",
          description: `License duration of ${duration} months has been removed.`,
        });
        fetchDurations();
      } else {
        throw new Error('Failed to delete duration');
      }
    } catch (error) {
      console.error('Error deleting duration:', error);
      toast({
        title: "Error",
        description: "Failed to delete duration. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddVersion = async (version: string) => {
    try {
      const response = await fetch(`/api/settings/product-versions/${selectedProduct}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ version }),
      });

      if (!response.ok) {
        throw new Error('Failed to add version');
      }

      const data = await response.json();
      setProducts(products.map(product => 
        product.id === selectedProduct 
          ? { ...product, versions: JSON.stringify(data.versions) }
          : product
      ));

      toast({
        title: "Version added successfully",
        description: `Version ${version} has been added.`,
      });
      setIsVersionModalOpen(false);
    } catch (error) {
      console.error('Error adding version:', error);
      toast({
        title: "Error",
        description: "Failed to add version. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteVersion = async (productId: string, version: string) => {
    try {
      const response = await fetch(
        `/api/settings/product-versions/${productId}?version=${encodeURIComponent(version)}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        throw new Error('Failed to delete version');
      }

      const data = await response.json();
      setProducts(products.map(product => 
        product.id === productId 
          ? { ...product, versions: JSON.stringify(data.versions) }
          : product
      ));

      toast({
        title: "Version deleted successfully",
        description: `Version ${version} has been removed.`,
      });
    } catch (error) {
      console.error('Error deleting version:', error);
      toast({
        title: "Error",
        description: "Failed to delete version. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getVersionsForProduct = (productId: string): string[] => {
    const product = products.find(p => p.id === productId);
    return product ? JSON.parse(product.versions) : [];
  };

  if (userRole !== Roles.ADMIN) {
    return null;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* License Durations Card */}
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 mb-4'>
          <div className='space-y-1'>
            <CardTitle>License Durations</CardTitle>
            <CardDescription>Manage your overall license durations</CardDescription>
          </div>
          <Button onClick={() => handleOpenModal()}>Add New Duration</Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {durations.map((duration) => (
              <Card key={duration} className="p-4 flex justify-between items-center">
                <span>{duration} months</span>
                <div>
                  <Button variant="outline" size="sm" onClick={() => handleOpenModal(duration)} className="mr-2">
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteDuration(duration)}>
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Product Versions Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle>Product Versions</CardTitle>
            <CardDescription>Manage versions for each product</CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={() => setIsVersionModalOpen(true)} 
              disabled={!selectedProduct}
            >
              Add Version
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedProduct && getVersionsForProduct(selectedProduct).map((version) => (
              <Card key={version} className="p-4 flex justify-between items-center">
                <span>{version}</span>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDeleteVersion(selectedProduct, version)}
                >
                  Delete
                </Button>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <LicenseDurationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveDuration}
        initialDuration={editingDuration}
      />
      <ProductVersionModal
        isOpen={isVersionModalOpen}
        onClose={() => setIsVersionModalOpen(false)}
        onSave={handleAddVersion}
        initialVersion={null}
        productId={selectedProduct}
      />
    </div>
  );
}