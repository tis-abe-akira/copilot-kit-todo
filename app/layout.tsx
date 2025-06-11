import "./globals.css";
 
import { ReactNode } from "react";
import { CopilotKit } from "@copilotkit/react-core"; 
 
export default function RootLayout({ children }: { children: ReactNode }) {
    return (
      <html lang="en">
        <body> 
          {/* Use the public api key you got from Copilot Cloud  */}
          <CopilotKit publicApiKey={process.env.NEXT_PUBLIC_COPILOTKIT_API_KEY}> 
            {children}
          </CopilotKit>
        </body>
      </html>
    );
}
