import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Info } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

export function SystemInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="size-5" />
          System Information and Calculation Methods
        </CardTitle>
        <CardDescription>
          Key calculation logic for smart construction technology economic evaluation system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="calculation">
            <AccordionTrigger>Calculation Process</AccordionTrigger>
            <AccordionContent className="space-y-3">
              <div>
                <p className="mb-2"><strong>1. Construction Period Calculation</strong></p>
                <p className="text-sm text-muted-foreground">
                  Calculates construction period from total cost and project characteristics using specialized log-based formulas for each project type.
                </p>
              </div>
              
              <div>
                <p className="mb-2"><strong>2. Number of Workers Calculation</strong></p>
                <p className="text-sm text-muted-foreground">
                  N = (0.3 × Total Cost) / (Monthly Average Salary × Construction Period)
                </p>
              </div>
              
              <div>
                <p className="mb-2"><strong>3. Automatic Fatality Rate Matching</strong></p>
                <p className="text-sm text-muted-foreground">
                  Fatality rate per 10,000 workers is automatically applied based on the number of workers:
                </p>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1 ml-4">
                  <li>• Less than 5: 7.45</li>
                  <li>• 5-9: 3.74</li>
                  <li>• 10-29: 2.87</li>
                  <li>• 30-49: 2.31</li>
                  <li>• 50-99: 2.20</li>
                  <li>• 100-299: 1.56</li>
                  <li>• 300-499: 1.02</li>
                  <li>• 500-999: 0.78</li>
                  <li>• 1000 or more: 0.46</li>
                </ul>
              </div>
              
              <div>
                <p className="mb-2"><strong>4. Expected Fatalities Calculation</strong></p>
                <p className="text-sm text-muted-foreground">
                  Expected Fatalities = (Fatality Rate / 10,000) × (Construction Period / 12) × Number of Workers
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="mcs">
            <AccordionTrigger>Monte Carlo Simulation</AccordionTrigger>
            <AccordionContent className="space-y-3">
              <div>
                <p className="mb-2"><strong>1000 Iteration Simulation</strong></p>
                <p className="text-sm text-muted-foreground">
                  Performs 1000 simulations with random sampling within ±10% of total construction cost.
                </p>
              </div>
              
              <div>
                <p className="mb-2"><strong>Log-Normal Distribution Sampling</strong></p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Delay Days</li>
                  <li>• Agreement Amount</li>
                  <li>• Penalty</li>
                </ul>
              </div>
              
              <div>
                <p className="mb-2"><strong>Accident Cost Formula</strong></p>
                <p className="text-sm text-muted-foreground">
                  Accident Cost = (Agreement Amount + Legal Costs + Safety Investigation Costs + Delay Costs + Penalty) × Expected Fatalities
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Delay Cost = Delay Days × (Worker Daily Wage + Equipment Operator Daily Wage)
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="modes">
            <AccordionTrigger>3 Analysis Modes</AccordionTrigger>
            <AccordionContent className="space-y-3">
              <div>
                <p className="mb-2"><strong>Mode 1: Total Cost-Based Analysis</strong></p>
                <p className="text-sm text-muted-foreground">
                  Visualizes required safety efficiency by investment ratio through average safety cost (EMV) and break-even analysis in 3D graph.
                </p>
              </div>
              
              <div>
                <p className="mb-2"><strong>Mode 2: Labor-Reducing Equipment Analysis</strong></p>
                <p className="text-sm text-muted-foreground">
                  Calculates accident cost reduction and net benefit based on worker reduction rate (%).
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Net Benefit = (Average Safety Cost × Reduction Rate) - Technology Implementation Cost
                </p>
              </div>
              
              <div>
                <p className="mb-2"><strong>Mode 3: Safety Efficiency Enhancement Equipment Analysis</strong></p>
                <p className="text-sm text-muted-foreground">
                  Calculates cost reduction and net benefit based on accident prevention efficiency (%).
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Net Benefit = (Average Safety Cost × Efficiency) - Technology Implementation Cost
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="breakeven">
            <AccordionTrigger>Break-even Analysis</AccordionTrigger>
            <AccordionContent className="space-y-3">
              <div>
                <p className="mb-2"><strong>Break-even Efficiency Calculation</strong></p>
                <p className="text-sm text-muted-foreground">
                  Investment Ratio × Total Cost = Average Safety Cost × Required Safety Efficiency
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  → Required Safety Efficiency = (Investment Ratio × Total Cost) / Average Safety Cost
                </p>
              </div>
              
              <div>
                <p className="mb-2"><strong>3D Visualization</strong></p>
                <p className="text-sm text-muted-foreground">
                  Calculates and visualizes the safety efficiency required to achieve break-even by investment ratio and total construction cost level.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}