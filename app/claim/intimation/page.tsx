'use client'
import { useState } from 'react'
import {
  Search,
  AlertCircle,
  Loader2,
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
import { cn } from '@/lib/api/utility/utils'
import { Button } from '@/components/ui/button'
import { UIDialog } from '@/components/ui/ui-dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { PolicyResult } from '@/lib/interface/claim/claimintimation'
import { IntimationModal } from '../../../components/claimIntimation/intimationpage'

// ─── Status Badge ─────────────────────────────────────────────────────────────

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

// ─── Sort Icon ────────────────────────────────────────────────────────────────

function SortIcon({ direction }: { direction: 'asc' | 'desc' | false }) {
  if (direction === 'asc') return <ChevronUp size={12} />
  if (direction === 'desc') return <ChevronDown size={12} />
  return <ChevronsUpDown size={12} className="text-muted-foreground" />
}

// ─── Intimation Modal ─────────────────────────────────────────────────────────


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
        <span className="font-medium text-foreground">{info.getValue()}</span>
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
        <span className="font-medium text-foreground">{info.getValue()}</span>
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
          className="h-8 px-4 rounded-lg text-xs font-semibold bg-brand text-brand-foreground transition-all hover:opacity-90 active:scale-95"
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
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      {/* Table header bar */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">
          Search Results
          <span className="ml-2 text-xs font-medium text-muted-foreground">
            {data.length} {data.length === 1 ? 'record' : 'records'} found
          </span>
        </p>
        {/* Page size selector */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Rows per page</span>
          <select
            aria-label="Rows per page"
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="h-7 rounded-md border border-input px-2 text-xs text-foreground bg-background focus:outline-none focus:border-ring"
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
              <TableRow key={headerGroup.id} className="bg-muted border-b border-border">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-xs font-semibold text-muted-foreground uppercase tracking-wide py-3"
                  >
                    {header.isPlaceholder ? null : (
                      <button
                        className={
                          header.column.getCanSort()
                            ? 'flex items-center gap-1 cursor-pointer select-none hover:text-foreground transition-colors'
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
          <TableBody className="divide-y divide-border">
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-muted/50 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-4 py-3 text-sm text-muted-foreground">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-border bg-muted">
        <p className="text-xs text-muted-foreground">
          Page{' '}
          <span className="font-medium text-foreground">
            {table.getState().pagination.pageIndex + 1}
          </span>{' '}
          of{' '}
          <span className="font-medium text-foreground">{table.getPageCount()}</span>
          {' · '}
          {data.length} total
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="p-1.5 rounded-md hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="First page"
          >
            <ChevronsLeft size={14} className="text-muted-foreground" />
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-1.5 rounded-md hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Previous page"
          >
            <ChevronLeft size={14} className="text-muted-foreground" />
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-1.5 rounded-md hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Next page"
          >
            <ChevronRight size={14} className="text-muted-foreground" />
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="p-1.5 rounded-md hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Last page"
          >
            <ChevronsRight size={14} className="text-muted-foreground" />
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
  const [dialogOpen, setDialogOpen] = useState(false)

  const { data, isFetching, isError, error, refetch } = useGetPolicyBasicInfoByDocumentNumber(query.trim())

  const results: PolicyResult[] | undefined = Array.isArray(data) ? data : data ? [data] : undefined

  const handleSearch = () => {
    if (query.trim()) refetch()
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">Claim Intimation</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Search a policy by document number and initiate a claim intimation.
        </p>
      </div>

      {/* Search card */}
      <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Find Policy
        </p>
        <div className="flex gap-3 items-end">
          <div className="flex-1 max-w-md flex flex-col gap-1.5">
            <label className="text-sm font-medium text-muted-foreground">Document Number</label>
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Enter document number…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="h-10 w-full pl-9 pr-4 rounded-xl border border-input text-sm text-foreground bg-background placeholder:text-muted-foreground/50 focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all"
              />
            </div>
          </div>
          <Button
            type="button"
            onClick={handleSearch}
            disabled={isFetching || !query.trim()}
            className="h-10 px-5 rounded-xl text-sm font-semibold bg-brand text-brand-foreground flex items-center gap-2 transition-all disabled:opacity-60 flex-shrink-0"
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
        <div className="flex items-center gap-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl px-4 py-3 text-sm">
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
        <PolicyDataTable
          data={results}
          onIntimate={(policy) => {
            setSelectedPolicy(policy)
            setDialogOpen(true)
          }}
        />
      )}

      {/* Intimation dialog */}
      <UIDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {selectedPolicy && (
          <IntimationModal policy={selectedPolicy} onClose={() => setDialogOpen(false)} />
        )}
      </UIDialog>
    </div>
  )
}
