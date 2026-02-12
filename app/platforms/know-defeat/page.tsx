import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  BarChart3,
  Bot,
  Brain,
  Check,
  ChevronRight,
  Code2,
  Cpu,
  Database,
  GitBranch,
  Github,
  Globe,
  Layers,
  LineChart,
  Lock,
  Network,
  RefreshCw,
  Server,
  Shield,
  Terminal,
  Timer,
  TrendingUp,
  Zap,
} from "lucide-react"

export const metadata = {
  title: "Know-Defeat Algorithmic Trading System | Donjon Intelligence",
  description: "Probability-driven execution for precision trading with 100+ algorithmic bots and dynamic fund allocation.",
}

export default function KnowDefeatPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-50 selection:bg-sky-500/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/20 via-slate-900/0 to-slate-900/0" />
        <div className="container max-w-6xl mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center space-y-8">
            <Badge variant="outline" className="border-sky-500/30 text-sky-400 bg-sky-500/10 px-4 py-1 mb-4">
              <Terminal className="w-3 h-3 mr-2" />
              Algorithmic Trading System
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
              Know-Defeat
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 max-w-3xl font-light">
              Probability-driven execution for precision trading. Empower your portfolio with 
              <span className="text-sky-400 font-medium"> 100+ algorithmic bots</span>, 
              dynamic fund allocation, and real-time market analysis.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="bg-sky-500 hover:bg-sky-600 text-white border-0">
                <Link href="/consultation">
                  Schedule Consultation
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-slate-700 hover:bg-slate-800 text-slate-300">
                <Link href="https://github.com/claybowl/Know-Defeat" target="_blank">
                  <Github className="mr-2 w-4 h-4" />
                  View on GitHub
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-white/5 bg-white/5 backdrop-blur-sm">
        <div className="container max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Trading Bots", value: "100+", icon: Bot },
              { label: "Strategy Types", value: "6", icon: Layers },
              { label: "Data Processing", value: "Tick-Level", icon: Database },
              { label: "Execution", value: "Real-Time", icon: Zap },
            ].map((stat, index) => (
              <div key={index} className="flex flex-col items-center text-center space-y-2">
                <div className="p-3 rounded-full bg-sky-500/10 text-sky-400 mb-2">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-slate-400 uppercase tracking-wider font-mono">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-24 relative">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-4">Core Capabilities</h2>
            <div className="h-1 w-20 bg-sky-500 rounded-full" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Multi-Algorithm Engine",
                desc: "6 sophisticated algorithm types: Momentum, Mean Reversion, Breakout, Support/Resistance, Price Pattern, Volatility Breakout.",
                icon: Cpu,
                color: "text-sky-400"
              },
              {
                title: "Bot Ranking System",
                desc: "Dynamic performance ranking with weighted scoring based on win rate, PnL, Sharpe ratio, and profit factor.",
                icon: TrendingUp,
                color: "text-emerald-400"
              },
              {
                title: "Fund Allocation",
                desc: "Automated capital allocation from $200 to $5,000 per bot based on tiered performance rankings.",
                icon: LineChart,
                color: "text-violet-400"
              },
              {
                title: "Backtesting Framework",
                desc: "Comprehensive historical simulation with tick-level data replay and performance metrics.",
                icon: Timer,
                color: "text-amber-400"
              },
              {
                title: "Risk Management",
                desc: "Advanced drawdown protection, position sizing, and automated risk controls.",
                icon: Shield,
                color: "text-rose-400"
              },
              {
                title: "AI Agent Integration",
                desc: "AgentStack-powered agents: Market Analyzer, Strategy Executor, Risk Manager, Performance Tracker.",
                icon: Brain,
                color: "text-indigo-400"
              }
            ].map((feature, index) => (
              <Card key={index} className="glass-panel border-white/10 bg-slate-900/40 hover:bg-slate-900/60 transition-all duration-300 group">
                <CardHeader>
                  <feature.icon className={`w-10 h-10 ${feature.color} mb-4 group-hover:scale-110 transition-transform`} />
                  <CardTitle className="text-xl text-slate-100">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-400 leading-relaxed">
                    {feature.desc}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-slate-900/30 border-y border-white/5">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">System Architecture</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              A closed-loop autonomous trading system designed for continuous improvement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-sky-500/0 via-sky-500/20 to-sky-500/0 -translate-y-1/2 z-0" />

            {[
              { step: "01", title: "Data Ingestion", desc: "Real-time tick data from Interactive Brokers/Alpaca", icon: Globe },
              { step: "02", title: "Signal Generation", desc: "Multi-algorithm analysis identifies opportunities", icon: ActivityIcon },
              { step: "03", title: "Risk Assessment", desc: "Risk Manager validates against position limits", icon: Lock },
              { step: "04", title: "Order Execution", desc: "Strategy Executor places trades via broker APIs", icon: Zap },
              { step: "05", title: "Performance Tracking", desc: "Metrics calculated and rankings updated", icon: BarChart3 },
              { step: "06", title: "Fund Reallocation", desc: "Capital redistributed based on updated rankings", icon: RefreshCw },
            ].map((item, index) => (
              <div key={index} className="relative z-10 bg-[#030712] p-6 rounded-xl border border-white/10 hover:border-sky-500/30 transition-colors group">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-slate-800 group-hover:bg-sky-900/20 transition-colors">
                    <item.icon className="w-6 h-6 text-sky-400" />
                  </div>
                  <span className="text-4xl font-bold text-slate-800 group-hover:text-slate-700 transition-colors select-none">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-200 mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-24">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/3">
              <h2 className="text-3xl font-bold mb-6">Built for Scale</h2>
              <p className="text-slate-400 mb-8">
                Enterprise-grade infrastructure designed for high-frequency data processing and low-latency execution.
              </p>
              <Button variant="outline" className="border-slate-700 text-slate-300">
                <Code2 className="mr-2 w-4 h-4" />
                View Documentation
              </Button>
            </div>
            
            <div className="md:w-2/3 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { name: "Python / FastAPI", type: "Backend", icon: Terminal },
                { name: "PostgreSQL", type: "Database", icon: Database },
                { name: "TimescaleDB", type: "Time-Series", icon: Timer },
                { name: "Docker", type: "Infrastructure", icon: Layers },
                { name: "Interactive Brokers", type: "Brokerage", icon: Globe },
                { name: "AgentStack", type: "AI Framework", icon: Bot },
              ].map((tech, index) => (
                <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10 flex flex-col items-center text-center hover:bg-white/10 transition-colors">
                  <tech.icon className="w-8 h-8 text-slate-400 mb-3" />
                  <div className="font-medium text-slate-200">{tech.name}</div>
                  <div className="text-xs text-slate-500 mt-1">{tech.type}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="py-24 bg-gradient-to-b from-slate-900/50 to-[#030712]">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 grid grid-cols-2 gap-6">
              {[
                { label: "Win Rate", desc: "Profitable trades %", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
                { label: "Sharpe Ratio", desc: "Risk-adjusted return", color: "bg-sky-500/20 text-sky-400 border-sky-500/30" },
                { label: "Max Drawdown", desc: "Peak-to-trough decline", color: "bg-rose-500/20 text-rose-400 border-rose-500/30" },
                { label: "Profit Factor", desc: "Gross profit / Gross loss", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
              ].map((metric, index) => (
                <div key={index} className={`p-6 rounded-xl border ${metric.color} backdrop-blur-sm`}>
                  <div className="text-lg font-semibold mb-1">{metric.label}</div>
                  <div className="text-xs opacity-80">{metric.desc}</div>
                </div>
              ))}
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold mb-6">Performance Metrics</h2>
              <p className="text-slate-400 mb-6">
                We track every tick, trade, and outcome. Our system continuously optimizes based on four key performance indicators to ensure consistent growth while minimizing risk.
              </p>
              <ul className="space-y-4">
                {[
                  "Real-time equity curve monitoring",
                  "Automated strategy disabling upon drawdown limits",
                  "Volatility-adjusted position sizing",
                  "Cross-strategy correlation analysis"
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-slate-300">
                    <Check className="w-5 h-5 text-sky-500 mr-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Competitive Comparison */}
      <section className="py-24">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Know-Defeat?</h2>
            <p className="text-slate-400">Professional-grade infrastructure vs. retail solutions</p>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[800px] rounded-xl border border-white/10 overflow-hidden">
              <div className="grid grid-cols-3 bg-slate-900/80 p-4 font-semibold text-slate-200 border-b border-white/10">
                <div className="pl-4">Feature</div>
                <div className="text-center text-sky-400">Know-Defeat</div>
                <div className="text-center text-slate-500">Standard Retail Bots</div>
              </div>
              {[
                { feature: "Strategy Complexity", us: "Multi-algorithm + Dynamic Ranking", them: "Single static strategy" },
                { feature: "Data Handling", us: "Tick-level Time-Series DB", them: "Standard MT4/MT5 feeds" },
                { feature: "Bot Management", us: "100+ bots with coordinated allocation", them: "Single bot instance" },
                { feature: "Customization", us: "Full algorithm customization", them: "Limited presets" },
                { feature: "Scalability", us: "Enterprise-grade Docker/K8s", them: "Desktop application" },
                { feature: "Transparency", us: "Open Architecture", them: "Proprietary Black Box" },
              ].map((row, index) => (
                <div key={index} className="grid grid-cols-3 p-4 border-b border-white/5 hover:bg-white/5 transition-colors items-center">
                  <div className="pl-4 font-medium text-slate-300">{row.feature}</div>
                  <div className="text-center text-sky-300 bg-sky-500/5 py-1 rounded">{row.us}</div>
                  <div className="text-center text-slate-500">{row.them}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-sky-900/10" />
        <div className="container max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">Ready to Automate Your Trading?</h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Get in touch to learn more about Know-Defeat and how it can transform your trading strategy with institutional-grade technology.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-sky-500 hover:bg-sky-600 text-white h-12 px-8 text-lg">
              <Link href="/consultation">
                Schedule Consultation
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-slate-600 text-slate-200 hover:bg-slate-800 h-12 px-8 text-lg">
              <Link href="https://github.com/claybowl/Know-Defeat" target="_blank">
                <Github className="mr-2 w-5 h-5" />
                View on GitHub
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

function ActivityIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )
}
