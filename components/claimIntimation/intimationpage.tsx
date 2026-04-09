'use client'
import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  FileText,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  CalendarDays,
  Clock,
  Mail,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/utils'
import { PolicyResult, IntimationForm, ClaimIntimationDto } from '@/lib/interface/claim/claimintimation'
import { adToBs } from '@/lib/utils/nepaliDate'
import { useCreateIntimation } from '@/hooks/use-claim'

const TODAY_AD = new Date().toISOString().split('T')[0]

const INTIMATION_SOURCES = ['Phone', 'Email', 'Walk-in', 'Agent', 'Online Portal', 'Letter', 'Other']
const NATURE_OF_LOSS_OPTIONS = ['Own Damage', 'Third Party', 'Theft', 'Fire', 'Natural Disaster', 'Other']
const ADVISE_OPTIONS = ['Survey Required', 'Documents Required', 'Police Report Required', 'Medical Report', 'Garage Report', 'Other']
const PROVINCES = ['Koshi', 'Madhesh', 'Bagmati', 'Gandaki', 'Lumbini', 'Karnali', 'Sudurpashchim']

function initialForm(policy: PolicyResult): IntimationForm {
  return {
    partyType: 'Individual',
    partyName: policy.insuredPartyName,
    email: '',
    intimationDate: TODAY_AD,
    intimationDateNepali: adToBs(TODAY_AD),
    intimationTime: '',
    intimationReceivedDate: TODAY_AD,
    intimationReceivedDateNepali: adToBs(TODAY_AD),
    intimationSource: '',
    intimatedBy: policy.insuredPartyName,
    contactNumber: '',
    estimatedLoss: '',
    advises: [],
    bypassOccuranceDateValidation: false,
    occuranceDate: '',
    occuranceDateNepali: '',
    natureLoss: '',
    incidentReason: '',
    damageExtend: '',
    province: '',
    district: '',
    municipality: '',
    ward: '',
    nepalStreet: '',
    vehicleModel: '',
    subModel: '',
    chasisNumber: '',
    engineNumber: '',
    registrationNumber: '',
    manufactureYear: '',
    isBasicRecovery: true,
    isConstructiveLoss: false,
    isCashLoss: false,
    isTotalClaimLoss: false,
    isTheft: false,
    isKfkTraced: false,
    isKfkNotTraced: false,
    isKnockForKnock: false,
    isKnockForKnockIn: null,
    kfkRemarks: '',
    kfkReferenceNumber: '',
    assignedUser: '',
  }
}

