
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface HealthChartProps {
  title: string;
  data: {
    date: string;
    value: number;
  }[];
  unit: string;
  dataKey: string;
  color: string;
}

export const HealthChart: React.FC<HealthChartProps> = ({
  title,
  data,
  unit,
  dataKey,
  color,
}) => {
  return (
    <Card className="glass-card rounded-lg">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-md font-medium">{title}</CardTitle>
      </CardHeader>
      
      <CardContent className="p-0 pt-2">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <XAxis 
                dataKey="date" 
                stroke="#666" 
                fontSize={10} 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                fontSize={10} 
                stroke="#666" 
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: '#1E1E1E', 
                  borderColor: color,
                  borderRadius: '4px',
                  fontSize: '12px',
                }}
                labelStyle={{ color: '#fff' }}
                formatter={(value) => [`${value} ${unit}`, '']}
              />
              <Line 
                type="monotone" 
                dataKey={dataKey} 
                stroke={color} 
                strokeWidth={2}
                dot={{ r: 3, strokeWidth: 1, stroke: color, fill: color }}
                activeDot={{ r: 6, stroke: color, strokeWidth: 2, fill: '#1E1E1E' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
