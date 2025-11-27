import { useMemo, useEffect, useRef } from 'react';
import { SimulationResult } from '../types/simulation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { formatCurrency, formatNumber } from '../utils/monteCarloSimulation';
import { Badge } from './ui/badge';

interface BreakEven3DChartProps {
  result: SimulationResult;
}

export function BreakEven3DChart({ result }: BreakEven3DChartProps) {
  const plotRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!result.breakEven3DData || !plotRef.current) return;
    
    // Dynamically import Plotly
    import('plotly.js-dist-min').then((module) => {
      const Plotly = module.default;
      const { investmentRatios, totalCosts, requiredEfficiencies } = result.breakEven3DData!;
      
      // Transpose the z matrix for correct Plotly surface plot rendering
      // Our data: z[investmentRatioIndex][totalCostIndex]
      // Plotly expects: z[totalCostIndex][investmentRatioIndex]
      const transposedZ = totalCosts.map((_, i) => 
        investmentRatios.map((_, j) => requiredEfficiencies[j][i])
      );
      
      // Create the 3D surface plot
      const trace = {
        type: 'surface',
        x: investmentRatios, // X axis: Investment Ratio (0.01~0.1%)
        y: totalCosts, // Y axis: Total Cost ($)
        z: transposedZ, // Z axis: Required Efficiency (%) - TRANSPOSED!
        colorscale: [
          [0, '#440154'],      // Viridis purple
          [0.25, '#31688e'],   // Viridis blue
          [0.5, '#35b779'],    // Viridis green
          [0.75, '#b5de2b'],   // Viridis yellow-green
          [1, '#fde724']       // Viridis yellow
        ],
        hovertemplate: 
          '<b>Investment Ratio</b>: %{x:.3f}%<br>' +
          '<b>Total Cost</b>: $%{y:,.0f}<br>' +
          '<b>Required Efficiency</b>: %{z:.2f}%<br>' +
          '<extra></extra>'
      };
      
      const layout = {
        title: {
          text: '3D Break-even Surface: Investment vs Cost vs Required Efficiency',
          font: { size: 16 }
        },
        scene: {
          xaxis: {
            title: {
              text: 'Investment Ratio (%)'
            },
            tickformat: '.2f',
            nticks: 8
          },
          yaxis: {
            title: {
              text: 'Total Cost ($)'
            },
            tickformat: '.2e',
            nticks: 8
          },
          zaxis: {
            title: {
              text: 'Required Efficiency (%)'
            },
            tickformat: '.1f',
            nticks: 8,
            range: [0, 100]
          },
          camera: {
            eye: { x: 1.5, y: -1.5, z: 1.2 }
          }
        },
        autosize: true,
        margin: { l: 0, r: 0, b: 0, t: 40 }
      };
      
      const config = {
        responsive: true,
        displayModeBar: true,
        displaylogo: false,
        modeBarButtonsToRemove: ['pan2d', 'select2d', 'lasso2d', 'autoScale2d']
      };
      
      Plotly.newPlot(plotRef.current, [trace as any], layout, config);
    });
    
    return () => {
      if (plotRef.current) {
        import('plotly.js-dist-min').then((module) => {
          const Plotly = module.default;
          Plotly.purge(plotRef.current!);
        });
      }
    };
  }, [result.breakEven3DData]);
  
  if (!result.breakEven3DData) {
    return null;
  }
  
  const { investmentRatios, totalCosts, requiredEfficiencies } = result.breakEven3DData;
  
  return (
    <div className="space-y-6">
      {/* Break-even Formula */}
      <Card>
        <CardHeader>
          <CardTitle>📌 3D Break-even Surface Plot</CardTitle>
          <CardDescription>Relationship between investment ratio, total cost, and required safety efficiency</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Formula */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
            <h4 className="mb-4">Break-even Conditions</h4>
            
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4 py-2 bg-white rounded">
                <p className="text-sm text-muted-foreground mb-2">Basic condition (Net Benefit = 0):</p>
                <div className="font-mono text-sm bg-blue-50 p-3 rounded">
                  Safety Benefit = Investment Cost
                </div>
                <div className="font-mono text-sm bg-blue-50 p-3 rounded mt-2">
                  Mean Safety Cost × Safety Efficiency = Total Cost × Investment Ratio
                </div>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4 py-2 bg-white rounded">
                <p className="text-sm text-muted-foreground mb-2">Reverse calculation formula:</p>
                <div className="font-mono text-sm bg-green-50 p-3 rounded">
                  Required Efficiency (%) = (Total Cost × Investment Ratio) / Mean Safety Cost × 100
                </div>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-4 py-2 bg-white rounded">
                <p className="text-sm text-muted-foreground mb-2">Current average safety benefit:</p>
                <div className="font-mono text-sm bg-orange-50 p-3 rounded">
                  Mean Safety Cost = {formatCurrency(result.meanSafetyCost)}
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm">
                <strong>Interpretation:</strong> As the investment ratio or total cost increases, 
                higher safety efficiency is required to achieve break-even.
              </p>
            </div>
          </div>
          
          {/* Grid Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 bg-blue-50">
              <h5 className="mb-2">X-axis: Investment Ratio</h5>
              <p className="text-sm text-muted-foreground">
                {investmentRatios[0].toFixed(3)}% ~ {investmentRatios[investmentRatios.length - 1].toFixed(3)}%
              </p>
              <div className="text-xs font-mono bg-white p-2 rounded border mt-2">
                {investmentRatios.length} points (0.01% ~ 0.1%)
              </div>
            </div>
            
            <div className="border rounded-lg p-4 bg-green-50">
              <h5 className="mb-2">Y-axis: Total Cost</h5>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(totalCosts[0])} ~ {formatCurrency(totalCosts[totalCosts.length - 1])}
              </p>
              <div className="text-xs font-mono bg-white p-2 rounded border mt-2">
                {totalCosts.length} points (input value ±30%)
              </div>
            </div>
            
            <div className="border rounded-lg p-4 bg-purple-50">
              <h5 className="mb-2">Z-axis: Required Safety Efficiency</h5>
              <p className="text-sm text-muted-foreground">
                Calculated automatically by formula
              </p>
              <div className="text-xs font-mono bg-white p-2 rounded border mt-2">
                Total {investmentRatios.length * totalCosts.length} points
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 3D Plotly Chart */}
      <Card>
        <CardHeader>
          <CardTitle>3D Break-even Surface</CardTitle>
          <CardDescription>
            Rotate and zoom with mouse - surface representing points where net benefit is 0
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div ref={plotRef} style={{ width: '100%', height: '600px' }} />
          
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h5 className="mb-2">Graph Interpretation</h5>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Higher efficiency is required as the color changes from green to red</li>
              <li>• X-axis (investment ratio) increase leads to linear increase in Z-axis (required efficiency)</li>
              <li>• Higher Y (total cost) requires higher efficiency at the same investment ratio</li>
              <li>• The surface represents the critical value where net benefit = 0</li>
            </ul>
          </div>
        </CardContent>
      </Card>
      
      {/* Sample Points Table */}
      <Card>
        <CardHeader>
          <CardTitle>Required Safety Efficiency Points for New Technology at Different Investment Ratios</CardTitle>
          <CardDescription>Required efficiency for key investment ratio and cost combinations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Investment Ratio</th>
                  <th className="text-right p-2">Min Cost</th>
                  <th className="text-right p-2">User Input</th>
                  <th className="text-right p-2">Max Cost</th>
                </tr>
              </thead>
              <tbody>
                {[0, 5, 10, 15, 20].map(idx => {
                  const ratio = investmentRatios[idx];
                  const minCostIdx = 0;
                  const midCostIdx = Math.floor(totalCosts.length / 2);
                  const maxCostIdx = totalCosts.length - 1;
                  
                  return (
                    <tr key={idx} className="border-b hover:bg-muted/50">
                      <td className="p-2 font-medium">{ratio.toFixed(3)}%</td>
                      <td className="text-right p-2">
                        <Badge variant={requiredEfficiencies[idx][minCostIdx] > 100 ? "destructive" : "secondary"}>
                          {requiredEfficiencies[idx][minCostIdx].toFixed(2)}%
                        </Badge>
                      </td>
                      <td className="text-right p-2">
                        <Badge variant={requiredEfficiencies[idx][midCostIdx] > 100 ? "destructive" : "secondary"}>
                          {requiredEfficiencies[idx][midCostIdx].toFixed(2)}%
                        </Badge>
                      </td>
                      <td className="text-right p-2">
                        <Badge variant={requiredEfficiencies[idx][maxCostIdx] > 100 ? "destructive" : "secondary"}>
                          {requiredEfficiencies[idx][maxCostIdx].toFixed(2)}%
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 grid grid-cols-3 gap-4 text-xs">
            <div>
              <strong>Min Cost:</strong> {formatCurrency(totalCosts[0])}
            </div>
            <div>
              <strong>User Input:</strong> {formatCurrency(totalCosts[Math.floor(totalCosts.length / 2)])}
            </div>
            <div>
              <strong>Max Cost:</strong> {formatCurrency(totalCosts[totalCosts.length - 1])}
            </div>
          </div>
          
          <div className="mt-4 flex gap-4 text-xs">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Value</Badge>
              <span className="text-muted-foreground">Achievable (≤100%)</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="destructive">Value</Badge>
              <span className="text-muted-foreground">Unachievable (&gt;100%)</span>
            </div>
          </div>
          
          {/* Analysis Section */}
          <div className="mt-6 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
            <h5 className="mb-4 flex items-center gap-2">
              <span className="text-lg">📊</span>
              <span>Analysis of Required Efficiency by Investment Ratio</span>
            </h5>
            <div className="space-y-4">
              {[0, 5, 10, 15, 20].map(idx => {
                const ratio = investmentRatios[idx];
                const minCostIdx = 0;
                const midCostIdx = Math.floor(totalCosts.length / 2);
                const maxCostIdx = totalCosts.length - 1;
                
                const minEff = requiredEfficiencies[idx][minCostIdx];
                const midEff = requiredEfficiencies[idx][midCostIdx];
                const maxEff = requiredEfficiencies[idx][maxCostIdx];
                
                const minToMidChange = minEff - midEff;
                const minToMaxChange = minEff - maxEff;
                const changePercent = ((minToMaxChange / minEff) * 100);
                
                return (
                  <div key={idx} className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm">
                    <div className="font-medium text-blue-700 mb-2">
                      At investment ratio {ratio.toFixed(3)}%
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      When total cost is {formatCurrency(totalCosts[minCostIdx])}, a safety efficiency of at least <strong className="text-blue-600">{minEff.toFixed(2)}%</strong> is required. 
                      When total cost increases to {formatCurrency(totalCosts[midCostIdx])}, the required efficiency decreases to <strong className="text-green-600">{midEff.toFixed(2)}%</strong>, 
                      and further increases to {formatCurrency(totalCosts[maxCostIdx])} results in a required efficiency of <strong className="text-green-600">{maxEff.toFixed(2)}%</strong>. 
                      The required efficiency decreases by approximately <strong className="text-orange-600">{Math.abs(minToMaxChange).toFixed(2)}%p</strong> ({changePercent > 0 ? '-' : '+'}{Math.abs(changePercent).toFixed(1)}%) as total cost increases.
                    </p>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm text-yellow-800">
                <strong>💡 Insight:</strong> The reason why higher safety efficiency is required at the same investment ratio as total cost increases is that 
                the absolute safety benefit scale also increases in larger projects, allowing break-even to be achieved with relatively lower efficiency.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}