export function IntimationFormPage({ policy }: { policy: PolicyResult }) {
  const router = useRouter()
  const { mutateAsync, isPending: saving } = useCreateIntimation()
  const [form, setForm] = useState<IntimationForm>(() => initialForm(policy))
  const [saved, setSaved] = useState(false)

  const set = <K extends keyof IntimationForm>(k: K, v: IntimationForm[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }))

  const setDate = (adKey: keyof IntimationForm, bsKey: keyof IntimationForm, v: string) =>
    setForm((prev) => ({ ...prev, [adKey]: v, [bsKey]: adToBs(v) }))

  const handleOccuranceDate = (v: string) => {
    if (!form.bypassOccuranceDateValidation && form.intimationDate && v > form.intimationDate) {
      toast.error('Occurrence date cannot be later than the intimation date.')
      return
    }
    setDate('occuranceDate', 'occuranceDateNepali', v)
  }

  const toggleAdvise = (a: string) =>
    set('advises', form.advises.includes(a) ? form.advises.filter((x) => x !== a) : [...form.advises, a])

  const handleSave = async () => {
    const dto: ClaimIntimationDto = {
      policyNumber: policy.policyNumber,
      documentNumber: policy.documentNumber,
      classId: policy.classId,
      typeOfParty: form.partyType,
      partyName: form.partyName,
      partyEmail: form.email || undefined,
      effectiveDate: policy.effectiveDate,
      expiryDate: String(policy.expiryDate),
      intimationDate: form.intimationDate,
      intimationDateNepali: form.intimationDateNepali || undefined,
      intimationTime: form.intimationTime || undefined,
      intimatedBy: form.intimatedBy,
      intimationSource: form.intimationSource,
      contactNumber: form.contactNumber,
      estimatedLoss: form.estimatedLoss ? Number(form.estimatedLoss) : undefined,
      branchCode: policy.branchCode,
      sumInsured: policy.sumInsured,
      isCashLossBasis: form.isCashLoss,
      isTheft: form.isTheft,
      isTotalLoss: form.isTotalClaimLoss,
      isKnockForKnock: form.isKnockForKnock,
      isKnockForKnockIn: form.isKnockForKnockIn ?? undefined,
      kfkRemarks: form.kfkRemarks || undefined,
      advise: form.advises.length ? form.advises.join(', ') : undefined,
      riskTypeSelected: policy.riskTypeSelected,
      portfolio: policy.class,
    }
    try {
      await mutateAsync(dto)
      setSaved(true)
      toast.success('Claim intimation saved successfully.')
      setTimeout(() => router.back(), 1400)
    } catch (err) {
      toast.error((err as Error).message ?? 'Failed to save intimation. Please try again.')
    }
  }

  return (
    <div className="w-full space-y-5 pb-10">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-border hover:bg-muted transition-colors flex-shrink-0"
          title="Go back"
        >
          <ArrowLeft size={15} className="text-muted-foreground" />
        </button>
        <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0">
          <FileText size={15} className="text-brand" />
        </div>
        <div>
          <h1 className="text-base font-bold text-foreground tracking-tight leading-none">Claim Intimation</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{policy.policyNumber} · {policy.insuredPartyName}</p>
        </div>
      </div>

      {/* Policy Summary */}
      <Section title="Policy Details">
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-x-6 gap-y-3">
          {[
            ['Policy No', policy.policyNumber],
            ['Document No', policy.documentNumber],
            ['Insured Name', policy.insuredPartyName],
            ['Sum Insured', `NPR ${policy.sumInsured?.toLocaleString()}`],
            ['Effective', policy.effectiveDate],
            ['Expiry', String(policy.expiryDate)],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
              <p className="text-xs font-semibold text-foreground mt-0.5 truncate">{value}</p>
            </div>
          ))}
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Status</p>
            <div className="mt-0.5"><StatusBadge status={policy.status} /></div>
          </div>
        </div>
      </Section>

      {/* Party Insured */}
      <Section title="Party Insured">
        <div className="grid grid-cols-3 gap-3">
          <Field label="Party Type" required>
            <NativeSelect
              value={form.partyType}
              onChange={(v) => set('partyType', v as 'Individual' | 'Corporate')}
              options={['Individual', 'Corporate']}
              placeholder="Select Party Type"
            />
          </Field>
          <Field label="Party Name" required>
            <TextInput placeholder="Search party name…" value={form.partyName} onChange={(v) => set('partyName', v)} />
          </Field>
          <Field label="Email">
            <div className="relative">
              <Mail size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input
                type="email"
                placeholder="party@email.com"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                className={cn(inputCls, 'pl-8')}
              />
            </div>
          </Field>
        </div>
      </Section>

      {/* Claim Intimation Details */}
      <Section title="Intimation Details">
        <div className="grid grid-cols-3 gap-3">
          <Field label="Intimation Date (A.D.)" required>
            <DatePicker value={form.intimationDate} onChange={(v) => setDate('intimationDate', 'intimationDateNepali', v)} />
          </Field>
          <Field label="Intimation Date (B.S.)">
            <ReadonlyInput value={form.intimationDateNepali} placeholder="Auto-converted" icon="calendar" />
          </Field>
          <Field label="Intimation Time" required>
            <TimePicker value={form.intimationTime} onChange={(v) => set('intimationTime', v)} />
          </Field>

          <Field label="Source" required>
            <NativeSelect
              value={form.intimationSource}
              onChange={(v) => set('intimationSource', v)}
              options={INTIMATION_SOURCES}
              placeholder="Select a Source"
            />
          </Field>
          <Field label="Intimated By" required>
            <TextInput placeholder="Intimated By" value={form.intimatedBy} onChange={(v) => set('intimatedBy', v)} />
          </Field>
          <Field label="Contact Number">
            <TextInput placeholder="98XXXXXXXX" value={form.contactNumber} onChange={(v) => set('contactNumber', v)} />
          </Field>

          <Field label="Received Date (A.D.)">
            <DatePicker value={form.intimationReceivedDate} onChange={(v) => setDate('intimationReceivedDate', 'intimationReceivedDateNepali', v)} />
          </Field>
          <Field label="Received Date (B.S.)">
            <ReadonlyInput value={form.intimationReceivedDateNepali} placeholder="Auto-converted" icon="calendar" />
          </Field>
          <Field label="Estimated Loss (NPR)" required>
            <input
              type="number"
              placeholder="e.g. 100000"
              value={form.estimatedLoss}
              onChange={(e) => set('estimatedLoss', e.target.value)}
              className={inputCls}
            />
          </Field>
        </div>

        {/* Advises */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1.5">Advise</p>
          <div className="flex flex-wrap gap-1.5">
            {ADVISE_OPTIONS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => toggleAdvise(a)}
                className={cn(
                  'px-2.5 py-1 rounded-full text-xs font-medium border transition-all',
                  form.advises.includes(a)
                    ? 'bg-brand text-brand-foreground border-brand'
                    : 'bg-background text-muted-foreground border-border hover:border-brand/50'
                )}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* Incident Details */}
      <Section title="Incident Details">
        {/* Bypass checkbox */}
        <CheckboxField
          id="bypassOccurance"
          label="Bypass Occurrence Date Validation"
          checked={form.bypassOccuranceDateValidation}
          onChange={(v) => set('bypassOccuranceDateValidation', v)}
        />

        <div className="grid grid-cols-3 gap-3">
          <Field label="Occurrence Date (A.D.)" required>
            <DatePicker
              value={form.occuranceDate}
              max={form.bypassOccuranceDateValidation ? undefined : form.intimationDate}
              onChange={handleOccuranceDate}
            />
          </Field>
          <Field label="Occurrence Date (B.S.)">
            <ReadonlyInput value={form.occuranceDateNepali} placeholder="Auto-converted" icon="calendar" />
          </Field>
          <Field label="Nature of Loss" required>
            <NativeSelect
              value={form.natureLoss}
              onChange={(v) => set('natureLoss', v)}
              options={NATURE_OF_LOSS_OPTIONS}
              placeholder="Select Nature of Loss"
            />
          </Field>

          <Field label="Cause of Incident">
            <TextInput placeholder="e.g. Brake failure" value={form.incidentReason} onChange={(v) => set('incidentReason', v)} />
          </Field>
          <Field label="Extent of Damage">
            <TextInput placeholder="e.g. Minor, Major" value={form.damageExtend} onChange={(v) => set('damageExtend', v)} />
          </Field>
        </div>

        {/* Damage Location */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Damage Location</p>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Province">
              <NativeSelect value={form.province} onChange={(v) => set('province', v)} options={PROVINCES} placeholder="Select Province" />
            </Field>
            <Field label="District">
              <TextInput placeholder="e.g. Kathmandu" value={form.district} onChange={(v) => set('district', v)} />
            </Field>
            <Field label="Municipality">
              <TextInput placeholder="e.g. Kathmandu Metro" value={form.municipality} onChange={(v) => set('municipality', v)} />
            </Field>
            <Field label="Ward">
              <TextInput placeholder="e.g. 10" value={form.ward} onChange={(v) => set('ward', v)} />
            </Field>
            <Field label="Street Address">
              <TextInput placeholder="Street Address" value={form.nepalStreet} onChange={(v) => set('nepalStreet', v)} />
            </Field>
          </div>
        </div>

        {/* Recovery Type */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Recovery Type</p>
          <RadioOption
            id="reinsurance"
            label="Reinsurance Recovery"
            checked={form.isBasicRecovery === true}
            onChange={() => set('isBasicRecovery', true)}
          />
        </div>

        {/* Loss Types */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Loss Type</p>
          <div className="grid grid-cols-3 gap-2.5">
            <CheckboxField id="constructiveLoss" label="Constructive Loss" checked={form.isConstructiveLoss} onChange={(v) => set('isConstructiveLoss', v)} />
            <CheckboxField id="cashLoss" label="Cash Loss" checked={form.isCashLoss} onChange={(v) => set('isCashLoss', v)} />
            <CheckboxField id="totalLoss" label="Total Loss" checked={form.isTotalClaimLoss} onChange={(v) => set('isTotalClaimLoss', v)} />
            <CheckboxField id="theft" label="Theft" checked={form.isTheft} onChange={(v) => set('isTheft', v)} />
            <CheckboxField id="kfkTraced" label="KFK Traced" checked={form.isKfkTraced} onChange={(v) => set('isKfkTraced', v)} />
            <CheckboxField id="kfkNotTraced" label="KFK Not Traced" checked={form.isKfkNotTraced} onChange={(v) => set('isKfkNotTraced', v)} />
            <CheckboxField id="knockForKnock" label="Knock For Knock" checked={form.isKnockForKnock} onChange={(v) => set('isKnockForKnock', v)} />
          </div>
        </div>

        {/* KFK Details */}
        {form.isKnockForKnock && (
          <div className="rounded-lg border border-border bg-muted/40 p-3 space-y-3">
            <div className="flex gap-5">
              <RadioOption id="kfkIn" label="KFK IN" checked={form.isKnockForKnockIn === true} onChange={() => set('isKnockForKnockIn', true)} />
              <RadioOption id="kfkOut" label="KFK OUT" checked={form.isKnockForKnockIn === false} onChange={() => set('isKnockForKnockIn', false)} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Field label="KFK Remarks">
                <TextInput placeholder="Remarks" value={form.kfkRemarks} onChange={(v) => set('kfkRemarks', v)} />
              </Field>
              <Field label="KFK Reference Number">
                <TextInput placeholder="Reference Number" value={form.kfkReferenceNumber} onChange={(v) => set('kfkReferenceNumber', v)} />
              </Field>
            </div>
          </div>
        )}
      </Section>

      {/* Vehicle Details (from policy, read-only) */}
      <Section title="Vehicle Details">
        <div className="grid grid-cols-3 gap-3">
          <Field label="Model">
            <ReadonlyInput value={form.vehicleModel} placeholder="From policy" />
          </Field>
          <Field label="Sub-Model">
            <ReadonlyInput value={form.subModel} placeholder="From policy" />
          </Field>
          <Field label="Manufacture Year">
            <ReadonlyInput value={form.manufactureYear} placeholder="From policy" />
          </Field>
          <Field label="Chassis Number">
            <ReadonlyInput value={form.chasisNumber} placeholder="From policy" />
          </Field>
          <Field label="Engine Number">
            <ReadonlyInput value={form.engineNumber} placeholder="From policy" />
          </Field>
          <Field label="Register Number">
            <ReadonlyInput value={form.registrationNumber} placeholder="From policy" />
          </Field>
          <Field label="Risk Type">
            <ReadonlyInput value={policy.riskTypeSelected ?? ''} placeholder="From policy" />
          </Field>
        </div>
      </Section>

      {/* Allocated To */}
      <Section title="Assignment">
        <div className="grid grid-cols-3 gap-3">
          <Field label="Allocated To">
            <NativeSelect value={form.assignedUser} onChange={(v) => set('assignedUser', v)} options={[]} placeholder="Select a User" />
          </Field>
        </div>
      </Section>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <p className="text-xs text-muted-foreground">
          <span className="text-destructive">*</span> Required fields
        </p>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            onClick={() => router.back()}
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
              saved ? 'bg-success text-success-foreground' : 'bg-brand text-brand-foreground'
            )}
          >
            {saving ? (
              <><Loader2 size={14} className="animate-spin" /> Saving…</>
            ) : saved ? (
              <><CheckCircle2 size={14} /> Saved!</>
            ) : (
              'Save Intimation'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Input class ───────────────────────────────────────────────────────────────
const inputCls =
  'h-9 w-full rounded-lg border border-input px-3 text-sm text-foreground bg-background placeholder:text-muted-foreground/50 focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all'

// ─── Primitives ────────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card px-5 py-4 space-y-3">
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{title}</p>
      {children}
    </div>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-muted-foreground leading-none">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      {children}
    </div>
  )
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={inputCls}
    />
  )
}

