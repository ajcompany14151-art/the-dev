import { NextResponse } from 'next/server';
import { checkDatabaseConnection, checkEnvironmentVariables } from '@/lib/config-check';

export async function GET() {
  try {
    // Check environment variables
    const envCheck = checkEnvironmentVariables();
    
    // Check database connection
    const dbCheck = await checkDatabaseConnection();
    
    return NextResponse.json({
      status: envCheck.success && dbCheck.success ? 'healthy' : 'unhealthy',
      environment: envCheck,
      database: dbCheck,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}