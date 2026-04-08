'use client'

import { Construction } from 'lucide-react'

const PRIMARY = '#19386C'

interface ComingSoonProps {
  featureName: string
  description?: string
}

export function ComingSoon({ featureName, description }: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] select-none">
      {/* Decorative background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div
          className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full opacity-[0.06] blur-3xl"
          style={{ background: PRIMARY }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-[480px] h-[480px] rounded-full opacity-[0.06] blur-3xl"
          style={{ background: PRIMARY }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full opacity-[0.04] blur-2xl"
          style={{ background: PRIMARY }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg">
        {/* Icon ring */}
        <div className="relative mb-8">
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-xl"
            style={{ background: `linear-gradient(135deg, ${PRIMARY}, #2d5ba3)` }}
          >
            <Construction size={40} className="text-white" strokeWidth={1.5} />
          </div>
          {/* Orbiting dots */}
          <span
            className="absolute -top-2 -right-2 w-4 h-4 rounded-full border-2 border-white shadow-sm"
            style={{ background: '#f59e0b' }}
          />
          <span
            className="absolute -bottom-1 -left-3 w-3 h-3 rounded-full border-2 border-white shadow-sm"
            style={{ background: '#10b981' }}
          />
        </div>

        {/* Badge */}
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase mb-4 border"
          style={{
            color: PRIMARY,
            background: `${PRIMARY}10`,
            borderColor: `${PRIMARY}20`,
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          In Development
        </span>

        {/* Heading */}
        <h1 className="text-3xl font-extrabold text-slate-800 mb-2 tracking-tight">
          Coming Soon
        </h1>
        <p className="text-lg font-semibold mb-3" style={{ color: PRIMARY }}>
          {featureName}
        </p>

        {/* Description */}
        <p className="text-sm text-slate-500 leading-relaxed mb-8">
          {description ??
            "We're crafting this feature with care. It will be available in an upcoming release. Stay tuned for updates."}
        </p>

        {/* Progress bar decorative */}
        <div className="w-full max-w-xs h-1.5 bg-slate-100 rounded-full overflow-hidden mb-8">
          <div
            className="h-full rounded-full"
            style={{
              width: '45%',
              background: `linear-gradient(90deg, ${PRIMARY}, #2d5ba3)`,
            }}
          />
        </div>

        {/* Feature checklist */}
        <div className="w-full max-w-xs space-y-2.5">
          {['UI Design', 'API Integration', 'Testing & QA'].map((step, i) => (
            <div key={step} className="flex items-center gap-3 text-sm">
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold"
                style={
                  i === 0
                    ? { background: `${PRIMARY}15`, color: PRIMARY }
                    : { background: '#f1f5f9', color: '#94a3b8' }
                }
              >
                {i === 0 ? '✓' : i + 1}
              </span>
              <span
                className={
                  i === 0 ? 'font-medium line-through' : 'text-slate-400'
                }
                style={i === 0 ? { color: PRIMARY } : {}}
              >
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
