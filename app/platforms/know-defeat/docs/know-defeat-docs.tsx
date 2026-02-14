"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { 
  BookOpen, 
  ChevronRight, 
  Home, 
  Cpu, 
  Database, 
  Settings, 
  Play, 
  BarChart3, 
  Globe, 
  TestTube,
  ExternalLink,
  Menu,
  X
} from "lucide-react"

interface NavItem {
  title: string
  href: string
  children?: NavItem[]
}

const navigation: NavItem[] = [
  { title: "Overview", href: "#overview" },
  { title: "Getting Started", href: "#getting-started", children: [
    { title: "Installation & Setup", href: "#installation-setup" },
    { title: "Bot Configuration", href: "#bot-configuration" },
    { title: "Running the System", href: "#running-system" },
  ]},
  { title: "System Architecture", href: "#architecture", children: [
    { title: "Component Overview", href: "#components" },
    { title: "Data Flow Pipeline", href: "#data-flow" },
  ]},
  { title: "Trading Components", href: "#trading", children: [
    { title: "IB Controller", href: "#ib-controller" },
    { title: "Trading Bots & Algorithms", href: "#bots-algorithms" },
    { title: "Trade Execution", href: "#trade-execution" },
  ]},
  { title: "Performance & Analytics", href: "#analytics", children: [
    { title: "Metrics Calculation", href: "#metrics" },
    { title: "Bot Ranking & Allocation", href: "#ranking" },
    { title: "AI Weight Optimization", href: "#ai-weights" },
  ]},
  { title: "User Interfaces", href: "#interfaces", children: [
    { title: "Streamlit Dashboard", href: "#streamlit" },
    { title: "Remix Frontend", href: "#remix" },
  ]},
  { title: "Data Management", href: "#data", children: [
    { title: "Database Schema", href: "#schema" },
    { title: "Data Persistence", href: "#persistence" },
  ]},
  { title: "Deployment", href: "#deployment", children: [
    { title: "Local Setup", href: "#local-deploy" },
    { title: "Google Cloud Platform", href: "#gcp-deploy" },
  ]},
  { title: "Testing & Validation", href: "#testing" },
]