function DatePicker({ value, onChange, max }: { value: string; onChange: (v: string) => void; max?: string }) {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <div
      className="relative flex items-center group cursor-pointer"
      onClick={() => ref.current?.showPicker?.()}
    >
      <input
        ref={ref}
        type="date"
        value={value}
        max={max}
        title="Select date"
        placeholder="YYYY-MM-DD"
        onChange={(e) => onChange(e.target.value)}
        className={cn(inputCls, 'cursor-pointer pr-9 [color-scheme:light]')}
      />
      <CalendarDays
        size={14}
        className="absolute right-2.5 pointer-events-none text-muted-foreground group-hover:text-brand transition-colors"
      />
    </div>
  )
}

function TimePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <div
      className="relative flex items-center group cursor-pointer"
      onClick={() => ref.current?.showPicker?.()}
    >
      <input
        ref={ref}
        type="time"
        value={value}
        title="Select time"
        placeholder="HH:MM"
        onChange={(e) => onChange(e.target.value)}
        className={cn(inputCls, 'cursor-pointer pr-9 [color-scheme:light]')}
      />
      <Clock
        size={14}
        className="absolute right-2.5 pointer-events-none text-muted-foreground group-hover:text-brand transition-colors"
      />
    </div>
  )
}

function ReadonlyInput({ value, placeholder, icon }: { value: string; placeholder?: string; icon?: 'calendar' }) {
  return (
    <div className="relative flex items-center">
      <input
        readOnly
        value={value}
        placeholder={placeholder}
        className={cn(inputCls, 'bg-muted/60 cursor-default text-muted-foreground', icon && 'pr-9')}
      />
      {icon === 'calendar' && (
        <CalendarDays size={14} className="absolute right-2.5 pointer-events-none text-muted-foreground/50" />
      )}
    </div>
  )
}

