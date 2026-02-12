import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const TEMARIO_PATH = path.join(process.cwd(), 'temario');

export async function GET(
  request: Request,
  { params }: { params: Promise<{ subject: string; file: string }> }
) {
  try {
    const { subject, file } = await params;
    const filePath = path.join(TEMARIO_PATH, subject, `${file}.md`);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 404 });
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const firstLine = content.split('\n')[0];
    const title = firstLine.replace(/^#\s*/, '') || file;

    return NextResponse.json({ 
      content,
      title,
      filename: `${file}.md`
    });
  } catch (error) {
    console.error('Error reading file:', error);
    return NextResponse.json({ error: 'Error al leer el archivo' }, { status: 500 });
  }
}
