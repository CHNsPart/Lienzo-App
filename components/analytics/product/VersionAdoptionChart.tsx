"use client"

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, LabelList } from "recharts";

interface VersionAdoption {
  productName: string;
  version: string;
  count: number;
  displayName: string;
}

export function VersionAdoptionChart() {
  const [data, setData] = useState<VersionAdoption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const maxCount = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return 0;
    }
    return Math.max(...data.map(item => item.count));
  }, [data]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/analytics/products/version-adoption');
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        const result = await response.json();
        
        if (Array.isArray(result)) {
          setData(result);
        } else {
          console.warn('API returned non-array data:', result);
          setData([]);
          setError('Invalid data format received');
        }
      } catch (error) {
        console.error('Error fetching version adoption:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Card className="col-span-8">
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-[500px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"/>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error || !Array.isArray(data) || data.length === 0) {
    return (
      <Card className="col-span-8">
        <CardHeader>
          <CardTitle>Version Adoption</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-[400px] text-muted-foreground">
            {error ? `Error: ${error}` : 'No version adoption data available'}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="col-span-8">
      <CardHeader>
        <CardTitle>Version Adoption</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="displayName" type="category" width={225} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Active Licenses" radius={[4, 4, 4, 4]}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.count === maxCount ? '#F26B60' : '#000000'}
                  />
                ))}
                <LabelList
                  dataKey="count"
                  position="right"
                  formatter={(value: number) => `${value} licenses`}
                  className="text-sm fill-gray-600"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}