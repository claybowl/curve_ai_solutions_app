"use client"

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  Bot,
  Calendar,
  Phone,
  Clock,
  TrendingUp,
  Zap,
  BarChart3,
  Target,
  Sparkles
} from 'lucide-react';

// Types
interface CalculatorInputs {
  monthlyBookings: number;
  avgJobValue: number;
  schedulingTime: number;
  hourlyRate: number;
  missedCallsPerWeek: number;
  noShowRate: number;
  conversionRate: number;
}

interface ModelAssumptions {
  callToBookingRate: number;
  voicemailCallbackRate: number;
  monthlyLeads: number;
  targetConversionRate: number;
  serviceProCaptureRate: number;
  schedulingTimeReduction: number;
  targetNoShowRate: number;
  conversionLift: number;
  afterHoursBookingRate: number;
}

type Gain = 'timeSavings' | 'callsCaptured' | 'noShowReduction' | 'conversionLift' | 'afterHoursBookings';

interface Product {
  id: string;
  name: string;
  description: string;
  priceOneTime: number;
  priceMonthly: number;
  gains: Gain[];
}

interface ProductCategory {
  name: string;
  description: string;
  selectionType: 'single' | 'multiple';
  products: Product[];
}

interface CalculatedOutputs {
  currentMonthlyRevenue: number;
  laborCostScheduling: number;
  lostBookings: number;
  lostRevenueNoShows: number;
  opportunityCost: number;
  totalCurrentCost: number;
  timeSavingsGain: number;
  callsCapturedGain: number;
  noShowReductionGain: number;
  conversionLiftGain: number;
  afterHoursBookingsGain: number;
  totalMonthlyGain: number;
  monthlyServiceProCost: number;
  oneTimeServiceProCost: number;
  netMonthlyProfit: number;
  roiPercentage: number;
  paybackPeriodDays: number;
  breakEvenBookings: number;
}

// Constants
const INITIAL_INPUTS: CalculatorInputs = {
  monthlyBookings: 50,
  avgJobValue: 200,
  schedulingTime: 4,
  hourlyRate: 50,
  missedCallsPerWeek: 10,
  noShowRate: 15,
  conversionRate: 65,
};

const INITIAL_ASSUMPTIONS: ModelAssumptions = {
  callToBookingRate: 50,
  voicemailCallbackRate: 50,
  monthlyLeads: 100,
  targetConversionRate: 85,
  serviceProCaptureRate: 95,
  schedulingTimeReduction: 75,
  targetNoShowRate: 5,
  conversionLift: 25,
  afterHoursBookingRate: 20,
};

const PRODUCTS_CONFIG: ProductCategory[] = [
  {
    name: 'ServicePro AI Platform',
    description: 'Bundled packages for complete digital transformation.',
    selectionType: 'single',
    products: [
      { id: 'solo', name: 'SOLO Package', description: 'Website, AI chatbot, booking, database, email/SMS, Google integrations.', priceOneTime: 1299, priceMonthly: 29, gains: ['timeSavings', 'callsCaptured', 'noShowReduction', 'conversionLift', 'afterHoursBookings'] },
      { id: 'crew', name: 'CREW Package', description: 'Everything in SOLO + multi-user, unlimited customers, invoicing, payments.', priceOneTime: 2499, priceMonthly: 59, gains: ['timeSavings', 'callsCaptured', 'noShowReduction', 'conversionLift', 'afterHoursBookings'] },
      { id: 'fleet', name: 'FLEET Package', description: 'Everything in CREW + multi-location, route optimization, full CRM, API.', priceOneTime: 3999, priceMonthly: 99, gains: ['timeSavings', 'callsCaptured', 'noShowReduction', 'conversionLift', 'afterHoursBookings'] },
    ]
  },
  {
    name: 'A La Carte Tools',
    description: 'Select individual tools when you only need one piece of the puzzle.',
    selectionType: 'multiple',
    products: [
      { id: 'chatbot', name: 'AI Chatbot', description: '24/7 lead capture, FAQs, warm hand-offs.', priceOneTime: 0, priceMonthly: 49, gains: ['callsCaptured', 'conversionLift', 'afterHoursBookings'] },
      { id: 'booking', name: 'Booking System', description: 'Self-serve scheduling, reminders, calendar sync.', priceOneTime: 0, priceMonthly: 39, gains: ['timeSavings', 'noShowReduction'] },
      { id: 'crm', name: 'Simple CRM', description: 'Pipeline tracking, customer notes, follow-ups.', priceOneTime: 0, priceMonthly: 59, gains: ['conversionLift'] },
      { id: 'analytics', name: 'Analytics Dashboard', description: 'Dashboards for leads, bookings, revenue, and ROI.', priceOneTime: 0, priceMonthly: 29, gains: [] },
    ]
  }
];

