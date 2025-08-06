import React from 'react'
import { ExternalLink } from 'lucide-react'
import styles from '../TaskDescription.module.css'

interface TaskLayoutProps {
  title: string
  description: string
  children: React.ReactNode
}

export function TaskLayout({ title, description, children }: TaskLayoutProps) {
  return (
    <div className={styles.taskLayout}>
      <div className={styles.taskHeader}>
        <h1 className={styles.taskTitle}>{title}</h1>
        <p className={styles.taskDescription}>{description}</p>
      </div>
      <div className={styles.taskContent}>
        {children}
      </div>
    </div>
  )
}

interface TaskObjectiveProps {
  children: React.ReactNode
}

export function TaskObjective({ children }: TaskObjectiveProps) {
  return (
    <div className={styles.taskObjective}>
      <div className={styles.blockHeader}>
        <h2 className={styles.blockTitle}>🎯 Задача</h2>
      </div>
      <div className={styles.blockContent}>
        {children}
      </div>
    </div>
  )
}

interface TaskConceptsProps {
  title: string
  children: React.ReactNode
}

export function TaskConcepts({ title, children }: TaskConceptsProps) {
  return (
    <div className={styles.taskConcepts}>
      <div className={styles.blockHeader}>
        <h2 className={styles.blockTitle}>{title}</h2>
      </div>
      <div className={styles.blockContent}>
        {children}
      </div>
    </div>
  )
}

interface TaskImportantProps {
  title: string
  children: React.ReactNode
}

export function TaskImportant({ title, children }: TaskImportantProps) {
  return (
    <div className={styles.taskImportant}>
      <div className={styles.blockHeader}>
        <h2 className={styles.blockTitle}>{title}</h2>
      </div>
      <div className={styles.blockContent}>
        {children}
      </div>
    </div>
  )
}

interface HintItem {
  title: string
  content: React.ReactNode
}

interface TaskHintsProps {
  title: string
  hints: HintItem[]
}

export function TaskHints({ title, hints }: TaskHintsProps) {
  return (
    <div className={styles.taskHints}>
      <div className={styles.blockHeader}>
        <h2 className={styles.blockTitle}>{title}</h2>
      </div>
      <div className={styles.hintsContainer}>
        {hints.map((hint, index) => (
          <details key={index} className={styles.hintDetails}>
            <summary className={styles.hintSummary}>{hint.title}</summary>
            <div className={styles.hintContent}>
              {hint.content}
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}

interface LinkItem {
  title: string
  url: string
  description: string
}

interface TaskLinksProps {
  title: string
  links: LinkItem[]
}

export function TaskLinks({ title, links }: TaskLinksProps) {
  return (
    <div className={styles.taskLinks}>
      <div className={styles.blockHeader}>
        <h2 className={styles.blockTitle}>{title}</h2>
      </div>
      <div className={styles.linksContainer}>
        {links.map((link, index) => (
          <a 
            key={index} 
            href={link.url} 
            className={styles.linkItem}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className={styles.linkTitle}>
              <ExternalLink size={16} />
              {link.title}
            </div>
            <div className={styles.linkDescription}>{link.description}</div>
          </a>
        ))}
      </div>
    </div>
  )
}

interface TaskPreviewProps {
  children: React.ReactNode
}

export function TaskPreview({ children }: TaskPreviewProps) {
  return (
    <div className={styles.taskPreview}>
      <div className={styles.blockHeader}>
        <h2 className={styles.blockTitle}>Ожидаемый результат:</h2>
      </div>
      <div className={styles.blockContent}>
        {children}
      </div>
    </div>
  )
}

interface CodeExampleProps {
  title?: string
  children: React.ReactNode
}

export function CodeExample({ title, children }: CodeExampleProps) {
  return (
    <div className={styles.codeExample}>
      {title && (
        <div className={styles.blockHeader}>
          <h3 className={styles.blockTitle}>{title}</h3>
        </div>
      )}
      <div className={styles.blockContent}>
        {children}
      </div>
    </div>
  )
}

interface SolutionProps {
  title?: string
  code?: string
  language?: string
  explanation?: React.ReactNode
  children?: React.ReactNode
}

export function Solution({ title = "💡 Решение", code, language = "jsx", explanation, children }: SolutionProps) {
  return (
    <details className={styles.details}>
      <summary className={styles.summary}>{title}</summary>
      <div className={styles.solutionContent}>
        {code && (
          <pre className={styles.solutionCode}>
            <code>{code}</code>
          </pre>
        )}
        {explanation && (
          <div className={styles.solutionExplanation}>
            {explanation}
          </div>
        )}
        {children && (
          <div className={styles.blockContent}>
            {children}
          </div>
        )}
      </div>
    </details>
  )
}

interface InfoProps {
  children: React.ReactNode
}

export function Info({ children }: InfoProps) {
  return (
    <div className={styles.info}>
      <div className={styles.blockHeader}>
        <h3 className={styles.blockTitle}>ℹ️ Информация</h3>
      </div>
      <div className={styles.blockContent}>
        {children}
      </div>
    </div>
  )
}

interface WarningProps {
  children: React.ReactNode
}

export function Warning({ children }: WarningProps) {
  return (
    <div className={styles.warning}>
      <div className={styles.blockHeader}>
        <h3 className={styles.blockTitle}>⚠️ Предупреждение</h3>
      </div>
      <div className={styles.blockContent}>
        {children}
      </div>
    </div>
  )
}

interface ConceptProps {
  children: React.ReactNode
}

export function Concept({ children }: ConceptProps) {
  return (
    <div className={styles.concept}>
      <div className={styles.blockContent}>
        {children}
      </div>
    </div>
  )
}

interface StepProps {
  children: React.ReactNode
}

export function Step({ children }: StepProps) {
  return (
    <div className={styles.step}>
      <div className={styles.blockContent}>
        {children}
      </div>
    </div>
  )
}

interface SuccessProps {
  children: React.ReactNode
}

export function Success({ children }: SuccessProps) {
  return (
    <div className={styles.success}>
      <div className={styles.blockHeader}>
        <h2 className={styles.blockTitle}>✅ Критерии успеха</h2>
      </div>
      <div className={styles.blockContent}>
        {children}
      </div>
    </div>
  )
}

interface DocsExampleProps {
  children: React.ReactNode
}

export function DocsExample({ children }: DocsExampleProps) {
  return (
    <div className={styles.docsExample}>
      <div className={styles.blockContent}>
        {children}
      </div>
    </div>
  )
} 