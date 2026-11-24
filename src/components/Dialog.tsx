import { useEffect, type ReactNode } from 'react'

interface Props { label: string; className: string; onClose: () => void; children: ReactNode }

const Dialog = ({ label, className, onClose, children }: Props) => {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className='modalOverlay' onClick={onClose}>
      <div className={className} role='dialog' aria-modal='true' aria-label={label} onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  )
}

export default Dialog
