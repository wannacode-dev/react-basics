import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const file = searchParams.get('file')
    const liveReload = searchParams.get('live') === 'true'
    
    if (!file) {
      return NextResponse.json({ error: 'File parameter is required' }, { status: 400 })
    }

    const projectRoot = process.cwd()
    const playgroundPath = path.join(projectRoot, 'playground')
    const srcPath = path.join(projectRoot, 'src')
    
    // Убираем префикс src/ если есть
    const cleanFile = file.replace(/^src\//, '')
    const filePath = path.join(playgroundPath, cleanFile)
    const srcFilePath = path.join(srcPath, cleanFile)
    
    let content: string
    
    // Пытаемся получить файл из playground
    if (fs.existsSync(filePath)) {
      content = fs.readFileSync(filePath, 'utf-8')
    } else if (fs.existsSync(srcFilePath)) {
      // Если файл есть в src, копируем его в playground
      content = fs.readFileSync(srcFilePath, 'utf-8')
      
      // Создаем директории если нужно
      const playgroundDir = path.dirname(filePath)
      if (!fs.existsSync(playgroundDir)) {
        fs.mkdirSync(playgroundDir, { recursive: true })
      }
      
      // Копируем файл в playground
      fs.writeFileSync(filePath, content, 'utf-8')
    } else {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }
    const extension = path.extname(file).toLowerCase()
    
    // Создаем HTML обертку для разных типов файлов
    let wrappedContent: string
    
    // Добавляем скрипт для live reload, если запрошен
    const liveReloadScript = liveReload ? `
    <script>
      // Live reload functionality
      let lastContent = null;
      let isReloading = false;
      
      async function checkForChanges() {
        if (isReloading) return;
        
        try {
          const response = await fetch('/api/playground?file=${encodeURIComponent(file)}&t=' + Date.now());
          
          if (response.ok) {
            const newContent = await response.text();
            
            if (lastContent === null) {
              lastContent = newContent;
            } else if (lastContent !== newContent) {
              console.log('File changed, reloading...');
              isReloading = true;
              
              // Показываем уведомление об обновлении
              const notification = document.createElement('div');
              notification.innerHTML = '🔄 Файл изменен, обновляем...';
              notification.style.cssText = \`
                position: fixed;
                top: 50px;
                right: 10px;
                background: #f59e0b;
                color: white;
                padding: 12px 16px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 600;
                z-index: 10000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                animation: slideIn 0.3s ease;
              \`;
              document.body.appendChild(notification);
              
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            }
          }
        } catch (error) {
          // Уменьшаем спам в консоли - логируем ошибки только раз в 10 секунд
          if (!window.lastErrorLog || Date.now() - window.lastErrorLog > 10000) {
            console.warn('Live reload check failed:', error);
            window.lastErrorLog = Date.now();
          }
        }
      }
      
      // Проверяем изменения каждые 3 секунды (уменьшили частоту)
      const interval = setInterval(checkForChanges, 3000);
      
      // Показываем индикатор live reload
      const indicator = document.createElement('div');
      indicator.innerHTML = '🔄 Live Reload активен';
      indicator.style.cssText = \`
        position: fixed;
        top: 10px;
        right: 10px;
        background: #10b981;
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;
        z-index: 9999;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        cursor: pointer;
      \`;
      
      // Позволяем отключить live reload по клику
      indicator.addEventListener('click', () => {
        clearInterval(interval);
        indicator.innerHTML = '⏸️ Live Reload выключен';
        indicator.style.background = '#6b7280';
      });
      
      document.body.appendChild(indicator);
      
      // Добавляем CSS анимацию
      const style = document.createElement('style');
      style.textContent = \`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
      \`;
      document.head.appendChild(style);
      
      // Первая проверка через 1 секунду
      setTimeout(checkForChanges, 1000);
    </script>` : ''
    
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
              wrappedContent = content
                .replace('</head>', `${reactScripts}\n</head>`)
                .replace('</body>', `${liveReloadScript}</body>`)
            } else {
              // Если нет head тега, добавляем его
              const headWithScripts = `<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">${reactScripts}
</head>`
              wrappedContent = content
                .replace('<html', `<html`)
                .replace('>', `>${headWithScripts}`)
                .replace('</body>', `${liveReloadScript}</body>`)
            }
          } else {
            wrappedContent = content.replace('</body>', `${liveReloadScript}</body>`)
          }
        } else {
          wrappedContent = content.replace('</body>', `${liveReloadScript}</body>`)
        }
        break
        
      case '.js':
        wrappedContent = `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Предварительный просмотр - ${path.basename(file)}</title>
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
            Предварительный просмотр: ${path.basename(file)}
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
     ${liveReloadScript}
 </body>
 </html>`
        break
        
      case '.jsx':
        wrappedContent = `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React JSX - ${path.basename(file)}</title>
    
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
    
    ${liveReloadScript}
</body>
</html>`
        break
        
      case '.ts':
      case '.tsx':
        wrappedContent = `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Предварительный просмотр - ${path.basename(file)}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 20px; background: #f8fafc; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); padding: 24px; }
        .header { color: #3b82f6; font-weight: 600; margin-bottom: 16px; }
        pre { background: #f8fafc; padding: 16px; border-radius: 4px; overflow-x: auto; }
        .note { background: #fef3c7; border: 1px solid #f59e0b; padding: 12px; border-radius: 4px; margin-top: 16px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">TypeScript файл: ${path.basename(file)}</div>
        <div class="note">
            <strong>Примечание:</strong> TypeScript файлы требуют компиляции. Показан исходный код.
                 </div>
         <pre><code>${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
     </div>
     ${liveReloadScript}
 </body>
 </html>`
        break
        
      case '.css':
        wrappedContent = `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Предварительный просмотр CSS - ${path.basename(file)}</title>
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
            CSS Стили: ${path.basename(file)}
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
     ${liveReloadScript}
 </body>
 </html>`
        break
        
      default:
        wrappedContent = `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Предварительный просмотр - ${path.basename(file)}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 20px; background: #f8fafc; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); padding: 24px; }
        .header { color: #64748b; font-weight: 600; margin-bottom: 16px; }
        pre { background: #f8fafc; padding: 16px; border-radius: 4px; overflow-x: auto; }
    </style>
</head>
<body>
         <div class="container">
         <div class="header">Файл: ${path.basename(file)}</div>
         <pre><code>${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
     </div>
     ${liveReloadScript}
 </body>
 </html>`
    }

    return new NextResponse(wrappedContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    })

  } catch (error) {
    console.error('Error generating preview:', error)
    return NextResponse.json({ error: 'Failed to generate preview' }, { status: 500 })
  }
} 