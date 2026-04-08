'use client'

import { useState } from 'react'
import { Bell, Settings, ChevronDown, Search, User, LogOut, UserCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@base-ui/react'
import { Input } from '../ui/input'

const PRIMARY = '#19386C'

export default function Header() {
  const [notifOpen, setNotifOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)

  return (
    <header
      className="flex items-center justify-between h-[60px] px-5 flex-shrink-0 z-30 relative"
      style={{ background: PRIMARY }}
    >
      {/* Left — Search */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            size={14}
            style={{ color: 'rgba(255,255,255,0.45)' }}
          />
          <Input
            type="text"
            placeholder="Search..."
            className="h-8 pl-9 pr-4 rounded-lg text-sm bg-white/10 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:bg-white/15 focus:border-white/25 transition-all"
            style={{ width: 220 }}
          />
        </div>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-1">
        {/* Notification Bell */}
        <div className="relative">
          <Button
        
            onClick={() => { setNotifOpen(!notifOpen); setUserOpen(false) }}
            className="relative flex items-center justify-center w-9 h-9 rounded-lg transition-colors text-white/75 hover:text-white hover:bg-white/10"
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-400 ring-2 ring-[#19386C]" />
          </Button>

          {notifOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setNotifOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-800">Notifications</p>
                  <p className="text-xs text-slate-400 mt-0.5">3 unread</p>
                </div>
                <div className="divide-y divide-slate-50 max-h-72 overflow-y-auto">
                  {[
                    { title: 'New claim submitted', desc: 'Claim #CLM-2024-001 has been submitted', time: '2 min ago', unread: true },
                    { title: 'Customer onboarded', desc: 'New customer registration approved', time: '1 hr ago', unread: true },
                    { title: 'Report generated', desc: 'Monthly underwriting report is ready', time: '3 hr ago', unread: false },
                  ].map((n, i) => (
                    <div
                      key={i}
                      className={cn(
                        'flex gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors',
                        n.unread && 'bg-blue-50/50'
                      )}
                    >
                      <div
                        className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                        style={{ background: n.unread ? PRIMARY : 'transparent', minWidth: 8 }}
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-800">{n.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{n.desc}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5 border-t border-slate-100">
                  <button className="text-xs font-medium w-full text-center" style={{ color: PRIMARY }}>
                    View all notifications
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Settings */}
        <Button className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors text-white/75 hover:text-white hover:bg-white/10">
          <Settings size={18} />
        </Button>

        {/* Divider */}
        <div className="w-px h-5 mx-1 bg-white/20" />

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => { setUserOpen(!userOpen); setNotifOpen(false) }}
            className="flex items-center gap-2.5 h-9 px-2.5 rounded-lg transition-colors text-white/90 hover:text-white hover:bg-white/10"
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.18)' }}
            >
              AD
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-semibold leading-tight">Admin User</p>
              <p className="text-[10px] leading-tight" style={{ color: 'rgba(255,255,255,0.55)' }}>Administrator</p>
            </div>
            <ChevronDown
              size={13}
              className={cn('transition-transform duration-200', userOpen ? 'rotate-180' : '')}
              style={{ color: 'rgba(255,255,255,0.55)' }}
            />
          </button>

          {userOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setUserOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden py-1">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-800">Admin User</p>
                  <p className="text-xs text-slate-400 mt-0.5">admin@hei.com.np</p>
                </div>
                {[
                  { icon: UserCircle, label: 'My Profile', href: '#' },
                  { icon: Settings, label: 'Account Settings', href: '#' },
                  { icon: User, label: 'Manage Users', href: '#' },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    <item.icon size={15} className="text-slate-400" />
                    {item.label}
                  </a>
                ))}
                <div className="border-t border-slate-100 mt-1 pt-1">
                  <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 transition-colors">
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
