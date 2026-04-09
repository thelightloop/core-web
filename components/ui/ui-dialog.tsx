'use client'

import { useState, type ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

type ControlledProps = {
  /** External open state — required when no trigger is provided */
  open: boolean
  onOpenChange: (open: boolean) => void
  trigger?: never
}

type UncontrolledProps = {
  /** A trigger element — dialog manages its own open state */
  trigger: ReactNode
  open?: never
  onOpenChange?: never
}

type UIDialogProps = (ControlledProps | UncontrolledProps) & {
  children: ReactNode
  /** Extra classes forwarded to the popup wrapper inside DialogContent */
  contentClassName?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Reusable dialog wrapper.
 *
 * Controlled (external state):
 *   <UIDialog open={open} onOpenChange={setOpen}>…</UIDialog>
 *
 * Uncontrolled (self-managed, trigger in same tree):
 *   <UIDialog trigger={<Button>Open</Button>}>…</UIDialog>
 */
export function UIDialog({
  open,
  onOpenChange,
  trigger,
  children,
  contentClassName,
}: UIDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)

  const isControlled = trigger === undefined

  return (
    <Dialog
      open={isControlled ? open : internalOpen}
      onOpenChange={isControlled ? onOpenChange : setInternalOpen}
    >
      {trigger && (
        <DialogTrigger
          render={<span className="inline-flex">{trigger}</span>}
        />
      )}
      <DialogContent className={cn(contentClassName)}>
        {children}
      </DialogContent>
    </Dialog>
  )
}
