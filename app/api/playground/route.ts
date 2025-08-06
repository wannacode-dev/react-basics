import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

// Путь к папке playground
const PLAYGROUND_DIR = path.join(process.cwd(), 'playground')
const SRC_DIR = path.join(process.cwd(), 'src')

// Убеждаемся, что папка playground существует
async function ensurePlaygroundDir() {
  try {
    await fs.access(PLAYGROUND_DIR)
  } catch {
    await fs.mkdir(PLAYGROUND_DIR, { recursive: true })
  }
}

// Функция для создания HTML обертки для разных типов файлов
function createHtmlWrapper(content: string, filePath: string): string {
  const extension = path.extname(filePath).toLowerCase()
  const fileName = path.basename(filePath)
  
  switch (extension) {
    case '.html':
      // Проверяем, содержит ли HTML файл React код
      if (content.includes('React') || content.includes('ReactDOM') || content.includes('type="text/babel"')) {
        // Если есть React, но нет импортов React и Babel, добавляем их
        if (!content.includes('react@18') && !content.includes('@babel/standalone')) {
          // Добавляем React и Babel в head
          const reactScripts = `
    <!-- React и Babel добавлены автоматически -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>`
          
          // Ищем тег head и вставляем скрипты перед его закрытием
          if (content.includes('</head>')) {
            return content.replace('</head>', `${reactScripts}\n</head>`)
          } else {
            // Если нет head тега, добавляем его
            const headWithScripts = `<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">${reactScripts}
</head>`
            return content.replace(/(<html[^>]*>)/i, `$1\n${headWithScripts}`)
          }
        }
      }
      return content
      
    case '.jsx':
      return `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React JSX - ${fileName}</title>
    
    <!-- React и Babel -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            margin: 0;
            padding: 0;
            background: #ffffff;
        }
        #root {
            min-height: 100vh;
            width: 100%;
        }
        .error {
            color: #dc2626;
            background: #fef2f2;
            border: 1px solid #fecaca;
            padding: 20px;
            margin: 20px;
            border-radius: 8px;
            font-family: monospace;
            white-space: pre-wrap;
        }
        
        /* Базовые стили для кнопок и элементов */
        button {
            cursor: pointer;
            border: none;
            outline: none;
            font-family: inherit;
        }
        
        button:hover {
            opacity: 0.9;
        }
        
        * {
            box-sizing: border-box;
        }
    </style>
</head>
<body>
    <div id="root"></div>
    
    <script type="text/babel">
        try {
            ${content}
        } catch (error) {
            console.error('React Error:', error);
            document.getElementById('root').innerHTML = 
                '<div class="error"><strong>Ошибка React:</strong>\\n' + error.message + '</div>';
        }
    </script>
</body>
</html>`

    case '.js':
      return `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JavaScript - ${fileName}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            margin: 0;
            padding: 20px;
            background: #f8fafc;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: #3b82f6;
            color: white;
            padding: 16px 24px;
            font-weight: 600;
        }
        .content {
            padding: 24px;
        }
        #output {
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            padding: 16px;
            margin-top: 16px;
            min-height: 200px;
            background: #f8fafc;
        }
        .error {
            color: #dc2626;
            background: #fef2f2;
            border: 1px solid #fecaca;
            padding: 12px;
            border-radius: 4px;
            margin-top: 16px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            JavaScript: ${fileName}
        </div>
        <div class="content">
            <div id="output">Загрузка...</div>
        </div>
    </div>
    
    <script>
        try {
            // Выполняем JavaScript код
            const output = document.getElementById('output');
            
            // Перехватываем console.log
            const originalLog = console.log;
            const logs = [];
            console.log = function(...args) {
                logs.push(args.join(' '));
                originalLog.apply(console, args);
                updateOutput();
            };
            
            function updateOutput() {
                if (logs.length > 0) {
                    output.innerHTML = '<h3>Вывод консоли:</h3><pre>' + logs.join('\\n') + '</pre>';
                } else {
                    output.innerHTML = '<p>Код выполнен. Проверьте консоль браузера для вывода.</p>';
                }
            }
            
            // Выполняем код
            ${content}
            
            // Если нет логов, показываем сообщение
            if (logs.length === 0) {
                updateOutput();
            }
        } catch (error) {
            document.getElementById('output').innerHTML = 
                '<div class="error"><strong>Ошибка:</strong> ' + error.message + '</div>';
        }
    </script>
</body>
</html>`

    case '.css':
      return `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSS - ${fileName}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 20px; background: #f8fafc; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden; }
        .header { background: #10b981; color: white; padding: 16px 24px; font-weight: 600; }
        .demo { padding: 24px; border-bottom: 1px solid #e2e8f0; }
        .code { padding: 24px; background: #f8fafc; }
        pre { margin: 0; overflow-x: auto; }
        
        /* Применяем CSS */
        ${content}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            CSS Стили: ${fileName}
        </div>
        <div class="demo">
            <h3>Демонстрация стилей</h3>
            <div class="demo-content">
                <p>Пример текста для демонстрации CSS стилей.</p>
                <button>Пример кнопки</button>
                <div style="width: 100px; height: 100px; background: #3b82f6; margin: 16px 0;"></div>
            </div>
        </div>
        <div class="code">
            <h3>Код CSS:</h3>
            <pre><code>${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
        </div>
    </div>
</body>
</html>`

    default:
      return `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Предварительный просмотр - ${fileName}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 20px; background: #f8fafc; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); padding: 24px; }
        .header { color: #64748b; font-weight: 600; margin-bottom: 16px; }
        pre { background: #f8fafc; padding: 16px; border-radius: 4px; overflow-x: auto; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">Файл: ${fileName}</div>
        <pre><code>${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
    </div>
</body>
</html>`
  }
}

