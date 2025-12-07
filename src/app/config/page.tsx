"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react";

interface HealthCheck {
  status: 'healthy' | 'unhealthy' | 'error';
  environment: {
    success: boolean;
    missing: string[];
    message: string;
  };
  database: {
    success: boolean;
    message: string;
  };
  timestamp: string;
}

export default function ConfigPage() {
  const [health, setHealth] = useState<HealthCheck | null>(null);
  const [loading, setLoading] = useState(true);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      setHealth(data);
    } catch (error) {
      console.error('Failed to check health:', error);
      setHealth({
        status: 'error',
        environment: { success: false, missing: [], message: 'Failed to check environment' },
        database: { success: false, message: 'Failed to check database' },
        timestamp: new Date().toISOString(),
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    );
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      healthy: 'bg-green-100 text-green-800',
      unhealthy: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
    };
    return (
      <Badge className={colors[status as keyof typeof colors] || colors.error}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Configuration Status</h1>
          <p className="text-slate-300">
            Check if your application is properly configured
          </p>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={checkHealth}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh Status
          </Button>
        </div>

        {health && (
          <div className="grid gap-6">
            <Card className="p-6 bg-slate-800/50 border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Overall Status</h2>
                {getStatusBadge(health.status)}
              </div>
              <p className="text-slate-300 text-sm">
                Last checked: {new Date(health.timestamp).toLocaleString()}
              </p>
            </Card>

            <Card className="p-6 bg-slate-800/50 border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                {getStatusIcon(health.environment.success)}
                <h3 className="text-lg font-medium text-white">Environment Variables</h3>
              </div>
              <p className="text-slate-300 mb-3">{health.environment.message}</p>
              {health.environment.missing.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-200">Missing variables:</p>
                  <div className="flex flex-wrap gap-2">
                    {health.environment.missing.map((variable) => (
                      <Badge key={variable} variant="outline" className="border-red-500 text-red-400">
                        {variable}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            <Card className="p-6 bg-slate-800/50 border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                {getStatusIcon(health.database.success)}
                <h3 className="text-lg font-medium text-white">Database Connection</h3>
              </div>
              <p className="text-slate-300">{health.database.message}</p>
            </Card>

            {!health.environment.success && (
              <Card className="p-6 bg-blue-900/20 border-blue-500/50">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="h-5 w-5 text-blue-400" />
                  <h3 className="text-lg font-medium text-white">Setup Instructions</h3>
                </div>
                <div className="space-y-3 text-sm text-slate-300">
                  <p>To fix the configuration issues:</p>
                  <ol className="list-decimal list-inside space-y-2 ml-4">
                    <li>Copy the <code>.env.local.example</code> file to <code>.env.local</code></li>
                    <li>Set up a PostgreSQL database (Vercel, Supabase, PlanetScale, etc.)</li>
                    <li>Get your Gemini API key from <a href="https://aistudio.google.com/app/apikey" className="text-blue-400 underline" target="_blank">Google AI Studio</a></li>
                    <li>Get your E2B API key from <a href="https://e2b.dev" className="text-blue-400 underline" target="_blank">E2B</a></li>
                    <li>Update all the placeholder values in your <code>.env.local</code> file</li>
                    <li>Run <code>npm run db:push</code> to set up your database schema</li>
                  </ol>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}