import { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProductRequest {
  productId: string;
  productName: string;
  requestCount: number;
}

export function MostRequestedProducts() {
  const [data, setData] = useState<ProductRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/analytics/products/most-requested');
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        const result = await response.json();
        
        // Ensure we have an array, even if empty
        if (Array.isArray(result)) {
          setData(result);
        } else {
          console.warn('API returned non-array data:', result);
          setData([]);
          setError('Invalid data format received');
        }
      } catch (error) {
        console.error('Error fetching most requested products:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Safely calculate max count using guard clauses
  const maxCount = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return 0;
    }
    return Math.max(...data.map(item => item.requestCount));
  }, [data]);

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
  
  if (error || !data || data.length === 0) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Most Requested Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-[300px] text-muted-foreground">
            {error ? `Error: ${error}` : 'No data available'}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Most Requested Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="productName"
                tick={{ fill: '#666', fontSize: 12 }}
                tickLine={{ stroke: '#666' }}
              />
              <YAxis 
                tick={{ fill: '#666', fontSize: 12 }}
                tickLine={{ stroke: '#666' }}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
              <Bar dataKey="requestCount">
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.requestCount === maxCount ? '#F26B60' : '#000000'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}