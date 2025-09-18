import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    status: 'healthy', 
    service: 'DFIP Dashboard Frontend',
    timestamp: new Date().toISOString()
  });
}