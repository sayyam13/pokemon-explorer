import { NextRequest, NextResponse } from 'next/server';

const POKEMON_API_BASE = process.env.POKEMON_API_BASE;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Validate ID
    if (!id || (isNaN(Number(id)) && typeof id !== 'string')) {
      return NextResponse.json(
        { error: 'Invalid Pokemon ID' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${POKEMON_API_BASE}/pokemon/${id.toLowerCase()}`,
      {
        next: { revalidate: 3600 } // Cache for 1 hour
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Pokemon not found' },
          { status: 404 }
        );
      }
      throw new Error(`Failed to fetch Pokemon: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Pokemon:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Pokemon' },
      { status: 500 }
    );
  }
}