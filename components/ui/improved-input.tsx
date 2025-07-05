import * as React from "react"
import { cn } from "@/lib/utils"
import { Search, X } from "lucide-react"

export interface ImprovedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
  clearable?: boolean
  onClear?: () => void
}

const ImprovedInput = React.forwardRef<HTMLInputElement, ImprovedInputProps>(
  ({ className, type, icon, clearable, onClear, ...props }, ref) => {
    const [value, setValue] = React.useState(props.value || "")
    const [focused, setFocused] = React.useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value)
      props.onChange?.(e)
    }

    const handleClear = () => {
      setValue("")
      onClear?.()
      if (props.onChange) {
        const event = {
          target: { value: "" },
        } as React.ChangeEvent<HTMLInputElement>
        props.onChange(event)
      }
    }

    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-all duration-200",
            // Mobile optimizations
            "text-base md:text-sm", // Larger text on mobile
            "h-12 md:h-10", // Taller on mobile
            "touch-manipulation", // Disable double-tap zoom
            icon && "pl-10",
            clearable && value && "pr-10",
            focused && "border-primary",
            className
          )}
          ref={ref}
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        
        {clearable && value && (
          <button
            type="button"
            onClick={handleClear}
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2",
              "text-muted-foreground hover:text-foreground",
              "transition-colors duration-200",
              "p-1 rounded-full hover:bg-muted",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            )}
            aria-label="Clear input"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    )
  }
)

ImprovedInput.displayName = "ImprovedInput"

// Search Input variant
export const SearchInput = React.forwardRef<
  HTMLInputElement,
  Omit<ImprovedInputProps, "icon" | "type">
>(({ className, ...props }, ref) => {
  return (
    <ImprovedInput
      ref={ref}
      type="search"
      icon={<Search className="h-4 w-4" />}
      clearable
      className={cn("", className)}
      {...props}
    />
  )
})

SearchInput.displayName = "SearchInput"

export { ImprovedInput }