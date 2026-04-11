import { useEffect } from "react";

type Callback = () => void;

interface LifecycleProps {
  intent: string;
  ui: React.ReactNode;
  enhancedUI: React.ReactNode;

  onInit?: Callback;
  onProcess?: Callback;
  onGenerate?: Callback;
  onEnhance?: Callback;
  onRender?: Callback;
}

/**
 * YuktAI Lifecycle Manager
 */
export function useYuktLifecycle({
  intent,
  ui,
  enhancedUI,
  onInit,
  onProcess,
  onGenerate,
  onEnhance,
  onRender,
}: LifecycleProps) {
  // 🔹 Init (runs once)
  useEffect(() => {
    onInit && onInit();
  }, []);

  // 🔹 Intent Processing
  useEffect(() => {
    onProcess && onProcess();
  }, [intent]);

  // 🔹 UI Generation
  useEffect(() => {
    onGenerate && onGenerate();
  }, [ui]);

  // 🔹 Accessibility Enhancement
  useEffect(() => {
    onEnhance && onEnhance();
  }, [enhancedUI]);

  // 🔹 Render Phase
  useEffect(() => {
    onRender && onRender();
  });
}