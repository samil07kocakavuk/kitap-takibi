export const FIELD_INPUT =
  'w-full rounded-md border border-stone-300 bg-white px-2.5 py-2 text-sm text-slate-900 outline-none placeholder:text-stone-400 focus:border-brand focus:ring-[3px] focus:ring-brand/15 aria-[invalid=true]:border-red-600'

export const FIELD_LABEL = 'text-[13px] font-medium text-slate-700'

const BUTTON_BASE =
  'inline-flex items-center justify-center rounded-md border font-medium leading-tight transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60'

const BUTTON_SIZES = {
  md: 'px-3.5 py-2 text-sm',
  sm: 'px-2.5 py-1 text-[13px]',
}

const BUTTON_VARIANTS = {
  primary:
    'border-brand bg-brand text-white hover:border-brand-strong hover:bg-brand-strong',
  ghost: 'border-stone-300 bg-white text-slate-900 hover:bg-stone-50',
  danger:
    'border-red-600 bg-red-600 text-white hover:border-red-700 hover:bg-red-700',
  dangerGhost:
    'border-stone-300 bg-white text-red-600 hover:border-red-200 hover:bg-red-50',
}

export function buttonClass(variant = 'primary', size = 'md') {
  return `${BUTTON_BASE} ${BUTTON_SIZES[size]} ${BUTTON_VARIANTS[variant]}`
}
