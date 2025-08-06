import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const taskFile = searchParams.get('task')
    
    if (!taskFile) {
      return NextResponse.json({ error: 'Task file parameter is required' }, { status: 400 })
    }

    // Получаем директорию задания
    const projectRoot = process.cwd()
    const srcPath = path.join(projectRoot, 'src')
    const taskPath = path.join(srcPath, taskFile)
    
    // Определяем директорию задания
    let taskDir: string
    
    // Если taskFile указывает на файл, получаем его директорию
    if (path.extname(taskFile)) {
      taskDir = path.dirname(taskPath)
    } else {
      taskDir = taskPath
    }

    // Проверяем структуру: если в директории есть только файлы, то это простая структура
    // если есть поддиректории, то это вложенная структура
    let searchDir = taskDir
    
    // Для файлов вида "01-тема/01-задание.problem.jsx" нужно найти все файлы с тем же префиксом
    if (path.extname(taskFile)) {
      const fileName = path.basename(taskFile)
      const taskMatch = fileName.match(/^(\d+-[^.]+)\./)
      
      if (taskMatch) {
        const taskPrefix = taskMatch[1]
        // Ищем все файлы с тем же префиксом в той же директории
        const allFiles = fs.readdirSync(taskDir, { withFileTypes: true })
        const hasTaskFolders = allFiles.some(f => f.isDirectory() && f.name.startsWith(taskPrefix))
        
        if (hasTaskFolders) {
          // Если есть папка с нужным префиксом, используем её
          searchDir = path.join(taskDir, taskPrefix)
        }
      }
    }

    if (!fs.existsSync(searchDir)) {
      return NextResponse.json({ error: 'Task directory not found' }, { status: 404 })
    }

    // Получаем префикс задания для фильтрации
    let taskPrefix = ''
    if (path.extname(taskFile)) {
      const fileName = path.basename(taskFile)
      const taskMatch = fileName.match(/^(\d+-[^.]+)\./)
      if (taskMatch) {
        taskPrefix = taskMatch[1]
      }
    }

    // Читаем все файлы в директории задания
    const files = fs.readdirSync(searchDir, { withFileTypes: true })
    
    const taskFiles = files
      .filter(file => {
        if (!file.isFile()) return false
        
        // Если есть префикс, фильтруем только файлы с этим префиксом
        if (taskPrefix) {
          return file.name.startsWith(taskPrefix + '.')
        }
        
        return true
      })
      .map(file => {
        const fileName = file.name
        const filePath = path.join(searchDir, fileName)
        const relativePath = path.relative(srcPath, filePath).replace(/\\/g, '/')
        
        // Определяем тип файла
        let fileType: 'problem' | 'solution' | 'other' = 'other'
        if (fileName.includes('.problem.') || fileName.includes('.проблема.')) {
          fileType = 'problem'
        } else if (fileName.includes('.solution.') || fileName.includes('.решение.')) {
          fileType = 'solution'
        }
        
        // Определяем расширение
        const extension = path.extname(fileName).toLowerCase()
        
        return {
          name: fileName,
          path: relativePath,
          type: fileType,
          extension,
          canOpenInVSCode: ['.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.json'].includes(extension)
        }
      })
      .sort((a, b) => {
        // Сортируем: сначала problem, потом solution, потом остальные
        const typeOrder = { problem: 0, solution: 1, other: 2 }
        const aOrder = typeOrder[a.type]
        const bOrder = typeOrder[b.type]
        
        if (aOrder !== bOrder) {
          return aOrder - bOrder
        }
        
        return a.name.localeCompare(b.name)
      })

    return NextResponse.json(taskFiles)
  } catch (error) {
    console.error('Error getting task files:', error)
    return NextResponse.json({ error: 'Failed to get task files' }, { status: 500 })
  }
} 