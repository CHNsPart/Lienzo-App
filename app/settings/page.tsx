// app/settings/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import LicenseDurationModal from '@/components/modals/LicenseDurationModal';
import { Role, Roles } from '@/lib/roles';

export default function SettingsPage() {
  const [userRole, setUserRole] = useState<Role>(Roles.USER);
  const [durations, setDurations] = useState<number[]>([]);
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

  if (userRole !== Roles.ADMIN) {
    return null;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
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
      <LicenseDurationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveDuration}
        initialDuration={editingDuration}
      />
    </div>
  );
}