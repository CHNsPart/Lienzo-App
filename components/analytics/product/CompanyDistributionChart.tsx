// components/analytics/product/CompanyDistributionChart.tsx

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface CompanyData {
  name: string;
  size: string;
  licenses: number;
  products: number;
  score: number;
}

const COMPANY_SIZE_LABELS = {
  'solo': 'Solo (Only me)',
  'small': 'Small (1-10)',
  'medium': 'Medium (11-100)',
  'large': 'Large (101-500)',
  'enterprise': 'Enterprise (500+)',
};

export function CompanyDistributionChart() {
  const [data, setData] = useState<CompanyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/analytics/products/company-size');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        
        // Ensure result is an array
        if (!Array.isArray(result)) {
          throw new Error('Invalid data format received');
        }
        
        setData(result);
        setError(null);
      } catch (error) {
        console.error('Error fetching company distribution:', error);
        setError(error instanceof Error ? error.message : 'Failed to load data');
        setData([]); // Reset data to empty array on error
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

  if (error || data.length === 0) {
    return (
      <Card className="col-span-8">
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-[500px]">
            <div className="text-center">
              <p className="text-muted-foreground">
                {error || 'No company data available'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate maximum values for normalization
  const maxLicenses = Math.max(...data.map(d => d.licenses));
  const maxProducts = Math.max(...data.map(d => d.products));

  // Normalize data for better radar visualization
  const normalizedData = data.map(item => ({
    ...item,
    normalizedLicenses: Math.round((item.licenses / maxLicenses) * 100),
    normalizedProducts: Math.round((item.products / maxProducts) * 100),
  }));

  return (
    <Card className="col-span-8">
      <CardHeader>
        <CardTitle></CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={normalizedData}>
              <PolarGrid gridType="polygon" />
              <PolarAngleAxis
                dataKey="name"
                tick={{ fill: '#888888', fontSize: 12 }}
                dy={4}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fontSize: 10 }}
              />
              <Radar
                name="Licenses"
                dataKey="normalizedLicenses"
                stroke="#F26B60"
                fill="#F26B60"
                fillOpacity={0.5}
              />
              <Radar
                name="Products"
                dataKey="normalizedProducts"
                stroke="#36B37E"
                fill="#36B37E"
                fillOpacity={0.3}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const company = payload[0].payload;
                    return (
                      <div className="bg-white p-4 rounded-lg shadow-lg border">
                        <p className="font-medium">{company.name}</p>
                        <p className="text-sm text-gray-500">
                          {COMPANY_SIZE_LABELS[company.size as keyof typeof COMPANY_SIZE_LABELS] || company.size}
                        </p>
                        <div className="mt-2">
                          <p>Licenses: {company.licenses}</p>
                          <p>Products: {company.products}</p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}