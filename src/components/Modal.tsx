import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

type ModalWrapperProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  children?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  ariaLabel?: string
}

const sizeClass = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
}

export default function ModalWrapper({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  ariaLabel,
}: ModalWrapperProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const lastActiveElementRef = useRef<HTMLElement | null>(null)

  const mount =
    typeof window !== 'undefined' && document.getElementById('__modal_root')
      ? document.getElementById('__modal_root')!
      : (() => {
          if (typeof window === 'undefined') return null as any
          const el = document.createElement('div')
          el.id = '__modal_root'
          document.body.appendChild(el)
          return el
        })()

  useEffect(() => {
    if (!isOpen) return

    lastActiveElementRef.current = document.activeElement as HTMLElement | null

    setTimeout(() => {
      dialogRef.current?.focus()
    }, 0)

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
      // simple tab trap
      if (e.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )
        if (!focusable || focusable.length === 0) {
          e.preventDefault()
          return
        }
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      }
    }

    document.addEventListener('keydown', onKey, true)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey, true)
      document.body.style.overflow = ''
      // restore focus
      lastActiveElementRef.current?.focus()
    }
  }, [isOpen, onClose])

  if (!isOpen || !mount) return null

  function onOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose()
  }

  return createPortal(
    <div
      ref={overlayRef}
      onMouseDown={onOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-hidden={false}
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/50 transition-opacity" />

      {/* dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel || title || 'Modal dialog'}
        tabIndex={-1}
        ref={dialogRef}
        className={`relative z-10 w-full ${sizeClass[size]} mx-auto rounded-xl bg-white shadow-2xl overflow-hidden focus:outline-none`}
      >
        {/* header */}
        <div className="flex items-start justify-between py-4 px-8 border-b">
          <div className="flex-1 pr-4">
            {title ? <h3 className="text-lg font-semibold">{title}</h3> : null}
          </div>
          <div>
            <button
              aria-label="Close modal"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 8.586l4.95-4.95 1.414 1.414L11.414 10l4.95 4.95-1.414 1.414L10 11.414l-4.95 4.95-1.414-1.414L8.586 10 3.636 5.05 5.05 3.636 10 8.586z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-8 max-h-[70vh] overflow-auto">{children}</div>
      </div>
    </div>,
    mount
  )
}
