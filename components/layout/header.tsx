'use client'

import { useState } from 'react'
import { Bell, Settings, ChevronDown, Search, User, LogOut, UserCircle } from 'lucide-react'
import { cn } from '@/lib/api/utility/utils'
import { Button } from '@base-ui/react'
import { Input } from '../ui/input'

export default function Header() {
  const [notifOpen, setNotifOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)

  return (
    <header className="flex items-center justify-between h-[60px] px-5 flex-shrink-0 z-30 relative bg-brand">
      {/* Left — Search */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-brand-foreground/45"
            size={14}
          />
          <Input
            type="text"
            placeholder="Search..."
            className="h-8 w-[220px] pl-9 pr-4 rounded-lg text-sm bg-brand-foreground/10 border border-brand-foreground/10 text-brand-foreground placeholder:text-brand-foreground/40 focus:outline-none focus:bg-brand-foreground/15 focus:border-brand-foreground/25 transition-all"
          />
        </div>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-1">
        {/* Notification Bell */}
        <div className="relative">
          <Button
            onClick={() => { setNotifOpen(!notifOpen); setUserOpen(false) }}
            className="relative flex items-center justify-center w-9 h-9 rounded-lg transition-colors text-brand-foreground/75 hover:text-brand-foreground hover:bg-brand-foreground/10"
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-400 ring-2 ring-brand" />
          </Button>

          {notifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-80 bg-card rounded-xl shadow-xl border border-border z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-sm font-semibold text-foreground">Notifications</p>
                  <p className="text-xs text-muted-foreground mt-0.5">3 unread</p>
                </div>
                <div className="divide-y divide-border max-h-72 overflow-y-auto">
                  {[
                    { title: 'New claim submitted', desc: 'Claim #CLM-2024-001 has been submitted', time: '2 min ago', unread: true },
                    { title: 'Customer onboarded', desc: 'New customer registration approved', time: '1 hr ago', unread: true },
                    { title: 'Report generated', desc: 'Monthly underwriting report is ready', time: '3 hr ago', unread: false },
                  ].map((n, i) => (
                    <div
                      key={i}
                      className={cn(
                        'flex gap-3 px-4 py-3 hover:bg-muted cursor-pointer transition-colors',
                        n.unread && 'bg-brand/5'
                      )}
                    >
                      <div
                        className={cn(
                          'w-2 h-2 rounded-full mt-1.5 flex-shrink-0',
                          n.unread ? 'bg-brand' : 'bg-transparent'
                        )}
                        style={{ minWidth: 8 }}
                      />
                      <div>
                        <p className="text-sm font-medium text-foreground">{n.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{n.desc}</p>
                        <p className="text-[10px] text-muted-foreground/70 mt-1">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5 border-t border-border">
                  <button className="text-xs font-medium w-full text-center text-brand">
                    View all notifications
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Settings */}
        <Button className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors text-brand-foreground/75 hover:text-brand-foreground hover:bg-brand-foreground/10">
          <Settings size={18} />
        </Button>

        {/* Divider */}
        <div className="w-px h-5 mx-1 bg-brand-foreground/20" />

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => { setUserOpen(!userOpen); setNotifOpen(false) }}
            className="flex items-center gap-2.5 h-9 px-2.5 rounded-lg transition-colors text-brand-foreground/90 hover:text-brand-foreground hover:bg-brand-foreground/10"
          >
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 bg-brand-foreground/18">
              AD
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-semibold leading-tight text-brand-foreground">Admin User</p>
              <p className="text-[10px] leading-tight text-brand-foreground/55">Administrator</p>
            </div>
            <ChevronDown
              size={13}
              className={cn('transition-transform duration-200 text-brand-foreground/55', userOpen ? 'rotate-180' : '')}
            />
          </button>

          {userOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setUserOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-52 bg-card rounded-xl shadow-xl border border-border z-50 overflow-hidden py-1">
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-sm font-semibold text-foreground">Admin User</p>
                  <p className="text-xs text-muted-foreground mt-0.5">admin@hei.com.np</p>
                </div>
                {[
                  { icon: UserCircle, label: 'My Profile', href: '#' },
                  { icon: Settings, label: 'Account Settings', href: '#' },
                  { icon: User, label: 'Manage Users', href: '#' },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <item.icon size={15} className="text-muted-foreground" />
                    {item.label}
                  </a>
                ))}
                <div className="border-t border-border mt-1 pt-1">
                  <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors">
                    <LogOut size={15} />
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
