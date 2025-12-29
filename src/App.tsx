import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { FunnelProvider } from "./context/FunnelContext";
import ProtectedRoute from "./components/funnel/ProtectedRoute";
import { lazy, Suspense } from "react";

// Lazy load all step components
const Step1 = lazy(() => import("./pages/steps/Step1"));
const Step2 = lazy(() => import("./pages/steps/Step2"));
const Step3 = lazy(() => import("./pages/steps/Step3"));
const Step4 = lazy(() => import("./pages/steps/Step4"));
const Step5 = lazy(() => import("./pages/steps/Step5"));
const Step6 = lazy(() => import("./pages/steps/Step6"));
const Step7 = lazy(() => import("./pages/steps/Step7"));
const Step8 = lazy(() => import("./pages/steps/Step8"));
const Step9 = lazy(() => import("./pages/steps/Step9"));
const Step10 = lazy(() => import("./pages/steps/Step10"));
const Step11 = lazy(() => import("./pages/steps/Step11"));
const Step12 = lazy(() => import("./pages/steps/Step12"));
const Step13 = lazy(() => import("./pages/steps/Step13"));
const Step14 = lazy(() => import("./pages/steps/Step14"));
const Step15 = lazy(() => import("./pages/steps/Step15"));
const Step16 = lazy(() => import("./pages/steps/Step16"));
const Step17 = lazy(() => import("./pages/steps/Step17"));
const Checkout = lazy(() => import("./pages/Checkout"));

const queryClient = new QueryClient();

// Loading component
const LoadingScreen = () => (
  <div className="min-h-screen bg-funnel-bg flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-funnel-success border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <FunnelProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/" element={<Navigate to="/step/1" replace />} />
              <Route path="/step/1" element={<Step1 />} />
              <Route path="/step/2" element={<ProtectedRoute step={2}><Step2 /></ProtectedRoute>} />
              <Route path="/step/3" element={<ProtectedRoute step={3}><Step3 /></ProtectedRoute>} />
              <Route path="/step/4" element={<ProtectedRoute step={4}><Step4 /></ProtectedRoute>} />
              <Route path="/step/5" element={<ProtectedRoute step={5}><Step5 /></ProtectedRoute>} />
              <Route path="/step/6" element={<ProtectedRoute step={6}><Step6 /></ProtectedRoute>} />
              <Route path="/step/7" element={<ProtectedRoute step={7}><Step7 /></ProtectedRoute>} />
              <Route path="/step/8" element={<ProtectedRoute step={8}><Step8 /></ProtectedRoute>} />
              <Route path="/step/9" element={<ProtectedRoute step={9}><Step9 /></ProtectedRoute>} />
              <Route path="/step/10" element={<ProtectedRoute step={10}><Step10 /></ProtectedRoute>} />
              <Route path="/step/11" element={<ProtectedRoute step={11}><Step11 /></ProtectedRoute>} />
              <Route path="/step/12" element={<ProtectedRoute step={12}><Step12 /></ProtectedRoute>} />
              <Route path="/step/13" element={<ProtectedRoute step={13}><Step13 /></ProtectedRoute>} />
              <Route path="/step/14" element={<ProtectedRoute step={14}><Step14 /></ProtectedRoute>} />
              <Route path="/step/15" element={<ProtectedRoute step={15}><Step15 /></ProtectedRoute>} />
              <Route path="/step/16" element={<ProtectedRoute step={16}><Step16 /></ProtectedRoute>} />
              <Route path="/step/17" element={<ProtectedRoute step={17}><Step17 /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute step={17}><Checkout /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/step/1" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </FunnelProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
