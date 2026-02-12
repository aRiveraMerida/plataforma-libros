import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const TEMARIO_PATH = path.join(process.cwd(), 'temario');

const subjectIcons: Record<string, string> = {
  'programacion': '💻',
  'bases-de-datos': '🗄️',
  'sistemas-informaticos': '🖥️',
  'entornos-de-desarrollo': '⚙️',
  'lenguajes-de-marcas': '🌐',
};

const subjectNames: Record<string, string> = {
  'programacion': 'Programación',
  'bases-de-datos': 'Bases de Datos',
  'sistemas-informaticos': 'Sistemas Informáticos',
  'entornos-de-desarrollo': 'Entornos de Desarrollo',
  'lenguajes-de-marcas': 'Lenguajes de Marcas',
};

export async function GET() {
  try {
    const subjects = fs.readdirSync(TEMARIO_PATH, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => {
        const subjectPath = path.join(TEMARIO_PATH, dirent.name);
        const files = fs.readdirSync(subjectPath).filter(f => f.endsWith('.md'));
        
        return {
          id: dirent.name,
          name: subjectNames[dirent.name] || dirent.name,
          icon: subjectIcons[dirent.name] || '📖',
          fileCount: files.length,
        };
      });

    return NextResponse.json(subjects);
  } catch (error) {
    console.error('Error reading subjects:', error);
    return NextResponse.json([], { status: 500 });
  }
}
