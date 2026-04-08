'use client'
import { useState } from 'react'
import {
  Search,
  X,
  FileText,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table'
import { useGetPolicyBasicInfoByDocumentNumber } from '@/hooks/use-claim'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { IntimationForm, PolicyResult } from '@/lib/interface/claim/claimintimation'

const PRIMARY = '#19386C'

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: boolean }) {
  const config = status
    ? { bg: '#dcfce7', color: '#166534', dot: '#22c55e', label: 'Active' }
    : { bg: '#fee2e2', color: '#991b1b', dot: '#ef4444', label: 'Inactive' }

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{ background: config.bg, color: config.color }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: config.dot }}
      />
      {config.label}
    </span>
  )
}

// ─── Sort Icon ────────────────────────────────────────────────────────────────

function SortIcon({ direction }: { direction: 'asc' | 'desc' | false }) {
  if (direction === 'asc') return <ChevronUp size={12} />
  if (direction === 'desc') return <ChevronDown size={12} />
  return <ChevronsUpDown size={12} className="text-slate-400" />
}

// ─── Intimation Modal ─────────────────────────────────────────────────────────

function IntimationModal({
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col"
        style={{ maxHeight: '90vh' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 rounded-t-2xl flex-shrink-0"
          style={{ background: PRIMARY }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
              <FileText size={16} className="text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Claim Intimation</p>
              <p className="text-white/60 text-xs">{policy.policyNumber}</p>
            </div>
          </div>
          <Button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X size={15} className="text-white" />
          </Button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          {/* Policy summary */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Policy Details
            </p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
              {[
                ['Policy No', policy.policyNumber],
                ['Document No', policy.documentNumber],
                ['Insured Name', policy.insuredPartyName],
                ['Sum Insured', `NPR ${policy.sumInsured}`],
                ['Effective Date', policy.effectiveDate],
                ['Expiry Date', policy.expiryDate],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">{label}</p>
                  <p className="text-sm font-medium text-slate-800 mt-0.5">{value}</p>
                </div>
              ))}
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide">Status</p>
                <div className="mt-1">
                  <StatusBadge status={policy.status} />
                </div>
              </div>
            </div>
          </div>

          {/* Intimation details */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Intimation Details
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-600">
                  Date of Loss <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="date"
                  value={form.dateOfLoss}
                  onChange={(e) => set('dateOfLoss', e.target.value)}
                  className="h-9 rounded-lg border border-slate-200 px-3 text-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="causeOfLoss" className="text-xs font-medium text-slate-600">
                  Cause of Loss <span className="text-rose-500">*</span>
                </label>
                <select
                  id="causeOfLoss"
                  value={form.causeOfLoss}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    set('causeOfLoss', e.target.value)
                  }
                  className="h-9 rounded-lg border border-slate-200 px-3 text-sm text-slate-800 bg-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
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
                <label className="text-xs font-medium text-slate-600">Place of Loss</label>
                <input
                  type="text"
                  placeholder="e.g. Kathmandu, Lalitpur"
                  value={form.placeOfLoss}
                  onChange={(e) => set('placeOfLoss', e.target.value)}
                  className="h-9 rounded-lg border border-slate-200 px-3 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-600">Estimated Loss (NPR)</label>
                <input
                  type="text"
                  placeholder="e.g. 100,000"
                  value={form.estimatedLoss}
                  onChange={(e) => set('estimatedLoss', e.target.value)}
                  className="h-9 rounded-lg border border-slate-200 px-3 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
              <div className="col-span-2 flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-600">
                  Description of Incident <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Briefly describe the incident..."
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Contact details */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Contact Details
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-600">Contact Person</label>
                <Input
                  type="text"
                  value={form.contactPerson}
                  onChange={(e) => set('contactPerson', e.target.value)}
                  className="h-9 rounded-lg border border-slate-200 px-3 text-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-600">Contact Number</label>
                <input
                  type="tel"
                  placeholder="98XXXXXXXX"
                  value={form.contactNumber}
                  onChange={(e) => set('contactNumber', e.target.value)}
                  className="h-9 rounded-lg border border-slate-200 px-3 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="relationship" className="text-xs font-medium text-slate-600">
                  Relationship
                </label>
                <Select
                  value={form.relationship}
                  onValueChange={(value) => set('relationship', value ?? 'Self')}
                >
                  <SelectTrigger id="relationship" className="h-9 rounded-lg border border-slate-200 px-3 text-sm">
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
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 flex-shrink-0 bg-slate-50 rounded-b-2xl">
          <p className="text-xs text-slate-400">
            <span className="text-rose-500">*</span> Required fields
          </p>
          <div className="flex items-center gap-3">
            <Button
              onClick={onClose}
              className="h-9 px-4 rounded-lg text-sm font-medium text-slate-600 border border-slate-200 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || saved}
              className="h-9 px-5 rounded-lg text-sm font-semibold text-white flex items-center gap-2 transition-all disabled:opacity-80"
              style={{ background: saved ? '#22c55e' : PRIMARY }}
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
    </div>
  )
}

// ─── Policy Data Table ────────────────────────────────────────────────────────

const columnHelper = createColumnHelper<PolicyResult>()

function PolicyDataTable({
  data,
  onIntimate,
}: {
  data: PolicyResult[]
  onIntimate: (row: PolicyResult) => void
}) {
  'use no memo'
  const [sorting, setSorting] = useState<SortingState>([])

  const columns = [
    columnHelper.accessor('insuredPartyName', {
      header: 'Insured Name',
      cell: (info) => (
        <span className="font-medium text-slate-700">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('sumInsured', {
      header: 'Sum Insured (NPR)',
      cell: (info) => info.getValue()?.toLocaleString() ?? '—',
    }),
    columnHelper.accessor('effectiveDate', {
      header: 'Effective Date',
    }),
    columnHelper.accessor('expiryDate', {
      header: 'Expiry Date',
    }),
    columnHelper.accessor('branchCode', {
      header: 'Branch Code',
    }),
    columnHelper.accessor('class', {
      header: 'Class',
    }),
    columnHelper.accessor('riskTypeSelected', {
      header: 'Risk Type',
    }),
    columnHelper.accessor('documentType', {
      header: 'Document Type',
    }),
    columnHelper.accessor('classId', {
      header: 'Class ID',
    }),
    columnHelper.accessor('policyNumber', {
      header: 'Policy No',
      cell: (info) => (
        <span className="font-medium text-slate-700">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('documentNumber', {
      header: 'Document No',
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => <StatusBadge status={info.getValue()} />,
    }),
    columnHelper.display({
      id: 'action',
      header: 'Action',
      cell: ({ row }) => (
        <Button
          type="button"
          onClick={() => onIntimate(row.original)}
          className="h-8 px-4 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-90 active:scale-95"
          style={{ background: PRIMARY }}
        >
          Intimate
        </Button>
      ),
    }),
  ]

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Table header bar */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-700">
          Search Results
          <span className="ml-2 text-xs font-medium text-slate-400">
            {data.length} {data.length === 1 ? 'record' : 'records'} found
          </span>
        </p>
        {/* Page size selector */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Rows per page</span>
          <select
            aria-label="Rows per page"
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="h-7 rounded-md border border-slate-200 px-2 text-xs text-slate-700 bg-white focus:outline-none focus:border-blue-400"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-slate-50 border-b border-slate-100">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-xs font-semibold text-slate-500 uppercase tracking-wide py-3"
                  >
                    {header.isPlaceholder ? null : (
                      <button
                        className={
                          header.column.getCanSort()
                            ? 'flex items-center gap-1 cursor-pointer select-none hover:text-slate-700 transition-colors'
                            : 'flex items-center gap-1'
                        }
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <SortIcon direction={header.column.getIsSorted()} />
                        )}
                      </button>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="divide-y divide-slate-50">
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-slate-50/60 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-4 py-3 text-sm text-slate-600">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 bg-slate-50">
        <p className="text-xs text-slate-500">
          Page{' '}
          <span className="font-medium text-slate-700">
            {table.getState().pagination.pageIndex + 1}
          </span>{' '}
          of{' '}
          <span className="font-medium text-slate-700">{table.getPageCount()}</span>
          {' · '}
          {data.length} total
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="p-1.5 rounded-md hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="First page"
          >
            <ChevronsLeft size={14} className="text-slate-600" />
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-1.5 rounded-md hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Previous page"
          >
            <ChevronLeft size={14} className="text-slate-600" />
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-1.5 rounded-md hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Next page"
          >
            <ChevronRight size={14} className="text-slate-600" />
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="p-1.5 rounded-md hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Last page"
          >
            <ChevronsRight size={14} className="text-slate-600" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ClaimIntimationPage() {
  const [query, setQuery] = useState('')
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyResult | null>(null)

  const { data, isFetching, isError, error, refetch } = useGetPolicyBasicInfoByDocumentNumber(query.trim())

  const results: PolicyResult[] | undefined = Array.isArray(data) ? data : data ? [data] : undefined

  const handleSearch = () => {
    if (query.trim()) refetch()
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Claim Intimation</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Search a policy by document number and initiate a claim intimation.
        </p>
      </div>

      {/* Search card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Find Policy
        </p>
        <div className="flex gap-3 items-end">
          <div className="flex-1 max-w-md flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-600">Document Number</label>
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"
              />
              <input
                type="text"
                placeholder="Enter document number…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="h-10 w-full pl-9 pr-4 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>
          <Button
            type="button"
            onClick={handleSearch}
            disabled={isFetching || !query.trim()}
            className="h-10 px-5 rounded-xl text-sm font-semibold text-white flex items-center gap-2 transition-all disabled:opacity-60 flex-shrink-0 bg-[#19386C]"
          >
            {isFetching ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Searching…
              </>
            ) : (
              <>
                <Search size={14} />
                Search
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Error */}
      {isError && (
        <div className="flex items-center gap-3 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl px-4 py-3 text-sm">
          <AlertCircle size={16} className="flex-shrink-0" />
          {(error as Error)?.message ?? 'Something went wrong. Please try again.'}
        </div>
      )}

      {/* No results */}
      {!isFetching && !isError && results?.length === 0 && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 text-amber-700 rounded-xl px-4 py-3 text-sm">
          <AlertCircle size={16} className="flex-shrink-0" />
          No policy found for document number &quot;{query.trim()}&quot;.
        </div>
      )}

      {/* Data table */}
      {results && results.length > 0 && (
        <PolicyDataTable data={results} onIntimate={setSelectedPolicy} />
      )}

      {/* Intimation modal */}
      {selectedPolicy && (
        <IntimationModal
          policy={selectedPolicy}
          onClose={() => setSelectedPolicy(null)}
        />
      )}
    </div>
  )
}
