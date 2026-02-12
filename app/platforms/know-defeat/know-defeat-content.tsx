"use client"

import { useEffect, useRef, useState } from "react"
import styles from "./know-defeat.module.css"
import { Inter, JetBrains_Mono } from "next/font/google"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ArrowRight, BarChart3, Bot, Brain, Check, Code2, Cpu, Database,
  Github, Globe, Layers, LineChart, Lock, RefreshCw, Server, Shield,
  Terminal, Timer, TrendingUp, Zap,
} from "lucide-react"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" })

export function KnowDefeatContent() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set())
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.left = e.clientX + "px"
        glowRef.current.style.top = e.clientY + "px"
      }
    }
    window.addEventListener("mousemove", handleMouseMove)

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = 0, height = 0, animationFrameId: number

    const resize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener("resize", resize)
    resize()

    class Candle {
      x: number; y: number; h: number; w: number; color: string; speed: number
      constructor(x: number) {
        this.x = x
        this.y = Math.random() * height
        this.h = Math.random() * 100 + 20
        this.w = 4
        this.color = Math.random() > 0.5 ? "#00ffa3" : "#ff4d4d"
        this.speed = Math.random() * 0.5 + 0.2
      }
      draw() {
        if (!ctx) return
        ctx.strokeStyle = this.color
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(this.x + this.w/2, this.y - 10)
        ctx.lineTo(this.x + this.w/2, this.y + this.h + 10)
        ctx.stroke()
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.w, this.h)
      }
      update() {
        this.x -= this.speed
        if (this.x < -20) this.x = width + 20
      }
    }

    const candles = Array.from({ length: 40 }, (_, i) => new Candle(Math.random() * width))

    const animate = () => {
      ctx.clearRect(0, 0, width, height)
      candles.forEach((c) => { c.update(); c.draw() })
      animationFrameId = requestAnimationFrame(animate)
    }
    animate()

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"))
            setVisibleCards((prev) => new Set([...prev, index]))
          }
        })
      },
      { threshold: 0.1 }
    )

    cardsRef.current.forEach((card) => { if (card) observer.observe(card) })

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationFrameId)
      observer.disconnect()
    }
  }, [])

  const isCardVisible = (index: number) => visibleCards.has(index)

  return (
    <div className={cn(styles.container, inter.className, jetbrains.variable)}>
      <div className={styles.marketGrid}></div>
      <canvas ref={canvasRef} className={styles.candlestickBackground}></canvas>
      <div ref={glowRef} className={styles.glowFollow}></div>

      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#00d2ff]/10 via-[#030508]/0 to-[#030508]/0" />
        <div className="container max-w-6xl mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center space-y-8">
            <div className={cn("inline-flex items-center gap-2 px-4 py-2 rounded border-l-2", styles.tagline)}>
              <Terminal className="w-4 h-4" />
              ALGORITHMIC TRADING SYSTEM v4.0
            </div>
            <h1 className={styles.title}>Know-Defeat</h1>
            <p className={styles.description}>
              A collaboration between <strong>Jordan Pack</strong> and <strong>Clayton Christian</strong>. Probability-driven execution for precision trading. Empower your portfolio with <strong>100+ algorithmic bots</strong>, dynamic fund allocation, and real-time market analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="bg-[#00d2ff] hover:bg-[#00d2ff]/90 text-black font-bold">
                <Link href="/consultation">
                  Schedule Consultation
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/10 hover:border-[#00d2ff]/50 hover:bg-[#00d2ff]/5">
                <Link href="https://github.com/claybowl/Know-Defeat" target="_blank">
                  <Github className="mr-2 w-4 h-4" />
                  View on GitHub
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <div className={styles.candleDecor}>
          <div className={styles.candle}></div>
          <div className={cn(styles.candle, styles.candleRed)}></div>
          <div className={styles.candle}></div>
        </div>
      </section>

      <section className={styles.statsBar}>
        <div className={cn(styles.statCard, "group")}>
          <Bot className="w-8 h-8 text-[#00d2ff] mb-4" />
          <span className={styles.statValue}>100+</span>
          <span className={styles.statLabel}>Trading Bots</span>
          <div className={styles.sparkline}></div>
        </div>
        <div className={cn(styles.statCard, "group")}>
          <Layers className="w-8 h-8 text-[#00d2ff] mb-4" />
          <span className={styles.statValue}>6</span>
          <span className={styles.statLabel}>Strategy Types</span>
          <div className={styles.sparkline}></div>
        </div>
        <div className={cn(styles.statCard, "group")}>
          <Database className="w-8 h-8 text-[#00d2ff] mb-4" />
          <span className={styles.statValue}>Tick</span>
          <span className={styles.statLabel}>Data Processing</span>
          <div className={styles.sparkline}></div>
        </div>
        <div className={cn(styles.statCard, "group")}>
          <Zap className="w-8 h-8 text-[#00d2ff] mb-4" />
          <span className={styles.statValue}>2ms</span>
          <span className={styles.statLabel}>Execution Delay</span>
          <div className={styles.sparkline}></div>
        </div>
      </section>

      <section className="py-24 relative">
        <div className="container max-w-6xl mx-auto px-4">
          <div className={cn("mb-16", styles.sectionHeader)}>
            <h2>Core Capabilities</h2>
            <div className={styles.underline}></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Multi-Algorithm Engine", desc: "6 sophisticated algorithm types: Momentum, Mean Reversion, Breakout, Support/Resistance, Price Pattern, Volatility Breakout.", icon: Cpu },
              { title: "Bot Ranking System", desc: "Dynamic performance ranking with weighted scoring based on win rate, PnL, Sharpe ratio, and profit factor.", icon: TrendingUp },
              { title: "Fund Allocation", desc: "Automated capital allocation from $200 to $5,000 per bot based on tiered performance rankings.", icon: LineChart },
              { title: "Backtesting Framework", desc: "Comprehensive historical simulation with tick-level data replay and performance metrics.", icon: Timer },
              { title: "Risk Management", desc: "Advanced drawdown protection, position sizing, and automated risk controls.", icon: Shield },
              { title: "AI Agent Integration", desc: "AgentStack-powered agents: Market Analyzer, Strategy Executor, Risk Manager, Performance Tracker.", icon: Brain },
            ].map((feature, index) => (
              <div key={index} ref={(el) => { cardsRef.current[index] = el }} data-index={index}
                className={cn(styles.card, isCardVisible(index) && styles.cardVisible)}>
                <div className={styles.cardIcon}>
                  <feature.icon className="w-6 h-6 text-[#00d2ff]" />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#0a0d14]/50 border-y border-white/5">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">System Architecture</h2>
            <p className="text-[#94a3b8] max-w-2xl mx-auto">A closed-loop autonomous trading system designed for continuous improvement.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-[#00d2ff]/0 via-[#00d2ff]/20 to-[#00d2ff]/0 -translate-y-1/2 z-0" />
            {[
              { step: "01", title: "Data Ingestion", desc: "Real-time tick data from Interactive Brokers/Alpaca", icon: Globe },
              { step: "02", title: "Signal Generation", desc: "Multi-algorithm analysis identifies opportunities", icon: BarChart3 },
              { step: "03", title: "Risk Assessment", desc: "Risk Manager validates against position limits", icon: Lock },
              { step: "04", title: "Order Execution", desc: "Strategy Executor places trades via broker APIs", icon: Zap },
              { step: "05", title: "Performance Tracking", desc: "Metrics calculated and rankings updated", icon: BarChart3 },
              { step: "06", title: "Fund Reallocation", desc: "Capital redistributed based on updated rankings", icon: RefreshCw },
            ].map((item, index) => (
              <div key={index} ref={(el) => { cardsRef.current[index+6] = el }} data-index={index+6}
                className={cn("relative z-10 p-6 rounded-xl border border-white/10 hover:border-[#00d2ff]/30 transition-colors", styles.card, isCardVisible(index+6) && styles.cardVisible)}>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-[#0a0d14] group-hover:bg-[#00d2ff]/10 transition-colors">
                    <item.icon className="w-6 h-6 text-[#00d2ff]" />
                  </div>
                  <span className="text-4xl font-bold text-[#0a0d14] select-none">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-[#e2e8f0] mb-2">{item.title}</h3>
                <p className="text-[#94a3b8] text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/3">
              <h2 className="text-3xl font-bold mb-6">Built for Scale</h2>
              <p className="text-[#94a3b8] mb-8">Enterprise-grade infrastructure designed for high-frequency data processing and low-latency execution.</p>
              <Button variant="outline" className="border-white/10 hover:border-[#00d2ff]/50 hover:bg-[#00d2ff]/5">
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
                <div key={index} ref={(el) => { cardsRef.current[index+12] = el }} data-index={index+12}
                  className={cn("p-4 rounded-lg bg-white/5 border border-white/10 flex flex-col items-center text-center hover:bg-white/10 transition-colors", styles.card, isCardVisible(index+12) && styles.cardVisible)}>
                  <tech.icon className="w-8 h-8 text-[#94a3b8] mb-3" />
                  <div className="font-medium text-[#e2e8f0]">{tech.name}</div>
                  <div className="text-xs text-[#64748b] mt-1">{tech.type}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-[#0a0d14]/50 to-[#030508] border-y border-white/5">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded border border-[#00ffa3]/30 text-[#00ffa3] bg-[#00ffa3]/10 mb-4">
              <Database className="w-4 h-4" />
              Data Ownership
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">We Own Our Data</h2>
            <p className="text-[#94a3b8] max-w-2xl mx-auto text-lg">
              Unlike retail platforms that rely on third-party feeds, we collect, store, and manage <span className="text-[#00ffa3] font-medium">every tick ourselves</span>. Complete data sovereignty with institutional-grade infrastructure.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-[#e2e8f0] flex items-center gap-3">
                <Server className="w-6 h-6 text-[#00ffa3]" />
                Multi-Tier Database Architecture
              </h3>
              <p className="text-[#94a3b8] leading-relaxed">
                Our data infrastructure handles millions of ticks daily across multiple asset classes. Built on PostgreSQL with TimescaleDB extension for time-series optimization, the system maintains sub-millisecond query performance even with terabytes of historical data.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-[#00ffa3]/5 border border-[#00ffa3]/20">
                  <div className="text-2xl font-bold text-[#00ffa3] mb-1">350GB+</div>
                  <div className="text-sm text-[#94a3b8]">Tick Data Storage (30 days)</div>
                </div>
                <div className="p-4 rounded-lg bg-[#00ffa3]/5 border border-[#00ffa3]/20">
                  <div className="text-2xl font-bold text-[#00ffa3] mb-1">&lt;1ms</div>
                  <div className="text-sm text-[#94a3b8]">Query Response Time</div>
                </div>
                <div className="p-4 rounded-lg bg-[#00ffa3]/5 border border-[#00ffa3]/20">
                  <div className="text-2xl font-bold text-[#00ffa3] mb-1">Multiple</div>
                  <div className="text-sm text-[#94a3b8]">Asset Classes</div>
                </div>
                <div className="p-4 rounded-lg bg-[#00ffa3]/5 border border-[#00ffa3]/20">
                  <div className="text-2xl font-bold text-[#00ffa3] mb-1">24/7</div>
                  <div className="text-sm text-[#94a3b8]">Data Collection</div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-[#e2e8f0] flex items-center gap-3">
                <Shield className="w-6 h-6 text-[#00d2ff]" />
                Complete Data Sovereignty
              </h3>
              <ul className="space-y-4">
                {[
                  { title: "Raw Tick Collection", desc: "We capture every price movement, bid/ask change, and volume update directly from exchanges—no intermediaries, no delays." },
                  { title: "Custom Candle Generation", desc: "Build candles of any timeframe: 1-second, 37-minute, or 4-hour. Our system aggregates raw ticks into any periodicity you need." },
                  { title: "Historical Replay", desc: "Backtest strategies against actual market conditions with tick-perfect precision. Every execution, every spread, every liquidity event preserved." },
                  { title: "No Data Vendor Lock-in", desc: "Your strategies rely on YOUR data. No monthly fees to Bloomberg or Reuters. No API rate limits. Complete independence." }
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="p-1.5 rounded bg-[#00d2ff]/10 text-[#00d2ff] mt-0.5">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium text-[#e2e8f0]">{item.title}</div>
                      <div className="text-sm text-[#94a3b8]">{item.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#0a0d14]/50 p-8">
            <h3 className="text-xl font-bold mb-6 text-center text-[#e2e8f0]">Database Architecture Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#00ffa3] font-semibold mb-2">
                  <Database className="w-5 h-5" />
                  Tick Data Layer
                </div>
                <div className="space-y-2 text-sm">
                  <div className="p-2 rounded bg-white/5 border border-white/10"><span className="text-[#00ffa3]">tick_data</span> - Raw price feeds</div>
                  <div className="p-2 rounded bg-white/5 border border-white/10"><span className="text-[#00ffa3]">ohlcv_1m</span> - 1-minute candles</div>
                  <div className="p-2 rounded bg-white/5 border border-white/10"><span className="text-[#00ffa3]">order_book</span> - L2 market depth</div>
                  <div className="p-2 rounded bg-white/5 border border-white/10"><span className="text-[#00ffa3]">trades</span> - Executed transactions</div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#00d2ff] font-semibold mb-2">
                  <Bot className="w-5 h-5" />
                  Strategy Layer
                </div>
                <div className="space-y-2 text-sm">
                  <div className="p-2 rounded bg-white/5 border border-white/10"><span className="text-[#00d2ff]">bot_metrics</span> - Performance tracking</div>
                  <div className="p-2 rounded bg-white/5 border border-white/10"><span className="text-[#00d2ff]">bot_rankings</span> - Dynamic rankings</div>
                  <div className="p-2 rounded bg-white/5 border border-white/10"><span className="text-[#00d2ff]">sim_bot_trades</span> - Simulated trades</div>
                  <div className="p-2 rounded bg-white/5 border border-white/10"><span className="text-[#00d2ff]">variable_weights</span> - Scoring weights</div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#a78bfa] font-semibold mb-2">
                  <Layers className="w-5 h-5" />
                  Operations Layer
                </div>
                <div className="space-y-2 text-sm">
                  <div className="p-2 rounded bg-white/5 border border-white/10"><span className="text-[#a78bfa]">fund_allocations</span> - Capital distribution</div>
                  <div className="p-2 rounded bg-white/5 border border-white/10"><span className="text-[#a78bfa]">allocation_history</span> - Audit trail</div>
                  <div className="p-2 rounded bg-white/5 border border-white/10"><span className="text-[#a78bfa]">strategy_params</span> - Configurations</div>
                  <div className="p-2 rounded bg-white/5 border border-white/10"><span className="text-[#a78bfa]">execution_logs</span> - Order history</div>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <p className="text-sm text-[#94a3b8]">
                <span className="text-[#00ffa3] font-medium">100+ tables</span> across <span className="text-[#00d2ff] font-medium">12 schema domains</span> managing <span className="text-[#a78bfa] font-medium">millions of records daily</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 grid grid-cols-2 gap-6">
              {[
                { label: "Win Rate", desc: "Profitable trades %", color: "bg-[#00ffa3]/20 text-[#00ffa3] border-[#00ffa3]/30" },
                { label: "Sharpe Ratio", desc: "Risk-adjusted return", color: "bg-[#00d2ff]/20 text-[#00d2ff] border-[#00d2ff]/30" },
                { label: "Max Drawdown", desc: "Peak-to-trough decline", color: "bg-[#ff4d4d]/20 text-[#ff4d4d] border-[#ff4d4d]/30" },
                { label: "Profit Factor", desc: "Gross profit / Gross loss", color: "bg-[#fbbf24]/20 text-[#fbbf24] border-[#fbbf24]/30" },
              ].map((metric, index) => (
                <div key={index} className={cn("p-6 rounded-xl border", metric.color, "backdrop-blur-sm")}>
                  <div className="text-lg font-semibold mb-1">{metric.label}</div>
                  <div className="text-xs opacity-80">{metric.desc}</div>
                </div>
              ))}
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold mb-6">Performance Metrics</h2>
              <p className="text-[#94a3b8] mb-6">
                We track every tick, trade, and outcome. Our system continuously optimizes based on four key performance indicators to ensure consistent growth while minimizing risk.
              </p>
              <ul className="space-y-4">
                {[
                  "Real-time equity curve monitoring",
                  "Automated strategy disabling upon drawdown limits",
                  "Volatility-adjusted position sizing",
                  "Cross-strategy correlation analysis"
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-[#e2e8f0]">
                    <Check className="w-5 h-5 text-[#00d2ff] mr-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Know-Defeat?</h2>
            <p className="text-[#94a3b8]">Professional-grade infrastructure vs. retail solutions</p>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[800px] rounded-xl border border-white/10 overflow-hidden">
              <div className="grid grid-cols-3 bg-[#0a0d14]/80 p-4 font-semibold border-b border-white/10">
                <div className="pl-4">Feature</div>
                <div className="text-center text-[#00d2ff]">Know-Defeat</div>
                <div className="text-center text-[#64748b]">Standard Retail Bots</div>
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
                  <div className="pl-4 font-medium">{row.feature}</div>
                  <div className="text-center text-[#00d2ff] bg-[#00d2ff]/5 py-1 rounded">{row.us}</div>
                  <div className="text-center text-[#64748b]">{row.them}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#00d2ff]/5" />
        <div className="container max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">Ready to Automate Your Trading?</h2>
          <p className="text-xl text-[#94a3b8] mb-10 max-w-2xl mx-auto">
            Get in touch to learn more about Know-Defeat and how it can transform your trading strategy with institutional-grade technology.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-[#00d2ff] hover:bg-[#00d2ff]/90 text-black h-12 px-8 text-lg font-bold">
              <Link href="/consultation">Schedule Consultation</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/10 hover:border-[#00d2ff]/50 hover:bg-[#00d2ff]/5 h-12 px-8 text-lg">
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
