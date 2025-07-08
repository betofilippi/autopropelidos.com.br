'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

const Command = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
      className
    )}
    {...props}
  />
))
Command.displayName = 'Command'

interface CommandInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onValueChange?: (value: string) => void
}

const CommandInput = React.forwardRef<HTMLInputElement, CommandInputProps>(
  ({ className, onValueChange, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onValueChange) {
        onValueChange(e.target.value)
      }
      if (onChange) {
        onChange(e)
      }
    }

    return (
      <input
        ref={ref}
        onChange={handleChange}
        className={cn(
          "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    )
  }
)
CommandInput.displayName = 'CommandInput'

const CommandList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
    {...props}
  />
))
CommandList.displayName = 'CommandList'

const CommandEmpty = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => (
  <div
    ref={ref}
    className="py-6 text-center text-sm"
    {...props}
  />
))
CommandEmpty.displayName = 'CommandEmpty'

interface CommandGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  heading?: string
}

const CommandGroup = React.forwardRef<HTMLDivElement, CommandGroupProps>(
  ({ className, heading, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden p-1 text-foreground",
        className
      )}
      {...props}
    >
      {heading && (
        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
          {heading}
        </div>
      )}
      {children}
    </div>
  )
)
CommandGroup.displayName = 'CommandGroup'

const CommandItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  />
))
CommandItem.displayName = 'CommandItem'

interface CommandDialogProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

const CommandDialog = React.forwardRef<HTMLDivElement, CommandDialogProps>(
  ({ open, onOpenChange, children, className, ...props }, ref) => {
    if (!open) return null
    
    return (
      <div
        ref={ref}
        className={cn(
          "fixed inset-0 z-50 bg-black/80 flex items-start justify-center pt-[20vh]",
          className
        )}
        onClick={() => onOpenChange?.(false)}
        {...props}
      >
        <div
          className="w-full max-w-lg bg-background rounded-lg shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <Command className="rounded-lg border shadow-md">
            {children}
          </Command>
        </div>
      </div>
    )
  }
)
CommandDialog.displayName = 'CommandDialog'
const CommandSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("h-px bg-border", className)}
    {...props}
  />
))
CommandSeparator.displayName = 'CommandSeparator'

export {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandDialog,
  CommandSeparator,
}