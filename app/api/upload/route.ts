import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { writeFile } from 'fs/promises';
import path from 'path';
import { validateImageUpload } from '@/lib/security';

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const validation = validateImageUpload({
    bytes: new Uint8Array(buffer),
    byteLength: buffer.byteLength,
  });

  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const detectedExt = 'ext' in validation ? validation.ext : 'bin';
  const filename = `upload-${Date.now()}.${detectedExt}`;
  const filePath = path.join(process.cwd(), 'public', 'uploads', filename);
  await writeFile(filePath, buffer);

  return NextResponse.json({ url: `/uploads/${filename}` });
}
