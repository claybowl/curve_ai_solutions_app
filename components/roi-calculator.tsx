"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Calculator, TrendingUp, DollarSign, Clock, Users } from 'lucide-react'

export function ROICalculator() {
  const [inputs, setInputs] = useState({
    teamSize: 5,
    avgHourlyRate: 50,
    hoursSavedPerWeek: 20,
    implementationCost: 5000,
    monthlySubscription: 499
  })

  const [results, setResults] = useState({
    monthlySavings: 0,
    annualSavings: 0,
    annualROI: 0,
    paybackPeriod: 0
  })

  useEffect(() => {
    // Calculate ROI based on inputs
    const weeklySavings = inputs.teamSize * inputs.hoursSavedPerWeek * inputs.avgHourlyRate
    const monthlySavings = weeklySavings * 4.33 // Average weeks per month
    const annualSavings = monthlySavings * 12
    const annualCost = inputs.implementationCost + (inputs.monthlySubscription * 12)
    const netAnnualSavings = annualSavings - annualCost
    const annualROI = (netAnnualSavings / annualCost) * 100
    const paybackPeriod = inputs.implementationCost / monthlySavings

    setResults({
      monthlySavings,
      annualSavings,
      annualROI,
      paybackPeriod
    })
  }, [inputs])

  const handleInputChange = (field: string, value: string) => {
    const numValue = parseInt(value) || 0
    setInputs(prev => ({ ...prev, [field]: numValue }))
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Calculator className="h-6 w-6 text-[#FF7F00]" />
          Donjon AiGency Suite ROI Calculator
        </CardTitle>
        <p className="text-gray-600">
          Calculate your potential savings and ROI with AI automation
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Fields */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="teamSize">Team Size</Label>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />
                <Input
                  id="teamSize"
                  type="number"
                  value={inputs.teamSize}
                  onChange={(e) => handleInputChange('teamSize', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="avgHourlyRate">Average Hourly Rate ($)</Label>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <Input
                  id="avgHourlyRate"
                  type="number"
                  value={inputs.avgHourlyRate}
                  onChange={(e) => handleInputChange('avgHourlyRate', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="hoursSaved">Hours Saved Per Week/Person</Label>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <Input
                  id="hoursSaved"
                  type="number"
                  value={inputs.hoursSavedPerWeek}
                  onChange={(e) => handleInputChange('hoursSavedPerWeek', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="implementationCost">One-time Implementation Cost ($)</Label>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <Input
                  id="implementationCost"
                  type="number"
                  value={inputs.implementationCost}
                  onChange={(e) => handleInputChange('implementationCost', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="monthlySubscription">Monthly Subscription ($)</Label>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <Input
                  id="monthlySubscription"
                  type="number"
                  value={inputs.monthlySubscription}
                  onChange={(e) => handleInputChange('monthlySubscription', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="pt-4">
              <Badge className="bg-[#0076FF] text-white px-3 py-2">
                Donjon AiGency Suite
              </Badge>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Your ROI Results
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-700">
                  ${results.monthlySavings.toLocaleString()}
                </div>
                <p className="text-sm text-green-600">Monthly Savings</p>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-700">
                  {results.annualROI.toFixed(0)}%
                </div>
                <p className="text-sm text-blue-600">Annual ROI</p>
              </CardContent>
            </Card>
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-700">
                  {results.paybackPeriod.toFixed(1)} mo
                </div>
                <p className="text-sm text-purple-600">Payback Period</p>
              </CardContent>
            </Card>
          </div>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Annual Savings:</strong> ${results.annualSavings.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">
              Based on {inputs.teamSize} team members saving {inputs.hoursSavedPerWeek} hours/week at ${inputs.avgHourlyRate}/hour
            </p>
          </div>
        </div>

        <div className="text-center">
          <Button className="bg-[#FF7F00] hover:bg-[#FF7F00]/90 text-white">
            Schedule a Consultation
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}