'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, PanelRightClose, Copy, Check } from 'lucide-react'
import { MDXRemote } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import type { MDXRemoteSerializeResult } from 'next-mdx-remote'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import styles from './TaskDescription.module.css'

import { 
  TaskLayout,
  TaskObjective,
  TaskImportant,
  TaskConcepts,
  TaskHints,
  TaskLinks,
  TaskPreview,
  CodeExample,
  Solution,
  Info,
  Warning,
  Concept,
  Step,
  Success,
  DocsExample
} from './mdx'

interface TaskDescriptionProps {
  taskFile: string
  isHidden: boolean
  onToggleHidden: () => void
}

interface CodeBlockProps {
  children: string
  className?: string
}

function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState(false)
  
  const match = /language-(\w+)/.exec(className || '')
  const language = match ? match[1] : 'javascript'
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Ошибка копирования:', err)
      setError(true)
      setTimeout(() => setError(false), 500)
    }
  }

  return (
    <div className={styles.codeBlock}>
      <div className={styles.codeHeader}>
        <button
          className={`${styles.copyButton} ${copied ? styles.copied : ''} ${error ? styles.error : ''}`}
          onClick={handleCopy}
          title={copied ? 'Скопировано!' : error ? 'Ошибка копирования!' : 'Копировать код'}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={materialDark}
        showLineNumbers={false}
        wrapLongLines={true}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  )
}

export default function TaskDescription({ taskFile, isHidden, onToggleHidden }: TaskDescriptionProps) {
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const loadDescription = async () => {
    if (!taskFile) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/readme?task=${encodeURIComponent(taskFile)}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('README.mdx не найден для этого задания')
        }
        throw new Error(`Ошибка загрузки: ${response.statusText}`)
      }
      
      const content = await response.text()
      
      const mdxSource = await serialize(content, {
        parseFrontmatter: true,
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [],
        },
      })
      
      setMdxSource(mdxSource)
    } catch (error) {
      console.error('Error loading task description:', error)
      setError(error instanceof Error ? error.message : 'Ошибка загрузки описания')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDescription()
  }, [taskFile])

  return (
    <div className={`${styles.sidebar} ${isHidden ? styles.sidebarHidden : ''}`}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <BookOpen size={20} className={styles.headerIcon} />
          <span className={styles.headerTitle}>Описание задания</span>
        </div>
        
        <motion.button
          className={styles.toggleButton}
          onClick={onToggleHidden}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Скрыть описание"
        >
          <PanelRightClose size={16} />
        </motion.button>
      </div>

      <AnimatePresence>
        {!isHidden && (
          <motion.div
            className={styles.content}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {isLoading && (
              <div className={styles.loading}>
                <div className={styles.skeleton}>
                  <div className={`${styles.skeletonLine} ${styles.title}`}></div>
                  <div className={`${styles.skeletonLine} ${styles.subtitle}`}></div>
                  <div className={`${styles.skeletonLine} ${styles.long}`}></div>
                  <div className={`${styles.skeletonLine} ${styles.medium}`}></div>
                  <div className={`${styles.skeletonLine} ${styles.short}`}></div>
                  <div className={`${styles.skeletonLine} ${styles.long}`}></div>
                  <div className={`${styles.skeletonLine} ${styles.medium}`}></div>
                  <div className={`${styles.skeletonLine} ${styles.title}`}></div>
                  <div className={`${styles.skeletonLine} ${styles.short}`}></div>
                  <div className={`${styles.skeletonLine} ${styles.long}`}></div>
                </div>
              </div>
            )}

            {error && (
              <div className={styles.error}>
                <BookOpen size={24} className={styles.errorIcon} />
                <span>{error}</span>
              </div>
            )}

            {mdxSource && !isLoading && (
              <motion.div 
                className={styles.description}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <MDXRemote 
                  {...mdxSource}
                  components={{
                    TaskLayout,
                    TaskObjective,
                    TaskImportant,
                    TaskConcepts,
                    TaskHints,
                    TaskLinks,
                    TaskPreview,
                    CodeExample,
                    Solution,
                    Info,
                    Warning,
                    Concept,
                    Step,
                    Success,
                    DocsExample,
                    
                    div: ({ className, children, ...props }) => {
                      if (className?.includes('task-preview')) {
                        return <TaskPreview>{children}</TaskPreview>
                      }
                      if (className?.includes('docs-example')) {
                        return <DocsExample>{children}</DocsExample>
                      }
                      if (className?.includes('concept')) {
                        return <Concept>{children}</Concept>
                      }
                      if (className?.includes('step')) {
                        return <Step>{children}</Step>
                      }
                      if (className?.includes('info')) {
                        return <Info>{children}</Info>
                      }
                      if (className?.includes('warning')) {
                        return <Warning>{children}</Warning>
                      }
                      return <div className={className} {...props}>{children}</div>
                    },
                    code({ className, children, ...props }) {
                      const isInline = !className || !className.startsWith('language-')
                      
                      if (isInline) {
                        return (
                          <code className={styles.inlineCode} {...props}>
                            {children}
                          </code>
                        )
                      }
                      return (
                        <CodeBlock className={className}>
                          {String(children).replace(/\n$/, '')}
                        </CodeBlock>
                      )
                    },
                    a({ href, children, ...props }) {
                      return (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          {...props}
                        >
                          {children}
                        </a>
                      )
                    },
                    details: ({ children, ...props }) => (
                      <details className={styles.details} {...props}>
                        {children}
                      </details>
                    ),
                    summary: ({ children, ...props }) => (
                      <summary className={styles.summary} {...props}>
                        {children}
                      </summary>
                    ),
                    InteractiveExample: ({ title, children }) => (
                      <div className={styles.interactiveExample}>
                        <h4 className={styles.interactiveTitle}>🎯 {title}</h4>
                        <div className={styles.interactiveContent}>
                          {children}
                        </div>
                      </div>
                    ),
                  }}
                />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 