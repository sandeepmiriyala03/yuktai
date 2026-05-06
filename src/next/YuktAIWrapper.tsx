"use client";
// yuktai-a11y · next/YuktAIWrapper.tsx
// Next.js 13+ App Router adapter.
// "use client" is declared here — users never need to add it.
//
// next.config.js:
//   transpilePackages: ["@yuktishaalaa/yuktai"]
//
// app/layout.tsx:
//   import { YuktAIWrapper } from "@yuktishaalaa/yuktai";
//   <YuktAIWrapper>{children}</YuktAIWrapper>

export { YuktAIWrapper as default, YuktAIWrapper } from "../react/YuktAIWrapper";
export type { YuktAIWrapperProps } from "../react/YuktAIWrapper";
import CodeGenPanel from "../react/CodeGenPanel";