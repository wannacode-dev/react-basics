'use client'

import { useState, useEffect } from 'react'
import TaskSidebar from './components/TaskSidebar'
import TaskViewer from './components/TaskViewer'
import TaskDescription from './components/TaskDescription'
import { useSearchParams, useRouter } from 'next/navigation'
import styles from './page.module.css'

export default function Home() {
  const [selectedTask, setSelectedTask] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'problem' | 'solution'>('problem')
  const [tasks, setTasks] = useState<any[]>([])
  const [sidebarHidden, setSidebarHidden] = useState(false)
  const [isDescriptionHidden, setIsDescriptionHidden] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    loadTasks()
  }, [])

  useEffect(() => {
    const task = searchParams.get('task')
    
    if (task) {
      setSelectedTask(task)
      setViewMode(task.includes('.solution.') ? 'solution' : 'problem')
    }
  }, [searchParams])

  const loadTasks = async () => {
    try {
      const response = await fetch('/api/tasks')
      const data = await response.json()
      setTasks(data)
    } catch (error) {
      console.error('Ошибка загрузки заданий:', error)
    }
  }

  const handleTaskSelect = (taskFile: string) => {
    console.log('Task selected:', { taskFile })
    const url = new URL(window.location.href)
    url.searchParams.set('task', taskFile)
    router.push(url.pathname + url.search)
  }

  const handleViewModeChange = (mode: 'problem' | 'solution') => {
    console.log('View mode changed:', { mode })
    setViewMode(mode)
    const url = new URL(window.location.href)
    const currentTask = url.searchParams.get('task')
    if (currentTask) {
      const newTask = mode === 'solution' 
        ? currentTask.replace('.problem.', '.solution.')
        : currentTask.replace('.solution.', '.problem.')
      url.searchParams.set('task', newTask)
      router.push(url.pathname + url.search, { scroll: false })
    }
  }

  return (
    <div className={styles.container} style={{ 
      '--sidebar-hidden': sidebarHidden ? '1' : '0',
      '--description-width': isDescriptionHidden ? '0px' : 'min(550px, 40vw)'
    } as any}>
      <div className={`${styles.sidebar} ${sidebarHidden ? styles.hidden : ''}`}>
        <TaskSidebar 
          tasks={tasks} 
          onTaskSelect={handleTaskSelect}
          selectedTask={selectedTask}
          viewMode={viewMode}
          isHidden={sidebarHidden}
          onToggleHidden={() => setSidebarHidden(!sidebarHidden)}
        />
      </div>
      <div className={styles.mainContent}>
        {selectedTask ? (
          <TaskViewer 
            taskFile={selectedTask} 
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            allTasks={tasks}
            onTaskSelect={handleTaskSelect}
            onMobileMenuToggle={() => setSidebarHidden(!sidebarHidden)}
            sidebarHidden={sidebarHidden}
            isDescriptionHidden={isDescriptionHidden}
            onToggleDescription={() => setIsDescriptionHidden(!isDescriptionHidden)}
          />
        ) : (
          <div className="emptyState">
            Выберите задание из бокового меню
          </div>
        )}
      </div>
      
      {selectedTask && (
        <TaskDescription 
          taskFile={selectedTask}
          isHidden={isDescriptionHidden}
          onToggleHidden={() => setIsDescriptionHidden(!isDescriptionHidden)}
        />
      )}
    </div>
  )
} 