const INPUT_CONFIG = [
  { id: 'monthlyBookings', label: 'Monthly Bookings', description: 'Average number of jobs booked per month.', min: 10, max: 375, step: 5 },
  { id: 'avgJobValue', label: 'Avg Job Value', description: 'Average revenue from a single job.', min: 50, max: 1500, step: 10 },
  { id: 'schedulingTime', label: 'Scheduling Time (hrs/wk)', description: 'Hours your team spends on scheduling, reminders, and follow-ups per week.', min: 0, max: 30, step: 1 },
  { id: 'hourlyRate', label: 'Blended Hourly Rate', description: 'Average hourly cost of an employee handling scheduling.', min: 20, max: 115, step: 5 },
  { id: 'missedCallsPerWeek', label: 'Missed Calls Per Week', description: 'Number of potential customer calls that go to voicemail or are missed.', min: 0, max: 75, step: 1 },
  { id: 'noShowRate', label: 'Current No-Show Rate', description: 'Percentage of booked jobs that are no-shows.', min: 0, max: 40, step: 1 },
  { id: 'conversionRate', label: 'Current Conversion Rate', description: 'Percentage of inquiries that turn into booked jobs.', min: 10, max: 100, step: 1 },
];

const ASSUMPTION_CONFIG = [
  { id: 'callToBookingRate', label: 'Call-to-Booking Rate', description: 'Percentage of qualified calls that should result in a booking.', min: 10, max: 100, step: 1 },
  { id: 'voicemailCallbackRate', label: 'Voicemail Callback Rate', description: 'Percentage of missed calls where the customer calls back or you successfully reconnect.', min: 0, max: 100, step: 1 },
  { id: 'serviceProCaptureRate', label: 'ServicePro Capture Rate', description: 'Percentage of missed calls captured and engaged by the AI assistant.', min: 80, max: 100, step: 1 },
  { id: 'monthlyLeads', label: 'Monthly Leads', description: 'Total inquiries used for conversion lift calculation.', min: 20, max: 750, step: 10 },
  { id: 'targetConversionRate', label: 'Target Conversion Rate', description: 'The achievable conversion rate with ServicePro\'s instant engagement.', min: 50, max: 100, step: 1 },
  { id: 'conversionLift', label: 'Conversion Lift', description: 'The percentage increase in booking conversion from instant, 24/7 responses.', min: 5, max: 40, step: 1 },
  { id: 'schedulingTimeReduction', label: 'Scheduling Time Reduction', description: 'Percentage of manual scheduling time automated by ServicePro.', min: 50, max: 100, step: 1 },
  { id: 'targetNoShowRate', label: 'Target No-Show Rate', description: 'The new, lower no-show rate achieved with automated reminders and deposits.', min: 0, max: 15, step: 1 },
  { id: 'afterHoursBookingRate', label: 'After-Hours Booking %', description: 'Percentage of total bookings that could be captured outside of business hours.', min: 5, max: 40, step: 1 },
];

