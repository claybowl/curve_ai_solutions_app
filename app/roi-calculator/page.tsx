"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Calculator, TrendingUp, DollarSign, Clock, Users, Zap } from 'lucide-react'

interface ROICalculatorData {
  currentAgents: number
  avgAgentCost: number
  hoursPerAgent: number
  humanHourlyCost: number
  expectedEfficiency: number
  package: 'starter' | 'business' | 'enterprise'
}

export default function ROICalculatorPage() {
  const [data, setData] = useState<ROICalculatorData>({
    currentAgents: 5,
    avgAgentCost: 500,
    hoursPerAgent: 160,
    humanHourlyCost: 25,
    expectedEfficiency: 40,
    package: 'business'
  })

  const packagePrices = {
    starter: 199,
    business: 499,
    enterprise: 999
  }

  const calculateROI = () => {
    const currentMonthlyCost = data.currentAgents * data.avgAgentCost
    const currentHumanCost = data.currentAgents * data.hoursPerAgent * data.humanHourlyCost
    const totalCurrentCost = currentMonthlyCost + (currentHumanCost / 12) // Convert human hours to monthly equivalent

    const hoursSaved = data.currentAgents * data.hoursPerAgent * (data.expectedEfficiency / 100)
    const monthlySavings = hoursSaved * data.humanHourlyCost / 12

    const donjonCost = packagePrices[data.package]
    const netSavings = monthlySavings - donjonCost
    const roi = ((netSavings / donjonCost) * 100).toFixed(1)
    const paybackMonths = Math.ceil(donjonCost / netSavings)

    return {
      currentMonthlyCost,
      monthlySavings,
      donjonCost,
      netSavings,
      roi,
      paybackMonths,
      hoursSaved
    }
  }

  const results = calculateROI()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
            <Calculator className="w-4 h-4 mr-2" />
            Donjon Intelligence
          </Badge>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            ROI Calculator
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Calculate your potential savings with Donjon AiGency Suite
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-2xl text-emerald-400">Current Operations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="currentAgents" className="text-gray-300">Number of AI Agents</Label>
                <Input
                  id="currentAgents"
                  type="number"
                  value={data.currentAgents}
                  onChange={(e) => setData({...data, currentAgents: parseInt(e.target.value) || 0})}
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="avgAgentCost" className="text-gray-300">Average Monthly Cost per Agent ($)</Label>
                <Input
                  id="avgAgentCost"
                  type="number"
                  value={data.avgAgentCost}
                  onChange={(e) => setData({...data, avgAgentCost: parseInt(e.target.value) || 0})}
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="hoursPerAgent" className="text-gray-300">Monthly Hours per Agent</Label>
                <Input
                  id="hoursPerAgent"
                  type="number"
                  value={data.hoursPerAgent}
                  onChange={(e) => setData({...data, hoursPerAgent: parseInt(e.target.value) || 0})}
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="humanHourlyCost" className="text-gray-300">Human Hourly Cost ($)</Label>
                <Input
                  id="humanHourlyCost"
                  type="number"
                  value={data.humanHourlyCost}
                  onChange={(e) => setData({...data, humanHourlyCost: parseInt(e.target.value) || 0})}
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="expectedEfficiency" className="text-gray-300">Expected Efficiency Gain (%)</Label>
                <Input
                  id="expectedEfficiency"
                  type="number"
                  value={data.expectedEfficiency}
                  onChange={(e) => setData({...data, expectedEfficiency: parseInt(e.target.value) || 0})}
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>

              <div>
                <Label className="text-gray-300">Donjon Package</Label>
                <Select value={data.package} onValueChange={(value: any) => setData({...data, package: value})}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="starter">Starter - $199/mo</SelectItem>
                    <SelectItem value="business">Business - $499/mo</SelectItem>
                    <SelectItem value="enterprise">Enterprise - $999/mo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border-emerald-500/30">
              <CardHeader>
                <CardTitle className="text-2xl text-emerald-400 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2" />
                  Your ROI Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Current Monthly Cost</p>
                    <p className="text-2xl font-bold text-red-400">${results.currentMonthlyCost.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Monthly Savings</p>
                    <p className="text-2xl font-bold text-emerald-400">${results.monthlySavings.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Donjon Cost</p>
                    <p className="text-2xl font-bold text-cyan-400">${results.donjonCost}</p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Net Monthly Savings</p>
                    <p className="text-2xl font-bold text-emerald-400">${results.netSavings.toLocaleString()}</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 p-6 rounded-lg border border-emerald-500/30">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-gray-300 mb-2">ROI</p>
                      <p className="text-4xl font-bold text-emerald-400">{results.roi}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-300 mb-2">Payback Period</p>
                      <p className="text-4xl font-bold text-cyan-400">{results.paybackMonths} <span className="text-lg">months</span></p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-xl text-emerald-400">Key Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-emerald-400 mr-3" />
                    <span className="text-gray-300">Save {results.hoursSaved} hours monthly</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-emerald-400 mr-3" />
                    <span className="text-gray-300">${(results.netSavings * 12).toLocaleString()} annual savings</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-emerald-400 mr-3" />
                    <span className="text-gray-300">Scale to {data.package === 'starter' ? '5' : data.package === 'business' ? '8' : '10'}+ agents</span>
                  </div>
                  <div className="flex items-center">
                    <Zap className="w-5 h-5 text-emerald-400 mr-3" />
                    <span className="text-gray-300">{data.expectedEfficiency}% efficiency improvement</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <Card className="bg-gradient-to-r from-emerald-600 to-cyan-600 border-0">
              <CardContent className="p-6 text-center">
                <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Operations?</h3>
                <p className="mb-6 text-emerald-50">
                  Start saving ${results.netSavings.toLocaleString()} per month with Donjon AiGency Suite
                </p>
                <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 font-semibold">
                  Get Started Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-400">
          <p>Donjon Intelligence Systems - ROI Calculator</p>
          <p className="text-sm mt-2">Results are estimates. Actual savings may vary based on implementation.</p>
        </div>
      </div>
    </div>
  )
}