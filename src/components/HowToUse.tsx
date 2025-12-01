import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Calculator, TrendingUp, Users, DollarSign, Percent, Clock, Info } from 'lucide-react';

interface HowToUseProps {
  onBack: () => void;
}

export function HowToUse({ onBack }: HowToUseProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8 md:py-16">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="mb-4 md:mb-6 border-2 hover:bg-white/80"
          >
            <ArrowLeft className="size-4 mr-2" />
            Back to Main
          </Button>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl mb-3 md:mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            How to Use ECOSTAT
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Complete guide to understanding and using the Economic Statistics Analysis Tool
          </p>
        </div>

        {/* Section 1: How It Works */}
        <Card className="mb-6 md:mb-8 border-2 border-blue-100 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl flex items-center gap-2 md:gap-3">
              <Calculator className="size-6 md:size-8 text-blue-600" />
              How It Works
            </CardTitle>
            <CardDescription className="text-base md:text-lg">
              Understanding the calculation methodology
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6">
            <p className="text-base md:text-lg">
              ECOSTAT analyzes economic feasibility based on accident prevention benefits and technology investment costs:
            </p>
            
            {/* Calculation Flow Diagram */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg md:rounded-xl p-4 md:p-8 border-2 border-blue-200">
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">📋</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Analysis Principle</h3>
                    <p className="text-base text-gray-700 leading-relaxed">
                      ECOSTAT fundamentally evaluates the <strong className="text-blue-700">economic benefits derived from preventing fatality accidents</strong> in construction projects. 
                      The system calculates whether the introduction of safety technology is economically justified by comparing the benefits from accident prevention against the investment costs.
                    </p>
                  </div>
                </div>
                
                <div className="border-t-2 border-blue-200 pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                      <Calculator className="size-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">Net Benefit Calculation</h3>
                      <p className="text-base text-gray-700 leading-relaxed mb-4">
                        The economic viability is determined by calculating the <strong className="text-green-700">Net Benefit</strong>, which represents the difference between the cost savings from preventing fatality accidents and the technology investment required:
                      </p>
                      <div className="bg-white rounded-lg p-5 border-2 border-green-200">
                        <p className="font-mono text-lg text-center text-gray-800 mb-3">
                          Net Benefit = <span className="text-green-600 font-semibold">Accident Prevention Benefits</span> - <span className="text-orange-600 font-semibold">Technology Investment Cost</span>
                        </p>
                        <div className="space-y-3 text-sm text-gray-700 mt-4">
                          <div>
                            <p className="font-semibold text-green-700 mb-3">• Accident Prevention Benefits <span className="text-gray-600 font-normal">(assuming prevention of fatality accidents)</span>:</p>
                            <div className="ml-4 space-y-3 text-gray-600">
                              <div>
                                <p className="font-semibold text-gray-800">- Accident Investigation Cost</p>
                                <p className="text-sm ml-2 mt-1"><strong>Reason for Cost:</strong> Expenses required to investigate the cause of an incident and prevent recurrence.</p>
                                <p className="text-sm ml-2"><strong>Examples:</strong> Fees for external investigation agencies, on-site analysis costs.</p>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800">- Legal Cost</p>
                                <p className="text-sm ml-2 mt-1"><strong>Reason for Cost:</strong> Costs incurred during legal responses to an accident.</p>
                                <p className="text-sm ml-2"><strong>Examples:</strong> Attorney fees, legal consultations, costs related to communication with victims' families.</p>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800">- Settlement Cost</p>
                                <p className="text-sm ml-2 mt-1"><strong>Reason for Cost:</strong> Monetary compensation paid during settlement negotiations with victims or their families.</p>
                                <p className="text-sm ml-2"><strong>Examples:</strong> Compensation or settlement payments for fatality or severe injury cases.</p>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800">- Interrupted Construction Cost</p>
                                <p className="text-sm ml-2 mt-1"><strong>Reason for Cost:</strong> Indirect financial losses caused by work stoppage following an accident.</p>
                                <p className="text-sm ml-2"><strong>Examples:</strong> Labor costs, equipment standby costs.</p>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800">- Fine</p>
                                <p className="text-sm ml-2 mt-1"><strong>Reason for Cost:</strong> Legal penalties imposed under laws such as the Serious Accident Punishment Act when a fatal accident occurs.</p>
                                <p className="text-sm ml-2"><strong>Examples:</strong> Per-fatality fines.</p>
                              </div>
                            </div>
                          </div>
                          <p>• <strong>Technology Investment Cost:</strong> Initial investment or subscription fees for safety technology</p>
                          <p>• <strong>Economic Decision:</strong> Technology adoption is recommended when Net Benefit ≥ 0</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
              <p className="text-lg">
                <strong>Monte Carlo Simulation</strong> is used to calculate Accident Prevention Benefits by accounting for uncertainty in accident costs related to downtime, settlements, and fines.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Workflow */}
        <Card className="mb-8 border-2 border-green-100 shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-3">
              <TrendingUp className="size-8 text-green-600" />
              Analysis Workflow
            </CardTitle>
            <CardDescription className="text-lg">
              3-step process to complete your analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg">
                    <span className="text-xl">1</span>
                  </div>
                  <h3 className="text-2xl">Select Project Type</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Choose your construction project category:
                </p>
                <ul className="space-y-2 text-base text-gray-700">
                  <li>✓ Railway</li>
                  <li>✓ Building</li>
                  <li>✓ Road Pavement</li>
                  <li>✓ Agricultural Water</li>
                  <li>✓ Water Supply</li>
                  <li>✓ Sewage</li>
                </ul>
              </div>

              {/* Step 2 */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white shadow-lg">
                    <span className="text-xl">2</span>
                  </div>
                  <h3 className="text-2xl">Choose Analysis Mode</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <p className="font-semibold text-green-700">Mode 1: Efficiency Threshold Simulation</p>
                    <p className="text-sm text-gray-600">Explore the minimum efficiency and investment ratio required for economic viability</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <p className="font-semibold text-green-700">Mode 2: Safety Robot Impact Analysis</p>
                    <p className="text-sm text-gray-600">Analyze combined effects of labor reduction and accident prevention from safety robots</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <p className="font-semibold text-green-700">Mode 3: Worker-Level Safety Tech Analysis</p>
                    <p className="text-sm text-gray-600">Simulate economic benefits of deploying personal safety devices based on adoption rate</p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white shadow-lg">
                    <span className="text-xl">3</span>
                  </div>
                  <h3 className="text-2xl">View Results</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Comprehensive analysis including:
                </p>
                <ul className="space-y-2 text-base text-gray-700">
                  <li>✓ Worker Count & Duration Calculation</li>
                  <li>✓ Fatality Prevention Benefits</li>
                  <li>✓ Net Benefit Analysis</li>
                  <li>✓ 3D Break-even Surface (Mode1)</li>
                  <li>✓ Cost Reduction Estimation</li>
                  <li>✓ Labor Offset Simulation (Mode2)</li>
                  <li>✓ Distribution Histograms</li>
                  <li>✓ Feasibility Message</li>
                  <li>✓ Parameter Summary Table</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Input Guide */}
        <Card className="mb-8 border-2 border-purple-100 shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-3">
              <Info className="size-8 text-purple-600" />
              Input Parameters Guide
            </CardTitle>
            <CardDescription className="text-lg">
              Detailed explanation of each input field
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-100 to-cyan-100">
                    <th className="border-2 border-blue-200 p-4 text-left">Parameter</th>
                    <th className="border-2 border-blue-200 p-4 text-left">Description</th>
                    <th className="border-2 border-blue-200 p-4 text-left">Unit</th>
                    <th className="border-2 border-blue-200 p-4 text-left">Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-4">
                      <strong>Total Cost</strong>
                    </td>
                    <td className="border border-gray-300 p-4">
                      Total project construction cost
                    </td>
                    <td className="border border-gray-300 p-4">$ (USD)</td>
                    <td className="border border-gray-300 p-4">$10,000,000</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-4">
                      <strong>Duration</strong>
                    </td>
                    <td className="border border-gray-300 p-4">
                      Project duration in months (Calculated from Total Cost)
                    </td>
                    <td className="border border-gray-300 p-4">Months</td>
                    <td className="border border-gray-300 p-4">24</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-4">
                      <strong>Workforce</strong>
                    </td>
                    <td className="border border-gray-300 p-4">
                      Number of workers on site (Calculated from Total Cost)
                    </td>
                    <td className="border border-gray-300 p-4">People</td>
                    <td className="border border-gray-300 p-4">50</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-4">
                      <strong>Expected Equipment Count</strong>
                    </td>
                    <td className="border border-gray-300 p-4">
                      Average monthly equipment count used throughout the project duration (e.g., dump trucks, drills)
                    </td>
                    <td className="border border-gray-300 p-4">Units</td>
                    <td className="border border-gray-300 p-4">10</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-4">
                      <strong>Efficiency (%)</strong>
                    </td>
                    <td className="border border-gray-300 p-4">
                      How much the technology reduces accident costs (%)
                    </td>
                    <td className="border border-gray-300 p-4">%</td>
                    <td className="border border-gray-300 p-4">20% reduction</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-4">
                      <strong>Investment Ratio (%)</strong>
                    </td>
                    <td className="border border-gray-300 p-4">
                      Percentage of Total Cost allocated to technology investment
                    </td>
                    <td className="border border-gray-300 p-4">% of Total Cost</td>
                    <td className="border border-gray-300 p-4">0.1%</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-4">
                      <strong>Monthly Subscription</strong>
                    </td>
                    <td className="border border-gray-300 p-4">
                      Monthly fee for subscription-based technology
                    </td>
                    <td className="border border-gray-300 p-4">$ per month</td>
                    <td className="border border-gray-300 p-4">$500/month</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-lg">
              <p className="text-sm text-gray-700">
                <strong className="text-yellow-800">Important:</strong> The <strong>Efficiency (%)</strong> and <strong>Investment Ratio (%)</strong> are key variables used to determine economic feasibility as Total Cost varies. These inputs allow the system to simulate break-even scenarios.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <Card className="border-2 border-gray-200 bg-gray-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🔒</span>
              </div>
              <div>
                <h3 className="text-xl mb-2">Privacy & Data Security</h3>
                <p className="text-gray-700">
                  All user inputs are not stored and are immediately discarded after calculation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}