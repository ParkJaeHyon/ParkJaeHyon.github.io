import { useState } from 'react';
import { ProjectType, AnalysisMode, SimulationParams, SimulationResult } from './types/simulation';
import { ProjectTypeSelector } from './components/ProjectTypeSelector';
import { ModeSelector } from './components/ModeSelector';
import { SimulationInputForm } from './components/SimulationInputForm';
import { SimulationResults } from './components/SimulationResults';
import { BreakEven3DChart } from './components/BreakEven3DChart';
import { MonteCarloDetails } from './components/MonteCarloDetails';
import { SystemInfo } from './components/SystemInfo';
import { runMonteCarloSimulation } from './utils/monteCarloSimulation';
import { Button } from './components/ui/button';
import { RefreshCw, BarChart3, Info, Cpu, ChevronDown, Mail } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { ImageWithFallback } from './components/figma/ImageWithFallback';

export default function App() {
  const [projectType, setProjectType] = useState<ProjectType>('railway');
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>(1);
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  
  const handleSimulate = async (params: SimulationParams) => {
    setIsSimulating(true);
    
    // Simulate async processing
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const simulationResult = runMonteCarloSimulation(params);
      setResult(simulationResult);
    } finally {
      setIsSimulating(false);
    }
  };
  
  const handleReset = () => {
    setResult(null);
    setCurrentStep(1);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Hero Section - Enhanced with Glassmorphism */}
      {!result && (
        <div className="relative h-[60vh] min-h-[500px] bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 overflow-hidden">
          {/* Background Image Overlay */}
          <div className="absolute inset-0 opacity-20">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1753781466414-e93cf7f4f6df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjB0ZWNobm9sb2d5JTIwZHJvbmUlMjBzbWFydHxlbnwxfHx8fDE3NjM5NjI0NTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Smart Construction Technology"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900/90" />
          </div>
          
          {/* Hero Content */}
          <div className="relative container mx-auto px-6 h-full flex flex-col justify-center items-center text-center text-white">
            <div className="glass-dark rounded-3xl px-8 md:px-16 py-12 md:py-20 max-w-6xl backdrop-blur-xl w-full text-left">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center">
                  <Cpu className="size-10 text-white" />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl tracking-tight mb-2 text-center pb-2">
                Advanced Construction
                <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent mt-3 text-[64px] text-center pb-3 leading-tight overflow-visible">
                  Technology Assessment
                </span>
              </h1>
              
              <p className="text-[20px] text-blue-100 mb-6 max-w-3xl mt-4 leading-loose mx-auto text-center pb-3">
                A platform for analyzing the economic viability of new construction technologies
                <br />
                focusing on accident prevention and labor reduction
              </p>
              
              <div className="flex gap-4 justify-center mt-2">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-10 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  onClick={() => {
                    document.getElementById('step-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Start Analysis
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {!result ? (
        /* Input Phase - 3 Step Cards */
        <div id="step-section" className="py-24">
          <div className="container mx-auto px-6 max-w-7xl">
            {/* Progress Steps */}
            <div className="mb-16">
              <div className="flex items-center justify-center gap-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`flex items-center gap-3 transition-all duration-300 ${
                      currentStep >= step ? 'text-blue-600' : 'text-gray-400'
                    }`}>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        currentStep >= step 
                          ? 'border-blue-600 bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/50' 
                          : 'border-gray-300 bg-white'
                      }`}>
                        <span className="font-semibold">{step}</span>
                      </div>
                      <span className="hidden md:inline font-medium">
                        {step === 1 && 'Project Type'}
                        {step === 2 && 'Analysis Mode'}
                        {step === 3 && 'Simulation'}
                      </span>
                    </div>
                    {step < 3 && (
                      <div className={`w-20 h-1 mx-4 rounded-full transition-all duration-300 ${
                        currentStep > step ? 'bg-gradient-to-r from-blue-600 to-cyan-600' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Step 1: Project Type */}
            {currentStep === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center mb-12">
                  <h2 className="text-4xl mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Select Project Type
                  </h2>
                  <p className="text-xl text-muted-foreground">Choose the type of construction project to analyze</p>
                </div>
                
                <ProjectTypeSelector 
                  value={projectType} 
                  onChange={setProjectType}
                />
                
                <div className="flex justify-center mt-12">
                  <Button 
                    size="lg" 
                    onClick={() => setCurrentStep(2)}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-16 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    Next Step
                  </Button>
                </div>
              </div>
            )}
            
            {/* Step 2: Analysis Mode */}
            {currentStep === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center mb-12">
                  <h2 className="text-4xl mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Select Analysis Mode
                  </h2>
                  <p className="text-xl text-muted-foreground">Choose the economic analysis method</p>
                </div>
                
                <ModeSelector 
                  value={analysisMode} 
                  onChange={setAnalysisMode}
                />
                
                <div className="flex justify-center gap-6 mt-12">
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    className="px-12 py-6 text-lg border-2 hover:bg-gray-50"
                  >
                    Previous
                  </Button>
                  <Button 
                    size="lg" 
                    onClick={() => setCurrentStep(3)}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-16 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    Next Step
                  </Button>
                </div>
              </div>
            )}
            
            {/* Step 3: Simulation Parameters */}
            {currentStep === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center mb-12">
                  <h2 className="text-4xl mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Simulation Parameters
                  </h2>
                  <p className="text-xl text-muted-foreground">Enter the required values for analysis</p>
                </div>
                
                <SystemInfo />
                
                <SimulationInputForm
                  projectType={projectType}
                  analysisMode={analysisMode}
                  onSimulate={handleSimulate}
                  isSimulating={isSimulating}
                />
                
                <div className="flex justify-center mt-12">
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => setCurrentStep(2)}
                    className="px-12 py-6 text-lg border-2 hover:bg-gray-50"
                  >
                    Previous
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Results Phase */
        <div className="min-h-screen py-16">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="space-y-8">
              {/* Action Buttons - Enhanced with glassmorphism */}
              <div className="glass rounded-2xl p-8 elevation-md border-2 border-white/50">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      Analysis Complete
                    </h2>
                    <p className="text-lg text-muted-foreground">
                      Monte Carlo simulation completed with 1,000 iterations
                    </p>
                  </div>
                  <Button 
                    onClick={handleReset} 
                    variant="outline" 
                    size="lg"
                    className="border-2 hover:bg-white/80 px-8 py-6 text-lg"
                  >
                    <RefreshCw className="size-5 mr-3" />
                    New Analysis
                  </Button>
                </div>
              </div>
              
              {/* Results Tabs */}
              <Tabs defaultValue="summary" className="w-full">
                <TabsList className={`grid w-full h-auto p-2 glass border-2 border-white/50 elevation-sm ${
                  result.analysisMode === 1 ? 'grid-cols-3' : 'grid-cols-2'
                }`}>
                  <TabsTrigger value="summary" className="text-lg py-4 data-[state=active]:bg-white data-[state=active]:shadow-md">
                    Results Summary
                  </TabsTrigger>
                  <TabsTrigger value="montecarlo" className="text-lg py-4 data-[state=active]:bg-white data-[state=active]:shadow-md">
                    Monte Carlo
                  </TabsTrigger>
                  {result.analysisMode === 1 && (
                    <TabsTrigger value="breakeven" className="text-lg py-4 data-[state=active]:bg-white data-[state=active]:shadow-md">
                      Break-even Analysis
                    </TabsTrigger>
                  )}
                </TabsList>
                
                <TabsContent value="summary" className="mt-8">
                  <SimulationResults result={result} />
                </TabsContent>
                
                <TabsContent value="montecarlo" className="mt-8">
                  <MonteCarloDetails result={result} />
                </TabsContent>
                
                {result.analysisMode === 1 && (
                  <TabsContent value="breakeven" className="mt-8">
                    <BreakEven3DChart result={result} />
                  </TabsContent>
                )}
              </Tabs>
            </div>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center">
              <Cpu className="size-7 text-white" />
            </div>
            <h3 className="text-2xl font-semibold">Smart Construction Economic Analysis</h3>
          </div>
          <p className="text-blue-100 mb-3 text-lg">
            Construction Safety Technology Investment Decision Support System
          </p>
          <p className="text-blue-200/70 mb-4">
            Project Types: Railway, Building, Road Pavement, Agricultural Water, Water Supply, Sewage
          </p>
          <div className="flex items-center justify-center gap-2 text-blue-300/80 text-sm">
            <Mail className="size-4" />
            <span>pjh120561@yonsei.ac.kr</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
