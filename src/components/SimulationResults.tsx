import { SimulationResult } from '../types/simulation';
import { formatCurrency, formatNumber } from '../utils/monteCarloSimulation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useEffect } from 'react';
import { CheckCircle2, XCircle, TrendingUp, DollarSign, Users } from 'lucide-react';

interface SimulationResultsProps {
  result: SimulationResult;
}

export function SimulationResults({ result }: SimulationResultsProps) {
  // Console logging for debugging
  useEffect(() => {
    console.log('\n=== 📊 SimulationResults - Result Received ===');
    console.log('Full result object:', result);
    console.log('\n--- Basic Information ---');
    console.log('Total Cost (USD):', formatCurrency(result.totalCost));
    console.log('Duration:', formatNumber(result.duration, 2), 'months');
    console.log('Worker Count:', formatNumber(result.workers, 2), 'workers');
    console.log('Analysis Mode:', result.analysisMode);
    
    console.log('\n--- EMV Calculation ---');
    console.log('Average Safety Cost (EMV):', formatCurrency(result.meanSafetyCost));
    console.log('Standard Deviation:', formatCurrency(result.stdSafetyCost));
    
    if (result.analysisMode !== 1) {
      console.log('\n--- Economic Analysis ---');
      console.log('Cost Reduction:', formatCurrency(result.costReduction || 0));
      console.log('Technology Cost:', formatCurrency(result.techCost || 0));
      console.log('Net Benefit:', formatCurrency(result.netBenefit || 0));
      
      if (result.analysisMode === 2) {
        console.log('\n--- Mode 2 Additional Info ---');
        console.log('Worker Reduction Rate:', result.workerReductionRate, '%');
        console.log('Labor Saving:', formatCurrency(result.laborSaving || 0));
      }
      
      if (result.analysisMode === 3) {
        console.log('\n--- Mode 3 Additional Info ---');
        console.log('Safety Efficiency:', result.safetyEfficiency, '%');
        if (result.calculationDetails) {
          console.log('Wearable Unit Price:', result.calculationDetails.wearableUnitPrice);
          console.log('Application Rate:', result.calculationDetails.wearableApplyRate, '%');
          console.log('Calculated Technology Cost:', formatCurrency(result.techCost || 0));
        }
      }
    }
    
    console.log('=== Result Output Complete ===\n');
  }, [result]);
  
  // Prepare distribution data for histogram
  const histogramData = prepareHistogramData(result.safetyCostDistribution);
  
  return (
    <div className="space-y-8">
      {/* Calculation Details */}
      {result.calculationDetails && (
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 elevation-lg">
          <CardHeader>
            <CardTitle className="text-2xl">📊 Calculation Details</CardTitle>
            <CardDescription className="text-base">Worker count and construction duration calculation process</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white p-6 rounded-xl border-2 border-blue-100 elevation-sm">
              <p className="font-semibold mb-3 text-lg flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center text-sm">🏗️</span>
                Construction Duration Calculation
              </p>
              <div className="space-y-2 text-sm">
                <p>• Total Cost (USD): {formatCurrency(result.calculationDetails.totalCostUSD)}</p>
                <p>• Total Cost (KRW): ₩{Math.round(result.calculationDetails.totalCostKRW).toLocaleString('ko-KR')}</p>
                <p className="text-green-600 font-semibold text-base mt-2">→ Calculated Duration: {formatNumber(result.duration, 2)} months</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border-2 border-blue-100 elevation-sm">
              <p className="font-semibold mb-3 text-lg flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-cyan-500 text-white flex items-center justify-center text-sm">👷</span>
                Worker Count Calculation
              </p>
              <div className="space-y-2 text-sm">
                <p className="font-mono bg-gray-100 p-3 rounded-lg text-sm">N = (0.3 × Total Cost) / (Monthly Wage × Duration)</p>
                <p>• Total Cost: {formatCurrency(result.calculationDetails.totalCostUSD)}</p>
                <p>• Daily Wage: {formatCurrency(result.calculationDetails.dailyWage)}</p>
                <p>• Monthly Wage: {formatCurrency(result.calculationDetails.monthlyWage)} (Daily × 22 days)</p>
                <p>• Duration: {formatNumber(result.duration, 2)} months</p>
                <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                  <p className="font-mono text-xs">
                    = (0.3 × {formatCurrency(result.calculationDetails.totalCostUSD)}) / ({formatCurrency(result.calculationDetails.monthlyWage)} × {formatNumber(result.duration, 2)})
                  </p>
                  <p className="font-mono text-xs mt-1">
                    = {formatCurrency(0.3 * result.calculationDetails.totalCostUSD)} / {formatCurrency(result.calculationDetails.monthlyWage * result.duration)}
                  </p>
                  <p className="text-green-600 font-semibold mt-3 text-base">→ Calculated Workers: {formatNumber(result.workers, 2)} workers</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Summary Statistics */}
      <Card className="elevation-lg border-2">
        <CardHeader>
          <CardTitle className="text-2xl">Simulation Results Summary</CardTitle>
          <CardDescription className="text-base">Monte Carlo Simulation (1000 iterations)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm">Total Cost</p>
              <p className="text-3xl font-semibold">{formatCurrency(result.totalCost)}</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm">Duration</p>
              <p className="text-3xl font-semibold">{formatNumber(result.duration, 1)} <span className="text-lg text-muted-foreground">months</span></p>
            </div>
            
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm">Worker Count</p>
              <p className="text-3xl font-semibold">{formatNumber(result.workers, 1)} <span className="text-lg text-muted-foreground">workers</span></p>
            </div>
            
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm">Fatality Rate</p>
              <p className="text-3xl font-semibold">{formatNumber(result.fatalityRate, 2)}</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm">Expected Fatalities</p>
              <p className="text-3xl font-semibold">{formatNumber(result.potentialDeaths, 4)} <span className="text-lg text-muted-foreground">deaths</span></p>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200">
                <p className="text-muted-foreground text-sm font-medium">Average Safety Cost (EMV)</p>
                <p className="text-4xl font-semibold text-blue-700">{formatCurrency(result.meanSafetyCost)}</p>
              </div>
              
              <div className="space-y-2 p-6 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl border-2 border-gray-200">
                <p className="text-muted-foreground text-sm font-medium">Standard Deviation</p>
                <p className="text-4xl font-semibold text-gray-700">{formatCurrency(result.stdSafetyCost)}</p>
              </div>
            </div>
          </div>
          
          {result.analysisMode !== 1 && (
            <div className="mt-8 pt-8 border-t-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2 p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200">
                  <p className="text-muted-foreground text-sm font-medium">Cost Reduction</p>
                  <p className="text-3xl font-semibold text-emerald-600">{formatCurrency(result.costReduction || 0)}</p>
                </div>
                
                <div className="space-y-2 p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200">
                  <p className="text-muted-foreground text-sm font-medium">Technology Cost</p>
                  <p className="text-3xl font-semibold text-orange-600">{formatCurrency(result.techCost || 0)}</p>
                </div>
                
                <div className="space-y-2 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                  <p className="text-muted-foreground text-sm font-medium">Net Benefit</p>
                  <p className={`text-3xl font-semibold ${(result.netBenefit || 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {formatCurrency(result.netBenefit || 0)}
                  </p>
                  {(result.netBenefit || 0) >= 0 ? (
                    <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">Economically Feasible</Badge>
                  ) : (
                    <Badge variant="destructive">Not Economically Feasible</Badge>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Mode 1 Investment Recommendation Box */}
          {result.analysisMode === 1 && result.calculationDetails && (
            <div className="mt-8 pt-8 border-t-2">
              <InvestmentRecommendation result={result} />
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Distribution Chart */}
      <Card className="elevation-lg border-2">
        <CardHeader>
          <CardTitle className="text-2xl">Safety Cost Distribution</CardTitle>
          <CardDescription className="text-base">Monte Carlo Simulation Result Histogram</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={histogramData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="range" 
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 11 }}
                interval={0}
              />
              <YAxis />
              <Tooltip 
                formatter={(value, name, props) => {
                  if (name === 'Frequency') {
                    return [`${value} times`, 'Frequency'];
                  }
                  return [value, name];
                }}
                labelFormatter={(label) => `Accident Cost: ${label}`}
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: '2px solid #3b82f6',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Bar dataKey="frequency" fill="url(#colorGradient)" name="Frequency" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.8} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* Mode 2 Table */}
      {result.analysisMode === 2 && result.reductionTable && (
        <Card className="elevation-lg border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Worker Reduction Rate Analysis</CardTitle>
            <CardDescription className="text-base">Effect of Labor Reduction Equipment Introduction</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reduction Rate (%)</TableHead>
                  <TableHead>Accident Cost Reduction</TableHead>
                  <TableHead>Labor Saving Benefit</TableHead>
                  <TableHead>Monthly Fee ($)</TableHead>
                  <TableHead>Net Benefit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.reductionTable.map((row) => (
                  <TableRow key={row.reductionRate}>
                    <TableCell>{row.reductionRate}%</TableCell>
                    <TableCell className="text-green-600">{formatCurrency(row.costReduction)}</TableCell>
                    <TableCell className="text-blue-600">{formatCurrency(row.laborSaving)}</TableCell>
                    <TableCell className="text-orange-600">{formatCurrency(row.techCost)}</TableCell>
                    <TableCell className={row.netBenefit >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(row.netBenefit)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="mt-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={result.reductionTable} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="reductionRate" 
                    label={{ value: 'Reduction Rate (%)', position: 'insideBottom', offset: -10 }} 
                    padding={{ left: 30, right: 30 }}
                  />
                  <YAxis 
                    tickFormatter={(value) => {
                      const absValue = Math.abs(value);
                      if (absValue >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
                      if (absValue >= 1e3) return `${(value / 1e3).toFixed(0)}K`;
                      return value.toFixed(0);
                    }}
                  />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Line type="monotone" dataKey="costReduction" stroke="#10b981" name="Accident Cost Reduction" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="laborSaving" stroke="#3b82f6" name="Labor Saving Benefit" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="netBenefit" stroke="#8b5cf6" name="Net Benefit" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Mode 3 Table */}
      {result.analysisMode === 3 && result.efficiencyTable && (
        <Card className="elevation-lg border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Safety Efficiency Analysis</CardTitle>
            <CardDescription className="text-base">Effect of Safety Efficiency Improvement Equipment Introduction</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Safety Efficiency (%)</TableHead>
                  <TableHead>Accident Cost Reduction</TableHead>
                  <TableHead>Technology Cost</TableHead>
                  <TableHead>Net Benefit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.efficiencyTable.map((row) => (
                  <TableRow key={row.efficiency}>
                    <TableCell>{row.efficiency}%</TableCell>
                    <TableCell className="text-green-600">{formatCurrency(row.costReduction)}</TableCell>
                    <TableCell className="text-orange-600">{formatCurrency(row.techCost)}</TableCell>
                    <TableCell className={row.netBenefit >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(row.netBenefit)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="mt-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={result.efficiencyTable}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="efficiency" label={{ value: 'Safety Efficiency (%)', position: 'insideBottom', offset: -5 }} />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Line type="monotone" dataKey="costReduction" stroke="#10b981" name="Cost Reduction" strokeWidth={2} />
                  <Line type="monotone" dataKey="netBenefit" stroke="#3b82f6" name="Net Benefit" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {/* Optimal Workforce Recommendation for Mode 3 */}
            <OptimalWorkforceRecommendation result={result} />
          </CardContent>
        </Card>
      )}
      
      {/* Privacy Notice */}
      <Card className="border-2 border-gray-200 bg-gray-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🔒</span>
            </div>
            <div>
              <h3 className="text-lg mb-2 font-semibold">Privacy & Data Security</h3>
              <p className="text-gray-700">
                All user inputs are not stored and are immediately discarded after calculation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Investment Recommendation Component for Mode 1
function InvestmentRecommendation({ result }: { result: SimulationResult }) {
  // Calculate if investment is economically viable
  const efficiency = (result.calculationDetails as any)?.technologyEfficiency || 0;
  const investmentRatio = (result.calculationDetails as any)?.investmentRatio || 0;
  const investmentCost = result.totalCost * (investmentRatio / 100);
  const expectedSavings = result.meanSafetyCost * (efficiency / 100);
  const netBenefit = expectedSavings - investmentCost;
  const isViable = netBenefit >= 0;
  
  return (
    <div className={`p-8 rounded-2xl border-2 ${isViable ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300' : 'bg-gradient-to-br from-red-50 to-orange-50 border-red-300'}`}>
      <div className="flex items-start gap-4">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 ${isViable ? 'bg-green-500' : 'bg-red-500'}`}>
          {isViable ? (
            <CheckCircle2 className="size-10 text-white" />
          ) : (
            <XCircle className="size-10 text-white" />
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="text-2xl mb-4">Investment Recommendation</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                <p className="text-sm text-muted-foreground mb-1">Technology Efficiency</p>
                <p className="text-2xl font-semibold text-blue-600">{efficiency.toFixed(2)}%</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                <p className="text-sm text-muted-foreground mb-1">Investment Ratio</p>
                <p className="text-2xl font-semibold text-orange-600">{investmentRatio.toFixed(3)}%</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                <p className="text-sm text-muted-foreground mb-1">Investment Cost</p>
                <p className="text-2xl font-semibold text-purple-600">{formatCurrency(investmentCost)}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="size-4 text-green-600" />
                  <p className="text-sm text-muted-foreground">Expected Savings</p>
                </div>
                <p className="text-2xl font-semibold text-green-600">{formatCurrency(expectedSavings)}</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="size-4 text-emerald-600" />
                  <p className="text-sm text-muted-foreground">Net Benefit</p>
                </div>
                <p className={`text-2xl font-semibold ${isViable ? 'text-emerald-600' : 'text-red-600'}`}>
                  {formatCurrency(netBenefit)}
                </p>
              </div>
            </div>
            
            <div className={`p-6 rounded-xl border-2 ${isViable ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-400'}`}>
              <p className={`text-lg ${isViable ? 'text-green-900' : 'text-red-900'}`}>
                {isViable ? (
                  <>
                    <strong>✅ Based on the current Total Cost and Efficiency settings, this technology investment is economically favorable.</strong>
                    <br />
                    <span className="text-base">The expected accident cost savings ({formatCurrency(expectedSavings)}) exceed the investment cost ({formatCurrency(investmentCost)}), resulting in a positive net benefit of {formatCurrency(netBenefit)}.</span>
                  </>
                ) : (
                  <>
                    <strong>❌ Under these conditions, the investment savings are insufficient compared to the cost.</strong>
                    <br />
                    <span className="text-base">The expected accident cost savings ({formatCurrency(expectedSavings)}) are less than the investment cost ({formatCurrency(investmentCost)}), resulting in a negative net benefit of {formatCurrency(netBenefit)}.</span>
                  </>
                )}
              </p>
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> Use the Break-even Analysis tab to explore how different investment ratios and total costs affect the required efficiency for positive returns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Optimal Workforce Recommendation Component for Mode 3
function OptimalWorkforceRecommendation({ result }: { result: SimulationResult }) {
  // Calculate optimal workforce based on break-even point
  const safetyEfficiency = (result.calculationDetails as any)?.safetyEfficiency || 0;
  const wearableUnitPrice = (result.calculationDetails as any)?.wearableUnitPrice || 0;
  const wearableApplyRate = (result.calculationDetails as any)?.wearableApplyRate || 0;
  const currentWorkers = result.workers;
  const appliedWorkers = Math.round(currentWorkers * (wearableApplyRate / 100));
  
  // Calculate break-even workforce
  // Tech Cost = unitPrice × workers, Cost Reduction = meanSafetyCost × efficiency
  // Break-even: meanSafetyCost × efficiency = unitPrice × workers
  const totalCostReduction = result.meanSafetyCost * (safetyEfficiency / 100);
  const maxRecommendedWorkers = Math.floor(totalCostReduction / wearableUnitPrice);
  
  const isNotViable = maxRecommendedWorkers < 1;
  const isViable = !isNotViable && appliedWorkers <= maxRecommendedWorkers;
  const netBenefit = result.netBenefit || 0;
  
  return (
    <div className={`mt-6 p-8 rounded-2xl border-2 ${isNotViable ? 'bg-gradient-to-br from-red-50 to-pink-50 border-red-300' : isViable ? 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-300' : 'bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-300'}`}>
      <div className="flex items-start gap-4">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 ${isNotViable ? 'bg-red-500' : isViable ? 'bg-blue-500' : 'bg-orange-500'}`}>
          <Users className="size-10 text-white" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-2xl mb-4">Optimal Workforce Analysis</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                <p className="text-sm text-muted-foreground mb-1">Total Workers</p>
                <p className="text-2xl font-semibold text-gray-700">{formatNumber(currentWorkers, 0)}</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                <p className="text-sm text-muted-foreground mb-1">Application Rate</p>
                <p className="text-2xl font-semibold text-blue-600">{wearableApplyRate.toFixed(1)}%</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                <p className="text-sm text-muted-foreground mb-1">Workers Applied</p>
                <p className="text-2xl font-semibold text-cyan-600">{appliedWorkers}</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                <p className="text-sm text-muted-foreground mb-1">Max. Recommended</p>
                <p className="text-2xl font-semibold text-purple-600">{isNotViable ? 'N/A' : maxRecommendedWorkers}</p>
              </div>
            </div>
            
            <div className={`p-6 rounded-xl border-2 ${isNotViable ? 'bg-red-100 border-red-400' : isViable ? 'bg-blue-100 border-blue-400' : 'bg-orange-100 border-orange-400'}`}>
              <p className={`text-lg ${isNotViable ? 'text-red-900' : isViable ? 'text-blue-900' : 'text-orange-900'}`}>
                {isNotViable ? (
                  <>
                    <strong>❌ This wearable technology is not economically viable at the current unit price and efficiency settings.</strong>
                    <br />
                    <span className="text-base">The cost reduction per worker ({formatCurrency(totalCostReduction / currentWorkers)}) is insufficient to justify even a single unit ({formatCurrency(wearableUnitPrice)}). Consider improving efficiency or reducing unit costs. Net benefit: {formatCurrency(netBenefit)}.</span>
                  </>
                ) : isViable ? (
                  <>
                    <strong>✅ Based on economic criteria, the technology should be applied to a maximum of {maxRecommendedWorkers} workers for a viable investment.</strong>
                    <br />
                    <span className="text-base">Current application ({appliedWorkers} workers) is within the recommended range. Net benefit: {formatCurrency(netBenefit)}.</span>
                  </>
                ) : (
                  <>
                    <strong>⚠️ Current application exceeds the economically viable workforce size.</strong>
                    <br />
                    <span className="text-base">To achieve positive returns, reduce application to {maxRecommendedWorkers} workers or fewer. Current application ({appliedWorkers} workers) results in negative net benefit: {formatCurrency(netBenefit)}.</span>
                  </>
                )}
              </p>
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> The maximum recommended workforce is calculated based on the break-even point where cost reduction equals technology investment. Applying to fewer workers increases net benefit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function prepareHistogramData(distribution: number[]): { range: string; frequency: number }[] {
  const numBins = 20;
  const min = Math.min(...distribution);
  const max = Math.max(...distribution);
  const binSize = (max - min) / numBins;
  
  const bins: number[] = new Array(numBins).fill(0);
  
  distribution.forEach(value => {
    const binIndex = Math.min(Math.floor((value - min) / binSize), numBins - 1);
    bins[binIndex]++;
  });
  
  return bins.map((frequency, index) => {
    const rangeStart = min + index * binSize;
    const rangeEnd = rangeStart + binSize;
    // Format as dollar values with K (thousands) suffix for readability
    const formatValue = (val: number) => {
      if (val >= 1000000) {
        return `$${(val / 1000000).toFixed(1)}M`;
      } else if (val >= 1000) {
        return `$${(val / 1000).toFixed(0)}K`;
      } else {
        return `$${val.toFixed(0)}`;
      }
    };
    
    return {
      range: `${formatValue(rangeStart)}-${formatValue(rangeEnd)}`,
      frequency
    };
  });
}