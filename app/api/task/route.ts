import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Функция для рекурсивного сканирования директории
function scanDirectory(dir: string): any[] {
  if (!fs.existsSync(dir)) {
    return []
  }

  const items = fs.readdirSync(dir)
  const tasks: any[] = []

  for (const item of items) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      // Рекурсивно проверяем все поддиректории
      tasks.push(...scanDirectory(fullPath))
    } else if (item.includes('.problem.') && 
              (item.endsWith('.html') || item.endsWith('.js') || item.endsWith('.jsx'))) {
      // Нашли файл задания
      try {
        const content = fs.readFileSync(fullPath, 'utf-8')
        const relativePath = path.relative(path.join(process.cwd(), '..', 'src'), fullPath)
        
        // Получаем имя темы (родительская директория)
        const pathParts = relativePath.split(path.sep)
        const chapter = pathParts[0]
        
        // Извлекаем название задания (первая строка после "Задание:")
        const nameMatch = content.match(/Задание:\s*([^\n]*)/);
        const name = nameMatch ? nameMatch[1].trim() : item;

        // Извлекаем полное описание задания
        const descMatch = content.match(/\/\*\s*Задание:[\s\S]*?\*\//) ||
                        content.match(/<!--\s*Задание:[\s\S]*?-->/) ||
                        [null, ''];

        tasks.push({
          name: name,
          description: descMatch[0] || '',
          file: relativePath.replace(/\\/g, '/'),
          chapter: chapter
        });
      } catch (error) {
        console.error(`Ошибка чтения файла в ${fullPath}:`, error);
      }
    }
  }

  return tasks
}

export async function GET() {
  try {
    const srcPath = path.join(process.cwd(), '..', 'src')
    
    if (!fs.existsSync(srcPath)) {
      console.log('Директория src не найдена')
      return NextResponse.json([])
    }

    // Получаем все задания
    const allTasks = scanDirectory(srcPath)
    console.log('Найдено заданий:', allTasks.length)
    
    // Группируем задания по темам
    const chapters: { [key: string]: any } = {}
    allTasks.forEach(task => {
      if (!chapters[task.chapter]) {
        chapters[task.chapter] = {
          chapter: task.chapter,
          originalChapter: task.chapter,
          tasks: []
        }
      }
      chapters[task.chapter].tasks.push({
        name: task.name,
        description: task.description,
        file: task.file
      })
    })

    // Преобразуем объект в массив и сортируем темы по оригинальным названиям
    const result = Object.values(chapters)
      .sort((a: any, b: any) => a.originalChapter.localeCompare(b.originalChapter))

    console.log(`Найдено тем: ${result.length}`)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Ошибка при сканировании заданий:', error)
    return NextResponse.json({ error: 'Ошибка при сканировании заданий' }, { status: 500 })
  }
} 