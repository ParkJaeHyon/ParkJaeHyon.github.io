import { useState, useEffect } from 'react';
import { SimulationParams, ProjectType, AnalysisMode } from '../types/simulation';
import { getProjectConfig } from '../utils/projectConfigs';
import { WORKER_DAILY_WAGE_USD, EQUIPMENT_DRIVER_DAILY_WAGE_USD, LEGAL_COST_USD, INVESTIGATION_COST_USD, EXCHANGE_RATE } from '../utils/constants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Play, Settings } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

interface SimulationInputFormProps {
  projectType: ProjectType;
  analysisMode: AnalysisMode;
  onSimulate: (params: SimulationParams) => void;
  isSimulating: boolean;
}

export function SimulationInputForm({ 
  projectType, 
  analysisMode, 
  onSimulate,
  isSimulating 
}: SimulationInputFormProps) {
  const config = getProjectConfig(projectType);
  
  const [totalCost, setTotalCost] = useState<number>(7285974); // ~$7.3M (≈ 100억원)
  const [specificParams, setSpecificParams] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    config.specificInputs.forEach(input => {
      initial[input.key] = input.defaultValue || 0;
    });
    return initial;
  });
  
  const [equipmentCount, setEquipmentCount] = useState<number>(5);
  const [workerReductionRate, setWorkerReductionRate] = useState<number>(30);
  const [safetyEfficiency, setSafetyEfficiency] = useState<number>(40);
  const [techCost, setTechCost] = useState<number>(10000); // 월 $10,000 (달러)
  
  // Mode 1 specific
  const [technologyEfficiency, setTechnologyEfficiency] = useState<number>(20); // 기술 효율 %
  const [investmentRatio, setInvestmentRatio] = useState<number>(0.05); // 투자 비율 %
  
  // Constants - Fixed values with editable option
  const [workerDailyWage, setWorkerDailyWage] = useState<number>(WORKER_DAILY_WAGE_USD);
  const [equipmentDriverDailyWage, setEquipmentDriverDailyWage] = useState<number>(EQUIPMENT_DRIVER_DAILY_WAGE_USD);
  const [legalCost, setLegalCost] = useState<number>(LEGAL_COST_USD); // Already in USD, no conversion
  const [investigationCost, setInvestigationCost] = useState<number>(INVESTIGATION_COST_USD); // Already in USD, no conversion
  
  const [isConstantsOpen, setIsConstantsOpen] = useState(false);
  
  // Reset specific params when project type changes
  useEffect(() => {
    const initial: Record<string, number> = {};
    config.specificInputs.forEach(input => {
      initial[input.key] = input.defaultValue || 0;
    });
    setSpecificParams(initial);
  }, [projectType]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // User inputs totalCost in USD, pass it directly without conversion
    const params: SimulationParams = {
      projectType,
      analysisMode,
      totalCost: totalCost, // Already in USD
      specificParams,
      equipmentCount,
      workerDailyWage: workerDailyWage, // Already in USD
      equipmentDriverDailyWage: equipmentDriverDailyWage, // Already in USD
      legalCost: legalCost, // Already in USD
      investigationCost: investigationCost, // Already in USD
      iterations: 1000
    };
    
    if (analysisMode === 1) {
      params.technologyEfficiency = technologyEfficiency;
      params.investmentRatio = investmentRatio;
    } else if (analysisMode === 2) {
      params.workerReductionRate = workerReductionRate;
      params.techCost = techCost; // Already in USD
    } else if (analysisMode === 3) {
      params.safetyEfficiency = safetyEfficiency;
      params.wearableUnitPrice = techCost; // Individual device price in USD
      params.wearableApplyRate = workerReductionRate; // Apply rate percentage
    }
    
    onSimulate(params);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Simulation Input Parameters</CardTitle>
        <CardDescription>
          {config.name} - Mode {analysisMode}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Parameters */}
          <div className="space-y-4">
            <h3 className="border-b pb-2">Basic Input Values</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalCost">Total Construction Cost ($) *</Label>
                <Input
                  id="totalCost"
                  type="number"
                  value={totalCost}
                  onChange={(e) => setTotalCost(Number(e.target.value))}
                  min={0}
                  step={1}
                  required
                />
              </div>
              
              {config.specificInputs.map(input => (
                <div key={input.key} className="space-y-2">
                  <Label htmlFor={input.key}>{input.label} *</Label>
                  <Input
                    id={input.key}
                    type={input.type}
                    value={specificParams[input.key] || 0}
                    onChange={(e) => setSpecificParams({
                      ...specificParams,
                      [input.key]: Number(e.target.value)
                    })}
                    min={input.min}
                    step={input.key.includes('Floor') ? 1 : 0.1}
                    required
                  />
                  <p className="text-xs text-muted-foreground">{input.unit}</p>
                </div>
              ))}
              
              <div className="space-y-2">
                <Label htmlFor="equipmentCount">Expected Equipment Count *</Label>
                <Input
                  id="equipmentCount"
                  type="number"
                  value={equipmentCount}
                  onChange={(e) => setEquipmentCount(Number(e.target.value))}
                  min={1}
                  required
                />
                <p className="text-xs text-muted-foreground">Expected number of equipment units</p>
              </div>
            </div>
          </div>
          
          {/* Mode-specific Parameters */}
          {analysisMode === 1 && (
            <div className="space-y-4">
              <h3 className="border-b pb-2">Accident Cost Reduction Technology Settings</h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <h4 className="text-sm mb-2">💡 Mode 1 Economic Calculation Method</h4>
                <div className="text-xs text-gray-700 space-y-2">
                  <p><strong>① Technology Efficiency (%)</strong><br/>
                  The percentage reduction in accident costs achieved by the technology (e.g., 20% means the technology reduces accident costs by 20%).</p>
                  <p><strong>② Investment Ratio (% of Total Cost)</strong><br/>
                  The percentage of total construction cost allocated to technology investment (e.g., 0.05% means 0.05% of total cost is invested in the technology).</p>
                  <p><strong>③ Break-even Analysis</strong><br/>
                  The system will calculate the required efficiency level at various investment ratios and total costs to achieve positive net benefit.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="technologyEfficiency">Technology Efficiency (%) *</Label>
                  <Input
                    id="technologyEfficiency"
                    type="number"
                    value={technologyEfficiency}
                    onChange={(e) => setTechnologyEfficiency(Number(e.target.value))}
                    min={0}
                    max={100}
                    step={0.1}
                    required
                  />
                  <p className="text-xs text-muted-foreground">How much the technology reduces accident costs (0 ~ 100%)</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="investmentRatio">Investment Ratio (% of Total Cost) *</Label>
                  <Input
                    id="investmentRatio"
                    type="number"
                    value={investmentRatio}
                    onChange={(e) => setInvestmentRatio(Number(e.target.value))}
                    min={0}
                    max={10}
                    step={0.01}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Percentage of total cost invested in technology (e.g., 0.05%)</p>
                </div>
              </div>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                <p className="text-xs text-gray-700">
                  <strong>Note:</strong> The above two inputs (Technology Efficiency % and Investment Ratio %) are key variables used to determine economic feasibility as Total Cost varies in the Break-even analysis.
                </p>
              </div>
            </div>
          )}
          
          {analysisMode === 2 && (
            <div className="space-y-4">
              <h3 className="border-b pb-2">Labor-Reducing Equipment Settings</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 className="text-sm mb-2">💡 Mode 2 Economic Calculation Method</h4>
                <div className="text-xs text-gray-700 space-y-2">
                  <p><strong>① Accident Cost Savings (EMV Saving)</strong><br/>
                  Risk exposure decreases according to worker reduction rate (r), calculated as Base_EMV - EMV_with_Tech.</p>
                  <p><strong>② Labor Cost Savings (Labor Saving)</strong><br/>
                  Direct cost reduction calculated as (Existing Workers × Reduction Rate r) × Labor Cost × Construction Period (months).</p>
                  <p><strong>③ Technology Implementation Cost (Tech Cost)</strong><br/>
                  Operating cost calculated as Monthly Usage Fee × Construction Period (months).</p>
                  <p><strong>④ Total Benefit</strong><br/>
                  Total Benefit = EMV Saving + Labor Saving - Tech Cost</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workerReductionRate">Worker Reduction Rate (%) *</Label>
                  <Input
                    id="workerReductionRate"
                    type="number"
                    value={workerReductionRate}
                    onChange={(e) => setWorkerReductionRate(Number(e.target.value))}
                    min={0}
                    max={100}
                    step={1}
                    required
                  />
                  <p className="text-xs text-muted-foreground">0 ~ 100%</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="techCost">Monthly Usage Fee ($) *</Label>
                  <Input
                    id="techCost"
                    type="number"
                    value={techCost}
                    onChange={(e) => setTechCost(Number(e.target.value))}
                    min={0}
                    step={100}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Total cost = Monthly fee × Construction period</p>
                </div>
              </div>
            </div>
          )}
          
          {analysisMode === 3 && (
            <div className="space-y-4">
              <h3 className="border-b pb-2">Wearable Safety Device Settings</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 className="text-sm mb-2">💡 Mode 3 Economic Calculation Method</h4>
                <div className="text-xs text-gray-700 space-y-2">
                  <p><strong>① Accident Cost Savings (EMV Saving)</strong><br/>
                  Base_EMV decreases according to accident prevention efficiency of wearable devices.</p>
                  <p><strong>② Technology Implementation Cost (Tech Cost)</strong><br/>
                  Calculated as Unit Price × Number of Workers × Application Rate.</p>
                  <p className="text-blue-700"><strong>Example:</strong> $500 per unit, 100 workers, 80% application rate → Total cost = $500 × 100 × 0.8 = $40,000</p>
                  <p><strong>③ Net Benefit</strong><br/>
                  Net Benefit = EMV Saving - Tech Cost</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="safetyEfficiency">Accident Prevention Efficiency (%) *</Label>
                  <Input
                    id="safetyEfficiency"
                    type="number"
                    value={safetyEfficiency}
                    onChange={(e) => setSafetyEfficiency(Number(e.target.value))}
                    min={0}
                    max={100}
                    step={1}
                    required
                  />
                  <p className="text-xs text-muted-foreground">0 ~ 100%</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="wearableUnitPrice">Unit Price per Wearable Device ($) *</Label>
                  <Input
                    id="wearableUnitPrice"
                    type="number"
                    value={techCost}
                    onChange={(e) => setTechCost(Number(e.target.value))}
                    min={0}
                    step={10}
                    required
                  />
                  <p className="text-xs text-muted-foreground">e.g., $500</p>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="wearableApplyRate">Worker Application Rate (%) *</Label>
                  <Input
                    id="wearableApplyRate"
                    type="number"
                    value={workerReductionRate}
                    onChange={(e) => setWorkerReductionRate(Number(e.target.value))}
                    min={0}
                    max={100}
                    step={1}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Percentage of total workers to apply devices (0 ~ 100%)</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Constants - Collapsible */}
          <Collapsible open={isConstantsOpen} onOpenChange={setIsConstantsOpen}>
            <div className="space-y-4">
              <CollapsibleTrigger asChild>
                <Button type="button" variant="outline" className="w-full">
                  <Settings className="size-4 mr-2" />
                  Constant Values Settings (Default / Editable)
                  {isConstantsOpen ? ' ▲' : ' ▼'}
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg border">
                  <p className="text-sm text-muted-foreground mb-4">
                    Default system values are set below and can be modified if needed.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="workerDailyWage">Worker Daily Wage ($)</Label>
                      <Input
                        id="workerDailyWage"
                        type="number"
                        value={workerDailyWage.toFixed(2)}
                        onChange={(e) => setWorkerDailyWage(Number(e.target.value))}
                        min={0}
                        step={0.01}
                      />
                      <p className="text-xs text-muted-foreground">Default: $112.88 (₩154,905)</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="equipmentDriverDailyWage">Equipment Operator Daily Wage ($)</Label>
                      <Input
                        id="equipmentDriverDailyWage"
                        type="number"
                        value={equipmentDriverDailyWage.toFixed(2)}
                        onChange={(e) => setEquipmentDriverDailyWage(Number(e.target.value))}
                        min={0}
                        step={0.01}
                      />
                      <p className="text-xs text-muted-foreground">Default: $181.85 (₩249,549)</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="legalCost">Legal Costs ($)</Label>
                      <Input
                        id="legalCost"
                        type="number"
                        value={legalCost}
                        onChange={(e) => setLegalCost(Number(e.target.value))}
                        min={0}
                        step={1}
                      />
                      <p className="text-xs text-muted-foreground">Default: $291,439</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="investigationCost">Safety Investigation Costs ($)</Label>
                      <Input
                        id="investigationCost"
                        type="number"
                        value={investigationCost}
                        onChange={(e) => setInvestigationCost(Number(e.target.value))}
                        min={0}
                        step={1}
                      />
                      <p className="text-xs text-muted-foreground">Default: $36,430</p>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
          
          {/* Privacy Notice */}
          <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
            <div className="flex justify-center items-center gap-3">
              <span className="text-xl flex-shrink-0">🔒</span>
              <div>
                <p className="text-gray-700 text-center">
                  All user inputs are not stored and are immediately discarded after calculation.
                </p>
              </div>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            size="lg"
            disabled={isSimulating}
          >
            <Play className="size-5 mr-2" />
            {isSimulating ? 'Running Simulation...' : 'Run Monte Carlo Simulation'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}