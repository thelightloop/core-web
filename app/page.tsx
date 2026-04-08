import { FileText, Users, Building2, BarChart2, TrendingUp, ShieldCheck, Activity } from 'lucide-react'

const stats = [
  { label: 'Total Claims',      value: '1,284', change: '+12%',  icon: FileText,  iconBg: 'bg-brand/10',      iconColor: 'text-brand'      },
  { label: 'Active Customers',  value: '8,421', change: '+5.2%', icon: Users,     iconBg: 'bg-cyan-700/10',   iconColor: 'text-cyan-700'   },
  { label: 'Branch Offices',    value: '24',    change: '+2',    icon: Building2, iconBg: 'bg-violet-700/10', iconColor: 'text-violet-700' },
  { label: 'Reports Generated', value: '342',   change: '+18%',  icon: BarChart2, iconBg: 'bg-teal-700/10',   iconColor: 'text-teal-700'   },
]

const recent = [
  { id: 'CLM-001', type: 'Claim Intimation',    customer: 'Ram Sharma',     status: 'Pending',   date: '2026-04-07' },
  { id: 'CRM-042', type: 'New Customer',         customer: 'Sita Adhikari',  status: 'Active',    date: '2026-04-06' },
  { id: 'CLM-002', type: 'Claim Intimation',    customer: 'Hari Thapa',     status: 'In Review', date: '2026-04-05' },
  { id: 'ORG-011', type: 'Branch Opened',        customer: 'Pokhara Branch', status: 'Active',    date: '2026-04-04' },
  { id: 'RPT-009', type: 'Underwriting Report', customer: 'System',         status: 'Generated', date: '2026-04-03' },
]

const statusColor: Record<string, string> = {
  Pending:    'bg-amber-50 text-amber-700',
  Active:     'bg-emerald-50 text-emerald-700',
  'In Review':'bg-blue-50 text-blue-700',
  Generated:  'bg-purple-50 text-purple-700',
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Welcome back — here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Activity size={13} />
          <span>Last updated: just now</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                  <TrendingUp size={11} />
                  {stat.change} this month
                </p>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${stat.iconBg}`}>
                <stat.icon size={18} className={stat.iconColor} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">Recent Activity</h2>
          </div>
          <button className="text-xs font-medium text-brand">
            View all
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/70">
                <th className="text-left text-xs font-semibold text-muted-foreground px-6 py-3 tracking-wide">ID</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-6 py-3 tracking-wide">Type</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-6 py-3 tracking-wide">Customer / Entity</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-6 py-3 tracking-wide">Status</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-6 py-3 tracking-wide">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recent.map((row) => (
                <tr key={row.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-3.5 font-mono text-xs text-muted-foreground">{row.id}</td>
                  <td className="px-6 py-3.5 text-foreground font-medium">{row.type}</td>
                  <td className="px-6 py-3.5 text-muted-foreground">{row.customer}</td>
                  <td className="px-6 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[row.status]}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-muted-foreground text-xs">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
