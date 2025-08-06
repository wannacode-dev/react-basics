#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

// Цвета для консоли
const colors = {
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Определяем платформу
const isWindows = os.platform() === 'win32';
const isLinux = os.platform() === 'linux';
const isMac = os.platform() === 'darwin';

// Кроссплатформенное выполнение команд
function execCommand(command, options = {}) {
  const defaultOptions = {
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 10, // 10MB buffer
    ...options
  };
  
  // На Windows может потребоваться shell: true для некоторых команд
  if (isWindows && !options.shell) {
    defaultOptions.shell = true;
  }
  
  try {
    return execSync(command, defaultOptions);
  } catch (error) {
    // Улучшаем сообщения об ошибках для разных платформ
    if (error.code === 'ENOENT') {
      throw new Error(`Команда не найдена: ${command.split(' ')[0]}. Убедитесь что она установлена и добавлена в PATH.`);
    }
    throw error;
  }
}

// Экранирование путей для команд shell (особенно важно для Windows)
function escapePath(filePath) {
  // Если путь содержит пробелы, оборачиваем в кавычки
  if (filePath.includes(' ')) {
    return isWindows ? `"${filePath}"` : `'${filePath}'`;
  }
  return filePath;
}

// Функция для сравнения версий
function compareVersions(current, required) {
  const currentParts = current.split('.').map(Number);
  const requiredParts = required.split('.').map(Number);
  
  for (let i = 0; i < Math.max(currentParts.length, requiredParts.length); i++) {
    const currentPart = currentParts[i] || 0;
    const requiredPart = requiredParts[i] || 0;
    
    if (currentPart > requiredPart) return 1;
    if (currentPart < requiredPart) return -1;
  }
  return 0;
}

// Проверка версий Node.js и npm
function checkVersions() {
  try {
    // Проверяем Node.js
    const nodeVersion = process.version.replace('v', '');
    if (compareVersions(nodeVersion, REQUIREMENTS.node) < 0) {
      log(`❌ Требуется Node.js ${REQUIREMENTS.node}+, установлена ${nodeVersion}`, 'red');
      return false;
    }
    log(`✅ Node.js ${nodeVersion} - OK (${os.platform()})`, 'green');

    // Проверяем npm
    const npmVersion = execCommand('npm --version', { stdio: 'pipe' }).trim();
    if (compareVersions(npmVersion, REQUIREMENTS.npm) < 0) {
      log(`❌ Требуется npm ${REQUIREMENTS.npm}+, установлена ${npmVersion}`, 'red');
      return false;
    }
    log(`✅ npm ${npmVersion} - OK`, 'green');

    return true;
  } catch (error) {
    log(`❌ Ошибка проверки версий: ${error.message}`, 'red');
    return false;
  }
}

// Создание полного бэкапа проекта
async function createFullBackup() {
  const backupDir = path.join(process.cwd(), '.backup-' + Date.now());
  
  try {
    log('💾 Создаем полный бэкап проекта...', 'blue');
    
    // Копируем все кроме node_modules и .git
    const itemsToBackup = fs.readdirSync(process.cwd()).filter(item => 
      !['node_modules', '.git', '.next', '.backup-*'].some(exclude => 
        item.startsWith(exclude.replace('*', ''))
      )
    );
    
    fs.ensureDirSync(backupDir);
    
    // На Unix системах устанавливаем права доступа
    if (!isWindows) {
      try {
        fs.chmodSync(backupDir, 0o755);
      } catch (error) {
        log('⚠️  Не удалось установить права доступа для бэкапа (не критично)', 'yellow');
      }
    }
    
    for (const item of itemsToBackup) {
      const srcPath = path.join(process.cwd(), item);
      const destPath = path.join(backupDir, item);
      
      try {
        fs.copySync(srcPath, destPath, {
          preserveTimestamps: true,
          errorOnExist: false,
          overwrite: true
        });
      } catch (error) {
        // На некоторых системах могут быть проблемы с правами доступа
        if (error.code === 'EPERM' || error.code === 'EACCES') {
          log(`⚠️  Проблемы с правами доступа при копировании ${item} (пропускаем)`, 'yellow');
          continue;
        }
        throw error;
      }
    }
    
    log(`💾 Бэкап создан: ${path.basename(backupDir)}`, 'green');
    return backupDir;
  } catch (error) {
    log(`❌ Ошибка создания бэкапа: ${error.message}`, 'red');
    
    // Даем дополнительные советы в зависимости от платформы
    if (error.code === 'EPERM' || error.code === 'EACCES') {
      if (isWindows) {
        log('💡 Windows: Попробуйте запустить командную строку от имени администратора', 'yellow');
      } else {
        log('💡 Unix: Проверьте права доступа к папке проекта', 'yellow');
      }
    }
    
    throw error;
  }
}

// Откат изменений из бэкапа
async function rollbackFromBackup(backupDir) {
  try {
    log('🔄 Откатываем изменения из бэкапа...', 'yellow');
    
    if (!fs.existsSync(backupDir)) {
      throw new Error('Папка бэкапа не найдена');
    }
    
    // Восстанавливаем файлы из бэкапа
    const itemsToRestore = fs.readdirSync(backupDir);
    
    for (const item of itemsToRestore) {
      const srcPath = path.join(backupDir, item);
      const destPath = path.join(process.cwd(), item);
      
      // Удаляем текущую версию
      if (fs.existsSync(destPath)) {
        fs.removeSync(destPath);
      }
      
      // Восстанавливаем из бэкапа
      fs.copySync(srcPath, destPath);
    }
    
    log('✅ Откат выполнен успешно', 'green');
    return true;
  } catch (error) {
    log(`❌ Ошибка отката: ${error.message}`, 'red');
    return false;
  }
}

// URL template репозитория
const TEMPLATE_REPO = 'https://github.com/wannacode-dev/local-ui.git';

// Файлы и папки которые нужно обновить из template
const FILES_TO_UPDATE = [
  'app/',
  'package.json',
  'next.config.js',
  'tsconfig.json',
  'next-env.d.ts',
  '.gitignore'
];

// Файлы которые НЕ нужно трогать (задания курса)
const PRESERVE_FILES = [
  'src/',
  'README.md',
  '.git/',
  'node_modules/'
];

// Минимальные требования к версиям
const REQUIREMENTS = {
  node: '16.0.0',
  npm: '8.0.0'
};

async function updateCourse() {
  log('🚀 Обновляем курс из template репозитория...', 'blue');
  
  // Проверяем что мы в корректной директории
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    log('❌ Файл package.json не найден. Убедитесь что вы в корневой папке проекта.', 'red');
    process.exit(1);
  }

  // Проверяем версии Node.js и npm
  log('🔍 Проверяем версии...', 'blue');
  if (!checkVersions()) {
    log('❌ Обновите Node.js и npm до требуемых версий', 'red');
    process.exit(1);
  }

  // Создаем полный бэкап перед началом
  let backupDir;
  try {
    log('💾 Создаем полный бэкап проекта...', 'blue');
    backupDir = await createFullBackup();
    log(`✅ Бэкап создан: ${path.basename(backupDir)}`, 'green');
  } catch (error) {
    log('❌ Не удалось создать бэкап. Обновление прервано.', 'red');
    process.exit(1);
  }

  // Удаляем кэш Next.js если он есть
  const nextCacheDir = path.join(process.cwd(), '.next');
  if (fs.existsSync(nextCacheDir)) {
    log('🧹 Очищаем кэш Next.js...', 'blue');
    try {
      fs.removeSync(nextCacheDir);
      log('✅ Кэш Next.js очищен', 'green');
    } catch (error) {
      log('⚠️  Не удалось очистить кэш Next.js (не критично)', 'yellow');
    }
  }

  // Создаем временную папку
  const tempDir = path.join(process.cwd(), '.temp-update');
  
  try {
    log('📡 Клонируем template репозиторий...', 'blue');
    
    // Удаляем временную папку если она существует
    if (fs.existsSync(tempDir)) {
      fs.removeSync(tempDir);
    }
    
    // Клонируем template
    const escapedTempDir = escapePath(tempDir);
    execCommand(`git clone --depth 1 "${TEMPLATE_REPO}" ${escapedTempDir}`, { 
      stdio: 'pipe' 
    });
    
    log('💾 Сохраняем файлы курса...', 'blue');
    
    // Создаем backup папку
    const tempBackupDir = path.join(tempDir, 'backup');
    fs.ensureDirSync(tempBackupDir);
    
    // Сохраняем файлы которые не должны перезаписываться
    for (const preserveFile of PRESERVE_FILES) {
      const srcPath = path.join(process.cwd(), preserveFile);
      const backupPath = path.join(tempBackupDir, preserveFile);
      
      if (fs.existsSync(srcPath)) {
        log(`  💾 Сохраняем ${preserveFile}`, 'yellow');
        fs.copySync(srcPath, backupPath);
      }
    }
    
    log('🔄 Обновляем файлы платформы...', 'blue');
    
    // Копируем обновленные файлы из template
    for (const fileToUpdate of FILES_TO_UPDATE) {
      const srcPath = path.join(tempDir, fileToUpdate);
      const destPath = path.join(process.cwd(), fileToUpdate);
      
      if (fs.existsSync(srcPath)) {
        log(`  ✅ Обновляем ${fileToUpdate}`, 'green');
        
        // Удаляем старую версию если это папка
        if (fileToUpdate.endsWith('/') && fs.existsSync(destPath)) {
          fs.removeSync(destPath);
        }
        
        fs.copySync(srcPath, destPath);
      } else {
        log(`  ⚠️  Файл ${fileToUpdate} не найден в template`, 'yellow');
      }
    }
    
    log('🔄 Восстанавливаем файлы курса...', 'blue');
    
    // Восстанавливаем сохраненные файлы
    for (const preserveFile of PRESERVE_FILES) {
      const backupPath = path.join(tempBackupDir, preserveFile);
      const destPath = path.join(process.cwd(), preserveFile);
      
      if (fs.existsSync(backupPath)) {
        log(`  ✅ Восстанавливаем ${preserveFile}`, 'green');
        fs.copySync(backupPath, destPath);
      }
    }
    
    log('📦 Устанавливаем зависимости...', 'blue');
    
    // Устанавливаем зависимости
    try {
      execCommand('npm install', { stdio: 'inherit' });
      log('✅ Зависимости установлены', 'green');
    } catch (error) {
      throw new Error(`Ошибка установки зависимостей: ${error.message}`);
    }

    // Проверяем что проект запускается
    log('🧪 Проверяем работоспособность...', 'blue');
    try {
      execCommand('npm run lint --silent', { stdio: 'pipe' });
      log('✅ Линтер прошел успешно', 'green');
    } catch (error) {
      log('⚠️  Предупреждения линтера (не критично)', 'yellow');
    }

    // Автоматически коммитим изменения
    log('📝 Коммитим изменения...', 'blue');
    try {
      execCommand('git add .', { stdio: 'pipe' });
      execCommand('git commit -m "Update platform from template"', { stdio: 'pipe' });
      log('✅ Изменения закоммичены', 'green');
    } catch (error) {
      log('⚠️  Не удалось закоммитить изменения (не критично)', 'yellow');
      log('   Можете сделать коммит вручную', 'yellow');
    }
    
    // Очищаем бэкап если все прошло успешно
    if (backupDir && fs.existsSync(backupDir)) {
      try {
        fs.removeSync(backupDir);
        log(`🧹 Полный бэкап очищен: ${path.basename(backupDir)}`, 'blue');
      } catch (error) {
        log(`⚠️  Не удалось удалить бэкап: ${path.basename(backupDir)}`, 'yellow');
        log('   Можете удалить вручную если больше не нужен', 'yellow');
      }
    }

    log('🎉 Курс успешно обновлен!', 'bold');
    log('🚀 Можете запускать: npm start', 'green');
    
  } catch (error) {
    log(`❌ Критическая ошибка обновления: ${error.message}`, 'red');
    
    // Пытаемся откатить изменения
    if (backupDir) {
      log('🔄 Пытаемся откатить изменения...', 'yellow');
      const rollbackSuccess = await rollbackFromBackup(backupDir);
      
      if (rollbackSuccess) {
        log('✅ Изменения откачены, проект в исходном состоянии', 'green');
        log(`💾 Бэкап сохранен: ${path.basename(backupDir)}`, 'blue');
      } else {
        log('❌ Откат не удался! Восстановите проект вручную из бэкапа:', 'red');
        log(`📁 Бэкап: ${backupDir}`, 'yellow');
      }
    } else {
      log('❌ Бэкап не создан! Проверьте состояние проекта.', 'red');
    }
    
    process.exit(1);
  } finally {
    // Очищаем временную папку
    if (fs.existsSync(tempDir)) {
      try {
        fs.removeSync(tempDir);
        log('🧹 Временные файлы очищены', 'blue');
      } catch (error) {
        log('⚠️  Не удалось очистить временные файлы', 'yellow');
      }
    }
  }
}

// Проверяем доступность git
try {
  execCommand('git --version', { stdio: 'pipe' });
  log('🔧 Проверка инструментов...', 'blue');
} catch (error) {
  log('❌ Git не найден. Установите Git для работы скрипта.', 'red');
  if (isWindows) {
    log('💡 Windows: Скачайте Git с https://git-scm.com/download/win', 'yellow');
  } else if (isMac) {
    log('💡 macOS: Установите через "brew install git" или Xcode Command Line Tools', 'yellow');
  } else if (isLinux) {
    log('💡 Linux: Установите через пакетный менеджер, например "sudo apt install git"', 'yellow');
  }
  process.exit(1);
}

// Запускаем обновление
updateCourse(); 