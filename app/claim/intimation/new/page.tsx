'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { AlertCircle } from 'lucide-react'
import { IntimationFormPage } from '@/components/claimIntimation/intimationpage'
import { PolicyResult } from '@/lib/interface/claim/claimintimation'

function IntimationNewContent() {
  const searchParams = useSearchParams()
  const raw = searchParams.get('policy')

  if (!raw) {
    return (
      <div className="flex items-center gap-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl px-4 py-3 text-sm">
        <AlertCircle size={16} className="flex-shrink-0" />
        No policy data provided. Please go back and select a policy.
      </div>
    )
  }

  let policy: PolicyResult
  try {
    policy = JSON.parse(raw) as PolicyResult
  } catch {
    return (
      <div className="flex items-center gap-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl px-4 py-3 text-sm">
        <AlertCircle size={16} className="flex-shrink-0" />
        Invalid policy data. Please go back and try again.
      </div>
    )
  }

  return <IntimationFormPage policy={policy} />
}

export default function NewIntimationPage() {
  return (
    <div className="w-full py-6 px-4">
      <Suspense fallback={<div className="text-sm text-muted-foreground">Loading…</div>}>
        <IntimationNewContent />
      </Suspense>
    </div>
  )
}
