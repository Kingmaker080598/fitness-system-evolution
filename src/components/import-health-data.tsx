import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { supabase } from '@/lib/supabase';
import { toast } from './ui/use-toast';
import { importHealthData, getSharedHealthData } from '@/services/health-service';
import { Card } from './ui/card';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { metricLabels } from '@/types/health';
import type { SharedHealthData } from '@/types/health';

export function ImportHealthData() {
  const [shareCode, setShareCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [shareData, setShareData] = useState<SharedHealthData | null>(null);
  const [importing, setImporting] = useState(false);
  const [imported, setImported] = useState(false);

  const validateShare = async () => {
    try {
      setLoading(true);
      setShareData(null);
      setImported(false);

      const data = await getSharedHealthData(shareCode);
      setShareData(data);

      toast({
        title: 'Share Found!',
        description: `Found health data shared by ${data?.sender_name || 'another user'}. Review the data below and click Import to add it to your records.`,
      });
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!shareData) return;

    try {
      setImporting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Please log in to import health data');

      await importHealthData(shareCode, user.id);
      setImported(true);
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: 'Import Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Import Health Data</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Enter share code"
            value={shareCode}
            onChange={(e) => setShareCode(e.target.value)}
            className="max-w-xs"
            disabled={loading || importing}
          />
          <Button 
            onClick={validateShare} 
            disabled={loading || importing || !shareCode || imported}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Validating...
              </>
            ) : (
              'Validate Share'
            )}
          </Button>
        </div>
      </div>

      {shareData && (
        <Card className="p-6 space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              Health Data from {shareData.sender_name || 'Another User'}
            </h3>
            <p className="text-sm text-muted-foreground">
              Shared on {new Date(shareData.created_at).toLocaleDateString()}
              <br />
              Expires on {new Date(shareData.expires_at).toLocaleDateString()}
            </p>
          </div>

          {shareData.metrics && shareData.metrics.length > 0 && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Available Metrics:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {Object.entries(metricLabels).map(([type, label]) => {
                    const metrics = shareData.metrics?.filter(m => m.metric_type === type) || [];
                    if (!metrics.length) return null;

                    // Get the latest value for this metric
                    const latest = metrics.sort((a, b) => 
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                    )[0];

                    return (
                      <li key={type} className="text-sm flex items-center justify-between p-2 hover:bg-secondary rounded">
                        <span>
                          {label}: {metrics.length} records
                        </span>
                        <span className="text-muted-foreground">
                          Latest: {latest.value} {latest.unit} ({new Date(latest.date).toLocaleDateString()})
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>Note: This will import the last 30 days of health metrics from {shareData.sender_name || 'the sender'}.</p>
              </div>
            </div>
          )}

          <Button
            onClick={handleImport}
            disabled={importing || imported}
            className="w-full"
          >
            {importing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : imported ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Imported Successfully
              </>
            ) : (
              'Import Data'
            )}
          </Button>
        </Card>
      )}
    </div>
  );
}