export default function ROICalculatorPage() {
  const [inputs, setInputs] = useState<CalculatorInputs>(INITIAL_INPUTS);
  const [assumptions, setAssumptions] = useState<ModelAssumptions>(INITIAL_ASSUMPTIONS);
  const [selectedIds, setSelectedIds] = useState<string[]>(['crew']);
  const [businessType, setBusinessType] = useState('a small auto detailing shop');
  const [isGenerating, setIsGenerating] = useState(false);

  const results = useMemo<CalculatedOutputs>(() => {
    const { monthlyBookings, avgJobValue, schedulingTime, hourlyRate, missedCallsPerWeek, noShowRate, conversionRate } = inputs;

    const allProducts = PRODUCTS_CONFIG.flatMap(cat => cat.products);
    const selectedProducts = allProducts.filter(p => selectedIds.includes(p.id));

    const activeGains = new Set<Gain>();
    selectedProducts.forEach(p => {
      p.gains.forEach(gain => activeGains.add(gain));
    });

    const monthlyServiceProCost = selectedProducts.reduce((acc, p) => acc + p.priceMonthly, 0);
    const oneTimeServiceProCost = selectedProducts.reduce((acc, p) => acc + p.priceOneTime, 0);
    const amortizedOneTimeCost = oneTimeServiceProCost / 12;
    const totalMonthlyCostForProfitCalc = monthlyServiceProCost + amortizedOneTimeCost;

    const ctbRate = assumptions.callToBookingRate / 100;
    const vcbRate = assumptions.voicemailCallbackRate / 100;
    const tConvRate = assumptions.targetConversionRate / 100;
    const spcRate = assumptions.serviceProCaptureRate / 100;
    const stRed = assumptions.schedulingTimeReduction / 100;
    const tnsRate = assumptions.targetNoShowRate / 100;
    const cLift = assumptions.conversionLift / 100;
    const ahbRate = assumptions.afterHoursBookingRate / 100;

    const currentMonthlyRevenue = monthlyBookings * avgJobValue;
    const laborCostScheduling = (schedulingTime * 4) * hourlyRate;
    const lostBookings = (missedCallsPerWeek * 4) * (1 - vcbRate) * ctbRate * avgJobValue;
    const lostRevenueNoShows = monthlyBookings * (noShowRate / 100) * avgJobValue;
    const opportunityCost = assumptions.monthlyLeads * Math.max(0, tConvRate - (conversionRate / 100)) * avgJobValue;
    const totalCurrentCost = laborCostScheduling + lostBookings + lostRevenueNoShows + opportunityCost;

    const CONSERVATIVE_FACTOR = 0.65;
    const timeSavingsGain = activeGains.has('timeSavings') ? (laborCostScheduling * stRed) * CONSERVATIVE_FACTOR : 0;
    const callsCapturedGain = activeGains.has('callsCaptured') ? ((missedCallsPerWeek * 4 * avgJobValue * ctbRate) * (spcRate - vcbRate)) * CONSERVATIVE_FACTOR : 0;
    const noShowReductionGain = activeGains.has('noShowReduction') ? (monthlyBookings * Math.max(0, ((noShowRate / 100) - tnsRate)) * avgJobValue) * CONSERVATIVE_FACTOR : 0;
    const conversionLiftGain = activeGains.has('conversionLift') ? (assumptions.monthlyLeads * (((conversionRate / 100) * (1 + cLift)) - (conversionRate / 100)) * avgJobValue) * CONSERVATIVE_FACTOR : 0;
    const afterHoursBookingsGain = activeGains.has('afterHoursBookings') ? (monthlyBookings * ahbRate * avgJobValue) * CONSERVATIVE_FACTOR : 0;
    const totalMonthlyGain = timeSavingsGain + callsCapturedGain + noShowReductionGain + conversionLiftGain + afterHoursBookingsGain;

    const netMonthlyProfit = totalMonthlyGain - totalMonthlyCostForProfitCalc;
    const roiPercentage = monthlyServiceProCost > 0 ? ((totalMonthlyGain - monthlyServiceProCost) / monthlyServiceProCost) * 100 : 0;
    const paybackPeriodDays = oneTimeServiceProCost > 0 && totalMonthlyGain > 0 ? oneTimeServiceProCost / (totalMonthlyGain / 30) : 0;
    const breakEvenBookings = avgJobValue > 0 ? (monthlyServiceProCost + oneTimeServiceProCost) / avgJobValue : 0;

    return {
      currentMonthlyRevenue,
      laborCostScheduling,
      lostBookings,
      lostRevenueNoShows,
      opportunityCost,
      totalCurrentCost,
      timeSavingsGain,
      callsCapturedGain,
      noShowReductionGain,
      conversionLiftGain,
      afterHoursBookingsGain,
      totalMonthlyGain,
      monthlyServiceProCost,
      oneTimeServiceProCost,
      netMonthlyProfit,
      roiPercentage,
      paybackPeriodDays,
      breakEvenBookings
    };
  }, [inputs, assumptions, selectedIds]);

  const handleInputChange = (field: keyof CalculatorInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleAssumptionChange = (field: keyof ModelAssumptions, value: number) => {
    setAssumptions(prev => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleGenerateProfile = async () => {
    if (!businessType.trim()) {
      toast.error('Please describe your business first');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-business-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ businessDescription: businessType }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate profile');
      }

      const profile = await response.json();
      
      // Update inputs with AI-generated values
      setInputs({
        monthlyBookings: profile.inputs.monthlyBookings,
        avgJobValue: profile.inputs.avgJobValue,
        schedulingTime: profile.inputs.schedulingTime,
        hourlyRate: profile.inputs.hourlyRate,
        missedCallsPerWeek: profile.inputs.missedCallsPerWeek,
        noShowRate: profile.inputs.noShowRate,
        conversionRate: profile.inputs.conversionRate,
      });

      // Update assumptions with AI-generated values
      setAssumptions({
        callToBookingRate: profile.assumptions.callToBookingRate,
        voicemailCallbackRate: profile.assumptions.voicemailCallbackRate,
        monthlyLeads: profile.assumptions.monthlyLeads,
        targetConversionRate: profile.assumptions.targetConversionRate,
        serviceProCaptureRate: profile.assumptions.serviceProCaptureRate,
        schedulingTimeReduction: profile.assumptions.schedulingTimeReduction,
        targetNoShowRate: profile.assumptions.targetNoShowRate,
        conversionLift: profile.assumptions.conversionLift,
        afterHoursBookingRate: profile.assumptions.afterHoursBookingRate,
      });

      toast.success('Business profile generated successfully!', {
        description: profile.reasoning || 'AI has populated your calculator with realistic values.',
      });
    } catch (error) {
      console.error('Error generating profile:', error);
      toast.error('Failed to generate profile', {
        description: error instanceof Error ? error.message : 'Please try again or manually adjust the values.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-300 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-cyan-400">
            ServicePro ROI Calculator
          </h1>
          <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
            Build a solution to see the real cost of your current system and the immediate impact of automation.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="space-y-6">
            {/* Business Profile */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-xl text-cyan-400 flex items-center">
                  <Bot className="w-5 h-5 mr-2" />
                  Business Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="businessType" className="text-sm text-slate-400">Describe your business</Label>
                  <Input
                    id="businessType"
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="mt-1 bg-slate-700 border-slate-600 text-white"
                    placeholder="e.g., a small auto detailing shop"
                  />
                </div>
                <Button
                  variant="outline"
                  className="w-full border-cyan-600 text-cyan-400 hover:bg-cyan-600 hover:text-white"
                  onClick={handleGenerateProfile}
                  disabled={isGenerating || !businessType.trim()}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating Profile...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Profile (AI)
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Current System Inputs */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-xl text-cyan-400">Current System</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {INPUT_CONFIG.map((config) => {
                  const value = inputs[config.id as keyof CalculatorInputs];
                  return (
                    <div key={config.id}>
                      <div className="flex justify-between items-center mb-2">
                        <Label className="text-sm text-slate-300">{config.label}</Label>
                        <span className="text-cyan-400 font-medium">
                          {config.id.includes('Rate') ? `${value}%` :
                           config.id.includes('JobValue') || config.id.includes('Rate') ? formatCurrency(value) :
                           value}
                        </span>
                      </div>
                      <Slider
                        value={[value]}
                        onValueChange={([newValue]) => handleInputChange(config.id as keyof CalculatorInputs, newValue)}
                        max={config.max}
                        min={config.min}
                        step={config.step}
                        className="mt-2"
                      />
                      <p className="text-xs text-slate-500 mt-1">{config.description}</p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Product Selection */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-xl text-cyan-400">Select Your Solution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {PRODUCTS_CONFIG.map((category) => (
                  <div key={category.name}>
                    <h3 className="text-sm font-medium text-slate-300 mb-2">{category.name}</h3>
                    <p className="text-xs text-slate-500 mb-3">{category.description}</p>
                    <div className="space-y-2">
                      {category.products.map((product) => {
                        const isSelected = selectedIds.includes(product.id);
                        const isPlatformPackage = category.selectionType === 'single';
                        return (
                          <div
                            key={product.id}
                            className={`p-3 rounded-lg border cursor-pointer transition-all ${
                              isSelected
                                ? 'border-cyan-500 bg-cyan-500/10'
                                : 'border-slate-600 hover:border-slate-500 bg-slate-700/50'
                            }`}
                            onClick={() => {
                              if (isPlatformPackage) {
                                setSelectedIds([product.id]);
                              } else {
                                setSelectedIds(prev =>
                                  prev.includes(product.id)
                                    ? prev.filter(id => id !== product.id)
                                    : [...prev, product.id]
                                );
                              }
                            }}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-white">{product.name}</h4>
                                <p className="text-xs text-slate-400 mt-1">{product.description}</p>
                                <div className="flex gap-3 mt-2">
                                  {product.priceOneTime > 0 && (
                                    <span className="text-xs text-cyan-400">{formatCurrency(product.priceOneTime)} one-time</span>
                                  )}
                                  <span className="text-xs text-cyan-400">{formatCurrency(product.priceMonthly)}/mo</span>
                                </div>
                              </div>
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                isSelected ? 'border-cyan-500 bg-cyan-500' : 'border-slate-500'
                              }`}>
                                {isSelected && (
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Model Assumptions */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-xl text-cyan-400 flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Model Assumptions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {ASSUMPTION_CONFIG.map((config) => {
                  const value = assumptions[config.id as keyof ModelAssumptions];
                  return (
                    <div key={config.id}>
                      <div className="flex justify-between items-center mb-2">
                        <Label className="text-sm text-slate-300">{config.label}</Label>
                        <span className="text-cyan-400 font-medium">{value}%</span>
                      </div>
                      <Slider
                        value={[value]}
                        onValueChange={([newValue]) => handleAssumptionChange(config.id as keyof ModelAssumptions, newValue)}
                        max={config.max}
                        min={config.min}
                        step={config.step}
                        className="mt-2"
                      />
                      <p className="text-xs text-slate-500 mt-1">{config.description}</p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {/* ROI Summary */}
            <Card className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border-cyan-500/50">
              <CardHeader>
                <CardTitle className="text-2xl text-cyan-400">ROI Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <p className="text-sm text-slate-400 mb-1">Monthly ROI</p>
                    <p className="text-3xl font-bold text-green-400">{results.roiPercentage.toFixed(0)}%</p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <p className="text-sm text-slate-400 mb-1">Net Monthly Profit</p>
                    <p className="text-3xl font-bold text-emerald-400">{formatCurrency(results.netMonthlyProfit)}</p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <p className="text-sm text-slate-400 mb-1">Payback Period</p>
                    <p className="text-3xl font-bold text-cyan-400">{Math.round(results.paybackPeriodDays)} days</p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <p className="text-sm text-slate-400 mb-1">Break-Even Point</p>
                    <p className="text-3xl font-bold text-purple-400">{Math.round(results.breakEvenBookings)} jobs</p>
                  </div>
                </div>

                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-white mb-3">Investment Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">One-Time Setup:</span>
                      <span className="text-white">{formatCurrency(results.oneTimeServiceProCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Monthly Service:</span>
                      <span className="text-white">{formatCurrency(results.monthlyServiceProCost)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-700">
                      <span className="text-slate-300">Total Monthly Gain:</span>
                      <span className="text-emerald-400 font-bold">{formatCurrency(results.totalMonthlyGain)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current System Costs */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-xl text-red-400">Current System Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Scheduling Labor:</span>
                    <span className="text-red-400">{formatCurrency(results.laborCostScheduling)}/mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Missed Calls (Lost Revenue):</span>
                    <span className="text-red-400">{formatCurrency(results.lostBookings)}/mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">No-Shows:</span>
                    <span className="text-red-400">{formatCurrency(results.lostRevenueNoShows)}/mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Missed Opportunities:</span>
                    <span className="text-red-400">{formatCurrency(results.opportunityCost)}/mo</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-slate-700">
                    <span className="text-white font-medium">Total Monthly Loss:</span>
                    <span className="text-red-400 font-bold text-lg">{formatCurrency(results.totalCurrentCost)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ServicePro Gains */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-xl text-green-400">ServicePro Impact Gains</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.timeSavingsGain > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-400 flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        Time Savings:
                      </span>
                      <span className="text-green-400">{formatCurrency(results.timeSavingsGain)}/mo</span>
                    </div>
                  )}
                  {results.callsCapturedGain > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-400 flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        Calls Captured:
                      </span>
                      <span className="text-green-400">{formatCurrency(results.callsCapturedGain)}/mo</span>
                    </div>
                  )}
                  {results.noShowReductionGain > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-400 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        No-Show Reduction:
                      </span>
                      <span className="text-green-400">{formatCurrency(results.noShowReductionGain)}/mo</span>
                    </div>
                  )}
                  {results.conversionLiftGain > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-400 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Conversion Lift:
                      </span>
                      <span className="text-green-400">{formatCurrency(results.conversionLiftGain)}/mo</span>
                    </div>
                  )}
                  {results.afterHoursBookingsGain > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-400 flex items-center">
                        <Zap className="w-4 h-4 mr-2" />
                        After-Hours Bookings:
                      </span>
                      <span className="text-green-400">{formatCurrency(results.afterHoursBookingsGain)}/mo</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-3 border-t border-slate-700">
                    <span className="text-white font-medium">Total Monthly Gain:</span>
                    <span className="text-green-400 font-bold text-lg">{formatCurrency(results.totalMonthlyGain)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Strategic Analysis */}
            <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600">
              <CardHeader>
                <CardTitle className="text-xl text-cyan-400 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Strategic Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-900/50 p-4 rounded-lg">
                  <p className="text-slate-300 leading-relaxed">
                    Based on your current operations with {inputs.monthlyBookings} monthly bookings at an average value of {formatCurrency(inputs.avgJobValue)},
                    you're losing approximately {formatCurrency(results.totalCurrentCost)} per month due to inefficiencies.
                  </p>
                  <p className="text-slate-300 mt-3 leading-relaxed">
                    With ServicePro's automated scheduling, 24/7 call handling, and intelligent reminders,
                    you could capture an additional {formatCurrency(results.totalMonthlyGain)} in monthly revenue,
                    resulting in a {results.roiPercentage.toFixed(0)}% ROI and payback in just {Math.round(results.paybackPeriodDays)} days.
                  </p>
                  <div className="mt-4 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                    <p className="text-cyan-300 text-sm">
                      <strong>Recommendation:</strong> The {PRODUCTS_CONFIG[0].products.find(p => p.id === selectedIds[0])?.name || 'selected package'}
                      offers the fastest path to positive ROI with comprehensive automation tools.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>

        <footer className="text-center mt-12 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Donjon Systems. All rights reserved.</p>
          <p className="mt-1">Calculations are estimates based on industry benchmarks and provided data.</p>
        </footer>
      </div>
    </div>
  );
}