export function KnowDefeatDocs() {
  const [activeSection, setActiveSection] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState<string[]>(["getting-started", "architecture", "trading", "analytics", "interfaces", "data", "deployment"])

  const toggleSection = (title: string) => {
    const slug = title.toLowerCase().replace(/[^a-z]/g, "-").replace(/-+/g, "-")
    setExpandedSections(prev => 
      prev.includes(slug) 
        ? prev.filter(s => s !== slug)
        : [...prev, slug]
    )
  }

  return (
    <div className="min-h-screen bg-[#030712]">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#0a0d14] border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-white/10"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Link href="/platforms/know-defeat" className="text-sm font-medium text-[#00d2ff]">
            Know-Defeat
          </Link>
          <div className="w-10" />
        </div>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-40 h-screen w-72 bg-[#0a0d14] border-r border-white/10 overflow-y-auto transition-transform lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="sticky top-0 bg-[#0a0d14] p-4 border-b border-white/10">
          <Link href="/platforms/know-defeat" className="flex items-center gap-2 text-[#00d2ff] font-semibold">
            <BookOpen className="w-5 h-5" />
            Know-Defeat Docs
          </Link>
        </div>
        
        <nav className="p-3 space-y-1">
          {navigation.map((item, idx) => (
            <div key={idx}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleSection(item.title)}
                    className="flex items-center justify-between w-full px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <span>{item.title}</span>
                    <ChevronRight className={cn(
                      "w-4 h-4 transition-transform",
                      expandedSections.includes(item.title.toLowerCase().replace(/[^a-z]/g, "-").replace(/-+/g, "-")) && "rotate-90"
                    )} />
                  </button>
                  {expandedSections.includes(item.title.toLowerCase().replace(/[^a-z]/g, "-").replace(/-+/g, "-")) && (
                    <div className="ml-3 mt-1 space-y-1 border-l border-white/10 pl-3">
                      {item.children.map((child, childIdx) => (
                        <a
                          key={childIdx}
                          href={child.href}
                          className="block px-3 py-1.5 text-sm text-slate-400 hover:text-[#00d2ff] hover:bg-white/5 rounded transition-colors"
                        >
                          {child.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <a
                  href={item.href}
                  className="block px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  {item.title}
                </a>
              )}
            </div>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <a
            href="https://github.com/claybowl/Know-Defeat"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View on GitHub
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-72 pt-16 lg:pt-0">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-12 pb-6 border-b border-white/10">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
              <Link href="/platforms/know-defeat" className="hover:text-[#00d2ff]">Platforms</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-slate-300">Documentation</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Know-Defeat Documentation</h1>
            <p className="text-slate-400 text-lg">
              High-frequency algorithmic trading system with 126 bots across multiple tickers
            </p>
          </div>

          {/* Overview Section */}
          <section id="overview" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Home className="w-6 h-6 text-[#00d2ff]" />
              Overview
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-slate-300 leading-relaxed mb-6">
                The Know-Defeat trading system is a high-frequency algorithmic trading platform that executes sub-minute trades through Interactive Brokers. 
                The system manages <span className="text-[#00d2ff] font-semibold">126 trading bots</span> across multiple tickers (TSLA, COIN, NVDA, etc.), 
                using <span className="text-[#00d2ff] font-semibold">8 distinct trading algorithms</span> to generate entry and exit signals. 
                A dynamic fund allocation system ranks bots by performance and limits concurrent trades to 10.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <div className="bg-[#00d2ff]/10 border border-[#00d2ff]/20 rounded-xl p-4">
                  <div className="text-3xl font-bold text-[#00d2ff] mb-1">126</div>
                  <div className="text-sm text-slate-400">Trading Bots</div>
                </div>
                <div className="bg-[#00ffa3]/10 border border-[#00ffa3]/20 rounded-xl p-4">
                  <div className="text-3xl font-bold text-[#00ffa3] mb-1">8</div>
                  <div className="text-sm text-slate-400">Algorithm Types</div>
                </div>
                <div className="bg-[#a78bfa]/10 border border-[#a78bfa]/20 rounded-xl p-4">
                  <div className="text-3xl font-bold text-[#a78bfa] mb-1">10</div>
                  <div className="text-sm text-slate-400">Max Concurrent Trades</div>
                </div>
                <div className="bg-[#fbbf24]/10 border border-[#fbbf24]/20 rounded-xl p-4">
                  <div className="text-3xl font-bold text-[#fbbf24] mb-1">25+</div>
                  <div className="text-sm text-slate-400">Performance Metrics</div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-white mb-4">System Purpose</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#00d2ff] mt-2" />
                  <span><strong className="text-white">Automated trading execution</strong> through Interactive Brokers via IB Gateway API</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#00d2ff] mt-2" />
                  <span><strong className="text-white">Multi-bot management</strong> with 126 independently configured bots</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#00d2ff] mt-2" />
                  <span><strong className="text-white">Performance-based allocation</strong> using weighted ranking metrics</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#00d2ff] mt-2" />
                  <span><strong className="text-white">Real-time analytics</strong> calculating 25+ performance metrics</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#00d2ff] mt-2" />
                  <span><strong className="text-white">Trade capacity management</strong> enforcing max 10 concurrent positions</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Getting Started Section */}
          <section id="getting-started" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Play className="w-6 h-6 text-[#00d2ff]" />
              Getting Started
            </h2>
            
            <div className="space-y-8">
              <div>
                <h3 id="installation-setup" className="text-xl font-semibold text-white mb-4">Prerequisites</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Component</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Requirement</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-300">
                      <tr className="border-b border-white/5">
                        <td className="py-3 px-4">Python</td>
                        <td className="py-3 px-4">3.8+ with Anaconda</td>
                        <td className="py-3 px-4">Core runtime</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-3 px-4">PostgreSQL</td>
                        <td className="py-3 px-4">With TimescaleDB</td>
                        <td className="py-3 px-4">Time-series storage</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-3 px-4">Interactive Brokers</td>
                        <td className="py-3 px-4">TWS or IB Gateway</td>
                        <td className="py-3 px-4">Market data & execution</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-3 px-4">System Resources</td>
                        <td className="py-3 px-4">32GB RAM, 350GB+</td>
                        <td className="py-3 px-4">Tick data & bots</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Setup Steps</h3>
                <ol className="space-y-4">
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00d2ff]/20 text-[#00d2ff] flex items-center justify-center font-bold">1</span>
                    <div>
                      <h4 className="font-semibold text-white">Environment Installation</h4>
                      <p className="text-slate-400 text-sm">Install PostgreSQL with TimescaleDB extension. Create the tick_data database. Install Python dependencies (asyncpg, ib_insync).</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00d2ff]/20 text-[#00d2ff] flex items-center justify-center font-bold">2</span>
                    <div>
                      <h4 className="font-semibold text-white">Database Initialization</h4>
                      <p className="text-slate-400 text-sm">Create tables: tick_data, bot_tick_data, sim_bot_trades, bot_metrics, bot_rankings, variable_weights.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00d2ff]/20 text-[#00d2ff] flex items-center justify-center font-bold">3</span>
                    <div>
                      <h4 className="font-semibold text-white">Bot Configuration</h4>
                      <p className="text-slate-400 text-sm">Create YAML configs in src/bots/ with bot_id, algo_id, ticker, trade_direction, position_size, trailing_stop_pct.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00d2ff]/20 text-[#00d2ff] flex items-center justify-center font-bold">4</span>
                    <div>
                      <h4 className="font-semibold text-white">Bot Registration</h4>
                      <p className="text-slate-400 text-sm">Run initialize_all_bots.py to register bots in the database.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00d2ff]/20 text-[#00d2ff] flex items-center justify-center font-bold">5</span>
                    <div>
                      <h4 className="font-semibold text-white">IB Configuration</h4>
                      <p className="text-slate-400 text-sm">Enable API connections on port 4002 in IB Gateway/TWS settings.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00d2ff]/20 text-[#00d2ff] flex items-center justify-center font-bold">6</span>
                    <div>
                      <h4 className="font-semibold text-white">Run the System</h4>
                      <p className="text-slate-400 text-sm">Start IB Controller, launch bots, monitor via Streamlit dashboard.</p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </section>

          {/* Core Components */}
          <section id="architecture" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Cpu className="w-6 h-6 text-[#00d2ff]" />
              System Architecture
            </h2>

            <div className="space-y-8">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Core Components</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-[#00d2ff] mb-2">IB Controller (IBDataIngestion)</h4>
                    <p className="text-sm text-slate-400">
                      Connects to IB Gateway on port 4002. Subscribes to real-time market data for tickers (TSLA, COIN, NVDA, ARWR, ROOT, JANX, AMZN, FLYW, AAPL, AMD, PYPL).
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#00d2ff] mb-2">Trading Bots (BaseBot)</h4>
                    <p className="text-sm text-slate-400">
                      126 independently configured bots. Each runs via YAML config with algo_id, ticker, position_size, trailing_stop_pct.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#00d2ff] mb-2">Algorithm Modules</h4>
                    <p className="text-sm text-slate-400">
                      8 algorithm types: Momentum, Breakout, Mean Reversion, Minute Momentum, Price Pattern, Support/Resistance, Volatility Breakout, Volume Surge.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#00d2ff] mb-2">Trade Manager</h4>
                    <p className="text-sm text-slate-400">
                      Enforces 10-trade limit. Manages dynamic allocation. Opens/closes trades based on bot rankings.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Performance & Ranking</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-[#00ffa3] mb-2">Bot Ranker (BotRanker)</h4>
                    <p className="text-sm text-slate-400">
                      Calculates weighted scores for all bots based on 25+ metrics. Updates rankings after each trade.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#00ffa3] mb-2">Metrics Calculator</h4>
                    <p className="text-sm text-slate-400">
                      Time-based: one_hour_performance, one_day_performance, one_week_performance. Risk: sharpe_ratio, profit_factor, max_drawdown.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Database Schema */}
          <section id="schema" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Database className="w-6 h-6 text-[#00d2ff]" />
              Database Schema
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Table</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Purpose</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Key Columns</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4 text-[#00d2ff]">tick_data</td>
                    <td className="py-3 px-4">Market data from IB</td>
                    <td className="py-3 px-4">timestamp, ticker, price, volume</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4 text-[#00d2ff]">bot_tick_data</td>
                    <td className="py-3 px-4">Bot-specific tick data</td>
                    <td className="py-3 px-4">bot_id, timestamp, ticker, price</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4 text-[#00d2ff]">sim_bot_trades</td>
                    <td className="py-3 px-4">Trade records</td>
                    <td className="py-3 px-4">trade_id, bot_id, entry_price, exit_price, pnl</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4 text-[#00d2ff]">bot_metrics</td>
                    <td className="py-3 px-4">Performance metrics</td>
                    <td className="py-3 px-4">bot_id, total_pnl, sharpe_ratio, win_rate</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4 text-[#00d2ff]">bot_rankings</td>
                    <td className="py-3 px-4">Bot rankings</td>
                    <td className="py-3 px-4">bot_id, rank_score, rank, is_active</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4 text-[#00d2ff]">variable_weights</td>
                    <td className="py-3 px-4">Ranking weights</td>
                    <td className="py-3 px-4">variable_name, weight, description</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* User Interfaces */}
          <section id="interfaces" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Globe className="w-6 h-6 text-[#00d2ff]" />
              User Interfaces
            </h2>

            <div className="space-y-6">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Streamlit Dashboard</h3>
                <p className="text-slate-400 mb-4">
                  Primary interface with 9 tabs for system control and monitoring.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                  <span className="px-3 py-2 bg-white/5 rounded">1. Controls</span>
                  <span className="px-3 py-2 bg-white/5 rounded">2. Logs</span>
                  <span className="px-3 py-2 bg-white/5 rounded">3. Tables</span>
                  <span className="px-3 py-2 bg-white/5 rounded">4. Trade Data</span>
                  <span className="px-3 py-2 bg-white/5 rounded">5. Parameters</span>
                  <span className="px-3 py-2 bg-white/5 rounded">6. Bot Rankings</span>
                  <span className="px-3 py-2 bg-white/5 rounded">7. Account Info</span>
                  <span className="px-3 py-2 bg-white/5 rounded">8. Data Export</span>
                  <span className="px-3 py-2 bg-white/5 rounded">9. Documentation</span>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Remix Web Frontend</h3>
                <p className="text-slate-400">
                  Secondary Node.js/React frontend for web-based dashboard. Queries PostgreSQL through server-side API layer. Deployable to Google Cloud Run.
                </p>
              </div>
            </div>
          </section>

          {/* Deployment */}
          <section id="deployment" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Settings className="w-6 h-6 text-[#00d2ff]" />
              Deployment
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Local Development</h3>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li>• PostgreSQL on localhost:5432</li>
                  <li>• IB Gateway on port 4002</li>
                  <li>• Streamlit dashboard</li>
                  <li>• Direct asyncpg connections</li>
                </ul>
              </div>
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Cloud (GCP)</h3>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li>• Cloud SQL PostgreSQL</li>
                  <li>• Cloud Run for Remix frontend</li>
                  <li>• Cloud SQL Proxy</li>
                  <li>• GitHub Actions CI/CD</li>
                  <li>• Secret Manager</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Key Constraints */}
          <section id="testing" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <TestTube className="w-6 h-6 text-[#00d2ff]" />
              Key System Constraints
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <span className="text-slate-300">Max Concurrent Trades</span>
                <span className="text-xl font-bold text-[#00d2ff]">10</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <span className="text-slate-300">Trade Allocation</span>
                <span className="text-xl font-bold text-[#00d2ff]">$2,000</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <span className="text-slate-300">Configured Bots</span>
                <span className="text-xl font-bold text-[#00ffa3]">126</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <span className="text-slate-300">Algorithm Types</span>
                <span className="text-xl font-bold text-[#00ffa3]">8</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <span className="text-slate-300">Performance Metrics</span>
                <span className="text-xl font-bold text-[#a78bfa]">25+</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <span className="text-slate-300">Data Retention</span>
                <span className="text-xl font-bold text-[#a78bfa]">30+ days</span>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-wrap gap-4">
              <a
                href="https://github.com/claybowl/Know-Defeat"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-[#00d2ff] hover:bg-[#00d2ff]/20 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View on GitHub
              </a>
              <Link
                href="/platforms/know-defeat"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-colors"
              >
                Back to Platform
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