// Получить файл из playground
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const file = searchParams.get('file')
    
    if (!file) {
      return NextResponse.json({ error: 'File parameter is required' }, { status: 400 })
    }

    await ensurePlaygroundDir()
    
    // Убираем префикс src/ и заменяем на playground/
    const cleanFile = file.replace(/^src\//, '')
    const playgroundFile = path.join(PLAYGROUND_DIR, cleanFile)
    
    let content: string
    
    try {
      content = await fs.readFile(playgroundFile, 'utf8')
    } catch (error) {
      // Если файл не существует в playground, копируем из src
      const srcFile = path.join(SRC_DIR, cleanFile)
      try {
        content = await fs.readFile(srcFile, 'utf8')
        
        // Создаем директории если нужно
        const playgroundDir = path.dirname(playgroundFile)
        await fs.mkdir(playgroundDir, { recursive: true })
        
        // Копируем файл в playground
        await fs.writeFile(playgroundFile, content, 'utf8')
      } catch (srcError) {
        return NextResponse.json({ error: 'File not found in src or playground' }, { status: 404 })
      }
    }
    
    // Создаем HTML обертку для файла
    const wrappedContent = createHtmlWrapper(content, file)
    
    return new NextResponse(wrappedContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    })
  } catch (error) {
    console.error('Error reading playground file:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Копировать файл из src в playground
export async function POST(request: NextRequest) {
  try {
    const { file } = await request.json()
    
    if (!file) {
      return NextResponse.json({ error: 'File parameter is required' }, { status: 400 })
    }

    await ensurePlaygroundDir()
    
    // Убираем префикс src/ 
    const cleanFile = file.replace(/^src\//, '')
    const srcFile = path.join(SRC_DIR, cleanFile)
    const playgroundFile = path.join(PLAYGROUND_DIR, cleanFile)
    
    try {
      const content = await fs.readFile(srcFile, 'utf8')
      
      // Создаем директории если нужно
      const playgroundDir = path.dirname(playgroundFile)
      await fs.mkdir(playgroundDir, { recursive: true })
      
      // Копируем файл в playground
      await fs.writeFile(playgroundFile, content, 'utf8')
      
      return NextResponse.json({ success: true, message: 'File copied to playground' })
    } catch (error) {
      return NextResponse.json({ error: 'File not found in src' }, { status: 404 })
    }
  } catch (error) {
    console.error('Error copying file to playground:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Сохранить файл в playground
export async function PUT(request: NextRequest) {
  try {
    const { file, content } = await request.json()
    
    if (!file || content === undefined) {
      return NextResponse.json({ error: 'File and content parameters are required' }, { status: 400 })
    }

    await ensurePlaygroundDir()
    
    // Убираем префикс src/ 
    const cleanFile = file.replace(/^src\//, '')
    const playgroundFile = path.join(PLAYGROUND_DIR, cleanFile)
    
    // Создаем директории если нужно
    const playgroundDir = path.dirname(playgroundFile)
    await fs.mkdir(playgroundDir, { recursive: true })
    
    // Сохраняем файл в playground
    await fs.writeFile(playgroundFile, content, 'utf8')
    
    return NextResponse.json({ success: true, message: 'File saved to playground' })
  } catch (error) {
    console.error('Error saving file to playground:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Сбросить playground (удалить все файлы или конкретный файл)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const file = searchParams.get('file')
    
    await ensurePlaygroundDir()
    
    if (file) {
      // Удаляем конкретный файл и копируем из src
      const cleanFile = file.replace(/^src\//, '')
      const srcFile = path.join(SRC_DIR, cleanFile)
      const playgroundFile = path.join(PLAYGROUND_DIR, cleanFile)
      
      try {
        // Удаляем файл из playground
        await fs.unlink(playgroundFile)
      } catch {
        // Файл может не существовать, это нормально
      }
      
      try {
        // Копируем свежую версию из src
        const content = await fs.readFile(srcFile, 'utf8')
        
        // Создаем директории если нужно
        const playgroundDir = path.dirname(playgroundFile)
        await fs.mkdir(playgroundDir, { recursive: true })
        
        await fs.writeFile(playgroundFile, content, 'utf8')
        
        return NextResponse.json({ success: true, message: 'File reset from src' })
      } catch (error) {
        return NextResponse.json({ error: 'File not found in src' }, { status: 404 })
      }
    } else {
      // Удаляем всю папку playground
      try {
        await fs.rm(PLAYGROUND_DIR, { recursive: true, force: true })
        await ensurePlaygroundDir()
        return NextResponse.json({ success: true, message: 'Playground reset' })
      } catch (error) {
        return NextResponse.json({ error: 'Error resetting playground' }, { status: 500 })
      }
    }
  } catch (error) {
    console.error('Error resetting playground:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 