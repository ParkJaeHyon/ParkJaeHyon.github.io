import { SimulationResult } from '../types/simulation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { formatCurrency, formatNumber, delayDaysData, agreementDataKRW, penaltyDataKRW } from '../utils/monteCarloSimulation';
import { EXCHANGE_RATE } from '../utils/constants';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Button } from './ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface MonteCarloDetailsProps {
  result: SimulationResult;
}

export function MonteCarloDetails({ result }: MonteCarloDetailsProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="space-y-6">
      {/* Monte Carlo Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Monte Carlo Simulation Configuration</CardTitle>
          <CardDescription>Simulation settings and sampling methods</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Iteration Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="mb-3">✅ Iteration Structure</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Badge variant="secondary">1000 iterations</Badge>
                <p className="text-muted-foreground">
                  Repeated simulation within <strong>±10% range</strong> of total cost
                </p>
              </div>
              <div className="ml-20 space-y-1">
                <p className="text-muted-foreground">
                  • Minimum: {formatCurrency(result.totalCost * 0.9)}
                </p>
                <p className="text-muted-foreground">
                  • Reference: {formatCurrency(result.totalCost)}
                </p>
                <p className="text-muted-foreground">
                  • Maximum: {formatCurrency(result.totalCost * 1.1)}
                </p>
              </div>
            </div>
          </div>
          
          {/* Distribution Settings */}
          <div>
            <h4 className="mb-3">✅ Distribution Settings (Lognormal Distribution)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Delay Days */}
              <div className="border rounded-lg p-4 bg-gradient-to-br from-green-50 to-emerald-50">
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between p-0 h-auto hover:bg-transparent">
                      <div className="text-left">
                        <h5 className="mb-1">Delay Days</h5>
                        <p className="text-xs text-muted-foreground">Lognormal distribution - {delayDaysData.length} data points</p>
                      </div>
                      <ChevronDown className="size-4 ml-2" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3">
                    <div className="text-xs space-y-2">
                      <div className="font-mono bg-white p-3 rounded border max-h-40 overflow-y-auto">
                        {delayDaysData.map((value, index) => (
                          <div key={index} className="flex justify-between py-1">
                            <span className="text-muted-foreground">#{index + 1}</span>
                            <span className="font-semibold">{value} days</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-muted-foreground pt-2 border-t">
                        Average: {formatNumber(delayDaysData.reduce((a, b) => a + b, 0) / delayDaysData.length, 1)} days<br/>
                        Range: {Math.min(...delayDaysData).toFixed(1)} ~ {Math.max(...delayDaysData).toFixed(1)} days
                      </p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
              
              {/* Agreement Data */}
              <div className="border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-cyan-50">
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between p-0 h-auto hover:bg-transparent">
                      <div className="text-left">
                        <h5 className="mb-1">Agreement Amount</h5>
                        <p className="text-xs text-muted-foreground">Lognormal distribution - {agreementDataKRW.length} data points</p>
                      </div>
                      <ChevronDown className="size-4 ml-2" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3">
                    <div className="text-xs space-y-2">
                      <div className="font-mono bg-white p-3 rounded border max-h-40 overflow-y-auto">
                        {agreementDataKRW.map((value, index) => (
                          <div key={index} className="flex justify-between py-1">
                            <span className="text-muted-foreground">#{index + 1}</span>
                            <span className="font-semibold">₩{(value / 100000000).toFixed(1)}억</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-muted-foreground pt-2 border-t">
                        Average: ₩{(agreementDataKRW.reduce((a, b) => a + b, 0) / agreementDataKRW.length / 100000000).toFixed(1)}억<br/>
                        Range: ₩{(Math.min(...agreementDataKRW) / 100000000).toFixed(1)}억 ~ ₩{(Math.max(...agreementDataKRW) / 100000000).toFixed(1)}억
                      </p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
              
              {/* Penalty Data */}
              <div className="border rounded-lg p-4 bg-gradient-to-br from-orange-50 to-amber-50">
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between p-0 h-auto hover:bg-transparent">
                      <div className="text-left">
                        <h5 className="mb-1">Penalty</h5>
                        <p className="text-xs text-muted-foreground">Lognormal distribution - {penaltyDataKRW.length} data points</p>
                      </div>
                      <ChevronDown className="size-4 ml-2" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3">
                    <div className="text-xs space-y-2">
                      <div className="font-mono bg-white p-3 rounded border max-h-40 overflow-y-auto">
                        {penaltyDataKRW.map((value, index) => (
                          <div key={index} className="flex justify-between py-1">
                            <span className="text-muted-foreground">#{index + 1}</span>
                            <span className="font-semibold">₩{(value / 10000000).toFixed(0)}M</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-muted-foreground pt-2 border-t">
                        Average: ₩{(penaltyDataKRW.reduce((a, b) => a + b, 0) / penaltyDataKRW.length / 10000000).toFixed(0)}M<br/>
                        Range: ₩{(Math.min(...penaltyDataKRW) / 10000000).toFixed(0)}M ~ ₩{(Math.max(...penaltyDataKRW) / 10000000).toFixed(0)}M
                      </p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Calculation Formula */}
      <Card>
        <CardHeader>
          <CardTitle>📌 Accident Cost Calculation Formula</CardTitle>
          <CardDescription>Formula applied to each iteration in the Monte Carlo simulation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50">
              <h5 className="mb-1">1. Delay Cost</h5>
              <div className="font-mono text-sm bg-white p-2 rounded border mt-2">
                DelayCost = DelayDays × (worker_daily_wage + equipment_driver_daily_wage)
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Delay days × (₩154,905 + ₩249,549) = Delay days × ₩404,454
              </p>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50">
              <h5 className="mb-1">2. Potential Deaths</h5>
              <div className="font-mono text-sm bg-white p-2 rounded border mt-2">
                PotentialDeaths = (AccidentRate / 10,000) × (Duration / 12) × Workers
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                = ({formatNumber(result.fatalityRate, 2)} / 10,000) × ({formatNumber(result.duration, 1)} / 12) × {formatNumber(result.workers, 1)}
              </p>
              <p className="text-xs text-muted-foreground">
                = <strong>{formatNumber(result.potentialDeaths, 4)} deaths</strong>
              </p>
            </div>
            
            <div className="border-l-4 border-purple-500 pl-4 py-2 bg-purple-50">
              <h5 className="mb-1">3. Final Accident Cost</h5>
              <div className="font-mono text-sm bg-white p-2 rounded border mt-2">
                Final = (Agreement + Legal + Investigation + DelayCost + Penalty) × PotentialDeaths
              </div>
              <div className="mt-3 space-y-1 text-xs">
                <p className="text-muted-foreground">
                  • Agreement: Lognormal sampling (average approx. ₩200,000,000)
                </p>
                <p className="text-muted-foreground">
                  • Legal: ₩400,000,000 (fixed)
                </p>
                <p className="text-muted-foreground">
                  • Investigation: ₩7,500,000 (fixed)
                </p>
                <p className="text-muted-foreground">
                  • DelayCost: See formula 1 above
                </p>
                <p className="text-muted-foreground">
                  • Penalty: Lognormal sampling (average approx. ₩60,000,000)
                </p>
              </div>
            </div>
            
            <div className="border-l-4 border-orange-500 pl-4 py-2 bg-orange-50">
              <h5 className="mb-1">4. Mean Safety Benefit</h5>
              <div className="font-mono text-sm bg-white p-2 rounded border mt-2">
                MeanSafety = mean(Final) over 1000 iterations
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Average of 1000 simulations = <strong>{formatCurrency(result.meanSafetyCost)}</strong>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Sampling Method */}
      <Card>
        <CardHeader>
          <CardTitle>Sampling Methodology</CardTitle>
          <CardDescription>Lognormal Distribution Sampling</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h5 className="mb-2">Box-Muller Transform</h5>
              <p className="text-sm text-muted-foreground mb-3">
                Mathematical technique for transforming normal distribution → lognormal distribution
              </p>
              <div className="text-xs font-mono bg-white p-3 rounded border space-y-1">
                <div>1. Apply log transformation to raw data</div>
                <div>2. Calculate mean (μ) and standard deviation (σ)</div>
                <div>3. Generate normal distribution sample with Box-Muller</div>
                <div>4. Generate lognormal distribution sample with exp() transformation</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h5 className="mb-2">Total Cost Variation</h5>
                <p className="text-sm text-muted-foreground">
                  Uniform Distribution (±10%)
                </p>
                <div className="text-xs font-mono bg-muted p-2 rounded mt-2">
                  cost_variation = totalCost × (0.9 + random() × 0.2)
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h5 className="mb-2">Number of Iterations</h5>
                <p className="text-sm text-muted-foreground">
                  Ensuring sufficient statistical reliability
                </p>
                <div className="text-xs font-mono bg-muted p-2 rounded mt-2">
                  iterations = 1000
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}