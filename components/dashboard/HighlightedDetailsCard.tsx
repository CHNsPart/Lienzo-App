// components/dashboard/HighlightedDetailsCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HighlightedDetailsCardProps {
  title: string;
  value: number;
}

export default function HighlightedDetailsCard({ title, value }: HighlightedDetailsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}