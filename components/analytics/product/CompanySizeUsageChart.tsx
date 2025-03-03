"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface CompanySizeData {
  size: string;
  count: number;
  percentage: number;
}

const COMPANY_SIZE_COLORS = {
  'solo': '#FFB020',
  'small': '#14B8A6',
  'medium': '#F26B60',
  'large': '#6366F1',
  'enterprise': '#0EA5E9',
  'unknown': '#94A3B8'
};

const COMPANY_SIZE_LABELS = {
  'solo': 'Solo (Only me)',
  'small': 'Small (1-10)',
  'medium': 'Medium (11-100)',
  'large': 'Large (101-500)',
  'enterprise': 'Enterprise (500+)',
  'unknown': 'Not Specified'
};

export function CompanySizeUsageChart() {
  const [data, setData] = useState<CompanySizeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/analytics/products/company-size');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching company size usage:', error);
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
  
  const getColor = (size: string) => {
    return COMPANY_SIZE_COLORS[size as keyof typeof COMPANY_SIZE_COLORS] || '#94A3B8';
  };

  const getLabel = (size: string) => {
    return COMPANY_SIZE_LABELS[size as keyof typeof COMPANY_SIZE_LABELS] || 'Unknown Size';
  };

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>License Distribution by Company Size</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="count"
                nameKey="size"
              >
                {data.map((entry) => (
                  <Cell 
                    key={entry.size} 
                    fill={getColor(entry.size)} 
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [
                  `${value} licenses (${data.find(item => item.size === name)?.percentage}%)`,
                  getLabel(name)
                ]}
              />
              <Legend 
                formatter={(value) => getLabel(value)}
                wrapperStyle={{ fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}