function NativeSelect({ value, onChange, options, placeholder }: {
  value: string
  onChange: (v: string) => void
  options: string[]
  placeholder?: string
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      title={placeholder ?? 'Select an option'}
      aria-label={placeholder ?? 'Select an option'}
      className={cn(inputCls, 'cursor-pointer')}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  )
}

function CheckboxField({ id, label, checked, onChange }: {
  id: string; label: string; checked: boolean; onChange: (v: boolean) => void
}) {
  return (
    <label htmlFor={id} className="flex items-center gap-2 cursor-pointer select-none group">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-input accent-brand cursor-pointer"
      />
      <span className="text-xs font-medium text-foreground group-hover:text-brand transition-colors">{label}</span>
    </label>
  )
}

function RadioOption({ id, label, checked, onChange }: {
  id: string; label: string; checked: boolean; onChange: () => void
}) {
  return (
    <label htmlFor={id} className="flex items-center gap-2 cursor-pointer select-none group">
      <input
        id={id}
        type="radio"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 accent-brand cursor-pointer"
      />
      <span className="text-xs font-medium text-foreground group-hover:text-brand transition-colors">{label}</span>
    </label>
  )
}

function StatusBadge({ status }: { status: boolean }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold',
      status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    )}>
      <span className={cn('w-1.5 h-1.5 rounded-full', status ? 'bg-green-500' : 'bg-red-500')} />
      {status ? 'Active' : 'Inactive'}
    </span>
  )
}
