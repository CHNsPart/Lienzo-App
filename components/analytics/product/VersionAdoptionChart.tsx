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

  const maxCount = useMemo(() => {
    return Math.max(...data.map(item => item.count));
  }, [data]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/analytics/products/version-adoption');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching version adoption:', error);
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
  
  return (
    <Card className="col-span-8">
      <CardHeader>
        <CardTitle></CardTitle>
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