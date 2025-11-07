import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, badgeColor } = await req.json();

    // Fetch the original image
    const imageResponse = await fetch(imageUrl);
    const imageBlob = await imageResponse.blob();
    const arrayBuffer = await imageBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create SVG badge
    const svgBadge = `
      <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
            <feOffset dx="2" dy="2" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <!-- Original image -->
        <image href="${imageUrl}" width="1024" height="1024"/>

        <!-- Badge circle -->
        <circle cx="850" cy="850" r="120" fill="${badgeColor}" filter="url(#shadow)"/>

        <!-- Text -->
        <text x="850" y="830"
              font-family="Arial, sans-serif"
              font-size="24"
              font-weight="700"
              fill="white"
              text-anchor="middle">TPO FREE</text>

        <text x="850" y="870"
              font-family="Arial, sans-serif"
              font-size="24"
              font-weight="700"
              fill="white"
              text-anchor="middle">HEMA FREE</text>
      </svg>
    `;

    return new NextResponse(svgBadge, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: any) {
    console.error('Error adding badge:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add badge' },
      { status: 500 }
    );
  }
}
