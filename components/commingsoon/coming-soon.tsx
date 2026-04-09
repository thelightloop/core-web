'use client'

import { Construction } from 'lucide-react'
import { cn } from '@/lib/utils/utils'

interface ComingSoonProps {
  featureName: string
  description?: string
}

export function ComingSoon({ featureName, description }: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] select-none">
      {/* Decorative background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-brand opacity-[0.06] blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-[480px] h-[480px] rounded-full bg-brand opacity-[0.06] blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full bg-brand opacity-[0.04] blur-2xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg">
        {/* Icon ring */}
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-xl bg-brand">
            <Construction size={40} className="text-brand-foreground" strokeWidth={1.5} />
          </div>
          {/* Orbiting dots */}
          <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full border-2 border-background shadow-sm bg-amber-400" />
          <span className="absolute -bottom-1 -left-3 w-3 h-3 rounded-full border-2 border-background shadow-sm bg-emerald-500" />
        </div>

        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase mb-4 border text-brand bg-brand/10 border-brand/20">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          In Development
        </span>

        {/* Heading */}
        <h1 className="text-3xl font-extrabold text-foreground mb-2 tracking-tight">
          Coming Soon
        </h1>
        <p className="text-lg font-semibold mb-3 text-brand">
          {featureName}
        </p>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-8">
          {description ??
            "We&apos;re crafting this feature with care. It will be available in an upcoming release. Stay tuned for updates."}
        </p>

        {/* Progress bar decorative */}
        <div className="w-full max-w-xs h-1.5 bg-muted rounded-full overflow-hidden mb-8">
          <div className="h-full rounded-full bg-brand w-[45%]" />
        </div>

        {/* Feature checklist */}
        <div className="w-full max-w-xs space-y-2.5">
          {['UI Design', 'API Integration', 'Testing & QA'].map((step, i) => (
            <div key={step} className="flex items-center gap-3 text-sm">
              <span
                className={cn(
                  'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold',
                  i === 0 ? 'bg-brand/15 text-brand' : 'bg-muted text-muted-foreground'
                )}
              >
                {i === 0 ? '✓' : i + 1}
              </span>
              <span className={cn(i === 0 ? 'font-medium line-through text-brand' : 'text-muted-foreground')}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
