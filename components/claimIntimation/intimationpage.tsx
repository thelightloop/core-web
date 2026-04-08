'use client'
import { useState } from 'react'
import { FileText, X, Loader2, CheckCircle2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DialogClose } from '@/components/ui/dialog'
import { cn } from '@/lib/api/utility/utils'
import { PolicyResult, IntimationForm } from '@/lib/interface/claim/claimintimation'

export function IntimationModal({
  policy,
  onClose,
}: {
  policy: PolicyResult
  onClose: () => void
}) {
  const [form, setForm] = useState<IntimationForm>({
    dateOfLoss: '',
    causeOfLoss: '',
    placeOfLoss: '',
    estimatedLoss: '',
    description: '',
    contactPerson: policy.insuredPartyName,
    contactNumber: '',
    relationship: 'Self',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const set = (k: keyof IntimationForm, v: string) =>
    setForm((prev) => ({ ...prev, [k]: v }))

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 1200))
    setSaving(false)
    setSaved(true)
    setTimeout(onClose, 1400)
  }

  return (
    <div
      className="w-full bg-card rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      style={{ maxHeight: '85vh' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 flex-shrink-0 bg-brand">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-foreground/15 flex items-center justify-center">
            <FileText size={16} className="text-brand-foreground" />
          </div>
          <div>
            <p className="text-brand-foreground font-semibold text-sm">Claim Intimation</p>
            <p className="text-brand-foreground/60 text-xs">{policy.policyNumber}</p>
          </div>
        </div>
        <DialogClose
          render={
            <Button
              type="button"
              className="w-8 h-8 rounded-lg bg-brand-foreground/10 hover:bg-brand-foreground/20 flex items-center justify-center transition-colors"
            >
              <X size={15} className="text-brand-foreground" />
            </Button>
          }
        />
      </div>

      {/* Scrollable body */}
      <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
        {/* Policy summary */}
        <div className="rounded-xl border border-border bg-muted p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Policy Details
          </p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
            {[
              ['Policy No', policy.policyNumber],
              ['Document No', policy.documentNumber],
              ['Insured Name', policy.insuredPartyName],
              ['Sum Insured', `NPR ${policy.sumInsured}`],
              ['Effective Date', policy.effectiveDate],
              ['Expiry Date', String(policy.expiryDate)],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
                <p className="text-sm font-medium text-foreground mt-0.5">{value}</p>
              </div>
            ))}
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Status</p>
              <div className="mt-1">
                <StatusBadge status={policy.status} />
              </div>
            </div>
          </div>
        </div>

        {/* Intimation details */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Intimation Details
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">
                Date of Loss <span className="text-destructive">*</span>
              </label>
              <Input
                type="date"
                value={form.dateOfLoss}
                onChange={(e) => set('dateOfLoss', e.target.value)}
                className="h-9 rounded-lg border border-input px-3 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="causeOfLoss" className="text-xs font-medium text-muted-foreground">
                Cause of Loss <span className="text-destructive">*</span>
              </label>
              <select
                id="causeOfLoss"
                value={form.causeOfLoss}
                onChange={(e) => set('causeOfLoss', e.target.value)}
                className="h-9 rounded-lg border border-input px-3 text-sm text-foreground bg-background focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all"
              >
                <option value="">Select cause</option>
                {['Fire', 'Flood', 'Earthquake', 'Theft', 'Accident', 'Natural Disaster', 'Other'].map(
                  (c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  )
                )}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">Place of Loss</label>
              <input
                type="text"
                placeholder="e.g. Kathmandu, Lalitpur"
                value={form.placeOfLoss}
                onChange={(e) => set('placeOfLoss', e.target.value)}
                className="h-9 rounded-lg border border-input px-3 text-sm text-foreground bg-background placeholder:text-muted-foreground/50 focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">Estimated Loss (NPR)</label>
              <input
                type="text"
                placeholder="e.g. 100,000"
                value={form.estimatedLoss}
                onChange={(e) => set('estimatedLoss', e.target.value)}
                className="h-9 rounded-lg border border-input px-3 text-sm text-foreground bg-background placeholder:text-muted-foreground/50 focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all"
              />
            </div>
            <div className="col-span-2 flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">
                Description of Incident <span className="text-destructive">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="Briefly describe the incident..."
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                className="rounded-lg border border-input px-3 py-2 text-sm text-foreground bg-background placeholder:text-muted-foreground/50 focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Contact details */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Contact Details
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">Contact Person</label>
              <Input
                type="text"
                value={form.contactPerson}
                onChange={(e) => set('contactPerson', e.target.value)}
                className="h-9 rounded-lg border border-input px-3 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">Contact Number</label>
              <input
                type="tel"
                placeholder="98XXXXXXXX"
                value={form.contactNumber}
                onChange={(e) => set('contactNumber', e.target.value)}
                className="h-9 rounded-lg border border-input px-3 text-sm text-foreground bg-background placeholder:text-muted-foreground/50 focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="relationship" className="text-xs font-medium text-muted-foreground">
                Relationship
              </label>
              <Select
                value={form.relationship}
                onValueChange={(value) => set('relationship', value ?? 'Self')}
              >
                <SelectTrigger id="relationship" className="h-9 rounded-lg border border-input px-3 text-sm">
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  {['Self', 'Spouse', 'Parent', 'Sibling', 'Agent', 'Other'].map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-border flex-shrink-0 bg-muted">
        <p className="text-xs text-muted-foreground">
          <span className="text-destructive">*</span> Required fields
        </p>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            onClick={onClose}
            className="h-9 px-4 rounded-lg text-sm font-medium text-muted-foreground border border-border hover:bg-accent transition-colors"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={saving || saved}
            className={cn(
              'h-9 px-5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all disabled:opacity-80',
              saved
                ? 'bg-success text-success-foreground'
                : 'bg-brand text-brand-foreground'
            )}
          >
            {saving ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Saving…
              </>
            ) : saved ? (
              <>
                <CheckCircle2 size={14} />
                Saved!
              </>
            ) : (
              'Save Intimation'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap',
        status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      )}
    >
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full flex-shrink-0',
          status ? 'bg-green-500' : 'bg-red-500'
        )}
      />
      {status ? 'Active' : 'Inactive'}
    </span>
  )
}
