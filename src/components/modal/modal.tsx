"use client"

import { CloseIcon } from "components/icons/closeIcon"
import { createContext, MouseEvent, useContext, useEffect, useId, useRef } from "react"
import { createPortal } from "react-dom"
import { cn } from "utils/cn"

import { ModalHeaderProps, ModalProps, ModalSectionProps } from "./modal.types"

const TABBABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

const getTabbableElements = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLElement>(TABBABLE_SELECTOR))

const ModalContext = createContext({ labelId: "" })

export const Modal = ({ isOpen, onClose, children, closeLabel = "Zamknij okno", className, testId }: ModalProps) => {
  const labelId = useId()
  const overlayRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)
  const pressedOnOverlay = useRef(false)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    const panel = panelRef.current

    if (!isOpen || !panel) return

    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const background = Array.from(document.body.children).filter(
      (element) => element !== overlayRef.current && !element.hasAttribute("inert"),
    )
    const { overflow } = document.body.style

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return

      if (event.key === "Escape") {
        event.preventDefault()
        onCloseRef.current()

        return
      }

      if (event.key !== "Tab") return

      const tabbable = getTabbableElements(panel)
      const first = tabbable[0]
      const last = tabbable[tabbable.length - 1]

      if (!first || !last) {
        event.preventDefault()

        return
      }

      const activeIndex = tabbable.findIndex((element) => element === document.activeElement)

      if (event.shiftKey && activeIndex <= 0) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (activeIndex === -1 || activeIndex === tabbable.length - 1)) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    background.forEach((element) => element.setAttribute("inert", ""))
    document.body.style.overflow = "hidden"
    ;(getTabbableElements(panel)[0] ?? panel).focus()

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      background.forEach((element) => element.removeAttribute("inert"))
      document.body.style.overflow = overflow
      opener?.focus()
    }
  }, [isOpen])

  if (!isOpen || typeof document === "undefined") return null

  const handleOverlayMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    pressedOnOverlay.current = event.target === event.currentTarget
  }

  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (pressedOnOverlay.current && event.target === event.currentTarget) onClose()
  }

  return createPortal(
    <ModalContext.Provider value={{ labelId }}>
      <div
        ref={overlayRef}
        className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4"
        onMouseDown={handleOverlayMouseDown}
        onClick={handleOverlayClick}
      >
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelId}
          tabIndex={-1}
          data-testid={testId}
          className={cn(
            "relative flex max-h-full w-full max-w-lg flex-col gap-6 rounded-2xl bg-white p-8 shadow-xl focus:outline-none",
            className,
          )}
        >
          {children}
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="absolute end-3 top-3 rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            <CloseIcon aria-hidden className="size-5" />
          </button>
        </div>
      </div>
    </ModalContext.Provider>,
    document.body,
  )
}

const ModalHeader = ({ header, className, ...props }: ModalHeaderProps) => {
  const { labelId } = useContext(ModalContext)

  return (
    <h2 {...props} id={labelId} className={cn("pe-10 text-xl font-bold text-gray-900 focus:outline-none", className)}>
      {header}
    </h2>
  )
}

const ModalBody = ({ children, className }: ModalSectionProps) => (
  <div className={cn("flex min-h-0 flex-col gap-4 overflow-y-auto", className)}>{children}</div>
)

const ModalFooter = ({ children, className }: ModalSectionProps) => (
  <div className={cn("flex flex-col-reverse gap-3 sm:flex-row sm:justify-end", className)}>{children}</div>
)

Modal.Header = ModalHeader
Modal.Body = ModalBody
Modal.Footer = ModalFooter
