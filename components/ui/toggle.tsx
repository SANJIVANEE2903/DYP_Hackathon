'use client'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  description?: string
  disabled?: boolean
}

export function Toggle({ checked, onChange, label, description, disabled }: ToggleProps) {
  return (
    <label className={`flex items-center justify-between gap-4 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <div className="flex-1 min-w-0">
        {label && <p className="text-sm text-[#0a0a0a]">{label}</p>}
        {description && <p className="text-xs text-[#6b7280] mt-0.5">{description}</p>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`
          relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent
          transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0070f3]
          ${checked ? 'bg-[#0070f3]' : 'bg-[#e5e7eb]'}
          ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <span
          className={`
            inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm
            transition-transform duration-200
            ${checked ? 'translate-x-4' : 'translate-x-0.5'}
          `}
        />
      </button>
    </label>
  )
}
