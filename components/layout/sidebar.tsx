'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  Users,
  Building2,
  BarChart2,
  ChevronRight,
  X,
  Mountain,
} from 'lucide-react'
import { cn } from '@/lib/utils/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

type NavChild = {
  title: string
  href: string
}

type NavItem = {
  id: string
  title: string
  icon: React.ElementType
  href?: string
  children?: NavChild[]
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/',
  },
  {
    id: 'claim',
    title: 'Claim',
    icon: FileText,
    children: [{ title: 'Claim Intimation', href: '/claim/intimation' }],
  },
  {
    id: 'crm',
    title: 'CRM',
    icon: Users,
    children: [{ title: 'Customer', href: '/crm/customer' }],
  },
  {
    id: 'organization',
    title: 'Organization',
    icon: Building2,
    children: [{ title: 'Branch', href: '/organization/branch' }],
  },
  {
    id: 'reporting',
    title: 'Reporting',
    icon: BarChart2,
    children: [
      { title: 'Underwriting Reporting', href: '/reporting/underwriting' },
      { title: 'Claim Reporting', href: '/reporting/claim' },
      { title: 'Reinsurance Reporting', href: '/reporting/reinsurance' },
    ],
  },
]

function NavTooltip({
  label,
  collapsed,
  children,
}: {
  label: string
  collapsed: boolean
  children: React.ReactNode
}) {
  if (!collapsed) return <>{children}</>
  return (
    <Tooltip>
      <TooltipTrigger render={<div className="contents" />}>
        {children}
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({})
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('sidebar-collapsed')
    if (stored !== null) setCollapsed(stored === 'true')
  }, [])

  useEffect(() => {
    if (mounted) localStorage.setItem('sidebar-collapsed', String(collapsed))
  }, [collapsed, mounted])

  useEffect(() => {
    navItems.forEach((item) => {
      if (item.children) {
        const isActive = item.children.some((c) => pathname.startsWith(c.href))
        if (isActive) setOpenMenus((prev) => ({ ...prev, [item.id]: true }))
      }
    })
  }, [pathname])

  const toggleMenu = (id: string) => {
    if (collapsed) {
      setCollapsed(false)
      setTimeout(() => setOpenMenus((prev) => ({ ...prev, [id]: true })), 60)
      return
    }
    setOpenMenus((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const navItemClass = (active: boolean) =>
    cn(
      'flex items-center h-10 rounded-lg mx-2 px-3 transition-all duration-150 select-none',
      active ? 'bg-brand text-brand-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
    )

  // Animation-only style objects — no color values
  const labelStyle = {
    opacity: collapsed ? 0 : 1,
    maxWidth: collapsed ? 0 : 200,
    overflow: 'hidden' as const,
    whiteSpace: 'nowrap' as const,
    transition: 'opacity 0.15s, max-width 0.25s',
  }

  return (
    <TooltipProvider delay={400}>
      <aside
        className={cn(
          'relative flex flex-col h-full bg-card border-r border-border flex-shrink-0 shadow-[1px_0_8px_0_rgba(0,0,0,0.04)] transition-[width] duration-[250ms]',
          collapsed ? 'w-[72px]' : 'w-64'
        )}
        style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
      >
        {/* Brand / Logo */}
        <div className="flex items-center h-[60px] px-4 border-b border-border flex-shrink-0 overflow-hidden">
          <button
            onClick={() => collapsed && setCollapsed(false)}
            className={cn(
              'flex items-center justify-center rounded-xl flex-shrink-0 bg-brand w-9 h-9 min-w-9 transition-transform duration-150',
              collapsed ? 'cursor-pointer hover:scale-105 active:scale-95' : 'cursor-default'
            )}
            title={collapsed ? 'Open sidebar' : undefined}
            aria-label={collapsed ? 'Open sidebar' : 'Logo'}
            tabIndex={collapsed ? 0 : -1}
          >
            <Mountain className="text-brand-foreground" size={18} strokeWidth={2.5} />
          </button>
          <div className="ml-3 flex-1 overflow-hidden" style={labelStyle}>
            <p className="text-[10.5px] font-extrabold tracking-wider leading-snug text-brand">
              HIMALAYAN EVEREST
            </p>
            <p className="text-[10.5px] font-extrabold tracking-wider leading-snug text-brand">
              INSURANCE
            </p>
            <p className="text-[9px] font-semibold tracking-[0.2em] leading-snug mt-0.5 text-brand/50">
              HEI
            </p>
          </div>
          {/* Close button — only visible when expanded */}
          <button
            onClick={() => setCollapsed(true)}
            className={cn(
              'flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-[colors,opacity] duration-[150ms]',
              collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
            )}
            aria-label="Close sidebar"
            title="Close sidebar"
            tabIndex={collapsed ? -1 : 0}
          >
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const isLeafActive = !item.children && item.href === pathname
            const isParentActive = !!item.children?.some((c) => pathname.startsWith(c.href))
            const isOpen = openMenus[item.id]

            if (!item.children) {
              return (
                <NavTooltip key={item.id} label={item.title} collapsed={collapsed}>
                  <Link href={item.href!} className={navItemClass(isLeafActive)}>
                    <Icon size={18} className="flex-shrink-0" />
                    <span className="ml-3 text-sm font-medium" style={labelStyle}>
                      {item.title}
                    </span>
                  </Link>
                </NavTooltip>
              )
            }

            return (
              <div key={item.id}>
                <NavTooltip label={item.title} collapsed={collapsed}>
                  <button
                    onClick={() => toggleMenu(item.id)}
                    className={cn(
                      navItemClass(false),
                      'w-[calc(100%-16px)] text-left',
                      isParentActive && 'text-foreground'
                    )}
                  >
                    <Icon
                      size={18}
                      className={cn('flex-shrink-0', isParentActive && 'text-brand')}
                    />
                    <span className="ml-3 text-sm font-medium flex-1 truncate" style={labelStyle}>
                      {item.title}
                    </span>
                    <ChevronRight
                      size={14}
                      className={cn(
                        'flex-shrink-0 text-muted-foreground transition-[opacity,transform] duration-200',
                        isOpen ? 'rotate-90' : '',
                        collapsed ? 'opacity-0' : 'opacity-100'
                      )}
                    />
                  </button>
                </NavTooltip>

                {/* Submenu */}
                <div
                  style={{
                    maxHeight: !collapsed && isOpen ? `${item.children.length * 40}px` : 0,
                    overflow: 'hidden',
                    transition: 'max-height 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  {item.children.map((child) => {
                    const isChildActive = pathname.startsWith(child.href)
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          'flex items-center h-9 mx-2 pl-11 pr-3 rounded-lg mb-0.5 text-sm transition-all duration-150',
                          isChildActive
                            ? 'text-brand bg-brand/[0.07] font-medium'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        )}
                      >
                        <span
                          className={cn(
                            'w-1.5 h-1.5 rounded-full mr-2.5 flex-shrink-0',
                            isChildActive ? 'bg-brand opacity-100' : 'bg-current opacity-35'
                          )}
                        />
                        <span className="truncate">{child.title}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </nav>
      </aside>
    </TooltipProvider>
  )
}
