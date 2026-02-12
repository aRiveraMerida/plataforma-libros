import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const TEMARIO_PATH = path.join(process.cwd(), 'temario');

export async function GET(
  request: Request,
  { params }: { params: Promise<{ subject: string }> }
) {
  try {
    const { subject } = await params;
    const subjectPath = path.join(TEMARIO_PATH, subject);

    if (!fs.existsSync(subjectPath)) {
      return NextResponse.json({ error: 'Asignatura no encontrada' }, { status: 404 });
    }

    const files = fs.readdirSync(subjectPath)
      .filter(f => f.endsWith('.md'))
      .map(f => {
        const filePath = path.join(subjectPath, f);
        const content = fs.readFileSync(filePath, 'utf-8');
        const firstLine = content.split('\n')[0];
        const title = firstLine.replace(/^#\s*/, '') || f.replace('.md', '');
        
        return {
          id: f.replace('.md', ''),
          filename: f,
          title,
        };
      });

    return NextResponse.json(files);
  } catch (error) {
    console.error('Error reading files:', error);
    return NextResponse.json([], { status: 500 });
  }
}
