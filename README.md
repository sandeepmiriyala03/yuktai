tsx// app/layout.tsx
import YuktAIWrapper from "yuktai-a11y/next";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <YuktAIWrapper>{children}</YuktAIWrapper>
      </body>
    </html>
  );
}
