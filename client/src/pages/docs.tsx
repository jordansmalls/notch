import { AppSidebar } from "../components/sidebar/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb"
import { Separator } from "../components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../components/ui/sidebar"
import { Check, Copy, Terminal, Info, Globe } from "lucide-react"
import { useState } from "react"
import { Button } from "../components/ui/button"
import { cn } from "@/lib/utils"

const CodeBlock = ({ code, label, variant = "default" }: { code: string; label?: string; variant?: "default" | "success" }) => {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-2 my-2">
      {label && (
        <span className={cn(
          "text-[10px] font-bold uppercase tracking-wider ml-1",
          variant === "success" ? "text-emerald-600" : "text-muted-foreground"
        )}>
          {label}
        </span>
      )}
      <div className="relative group">
        <div className="absolute right-4 top-4 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-zinc-800"
            onClick={copyToClipboard}
          >
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <pre className="overflow-x-auto rounded-lg bg-zinc-950 p-5 text-sm leading-relaxed text-zinc-300 border border-zinc-800 font-mono">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  )
}

const Docs = () => {
  const SAMPLE_KEY = "notch_pub_b6sUE5TnWYTKMJJnt4cQRtZYXk4NjQtW"
  const BASE_URL = "http://localhost:4000"

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Docs</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-10 p-6 md:p-10 max-w-3xl mx-auto w-full">
          {/* Header */}
          <section>
            <h1 className="text-4xl font-extrabold tracking-tight mb-4">API Documentation</h1>
            <p className="text-muted-foreground text-lg leading-7">
              Integrate Notch counters into your site with a few lines of code. All public endpoints are CORS enabled and rate limited to prevent abuse. A <code className="font-mono!">`public_key`</code> is the public key generated with your counter, that can be copied in the dashboard.
            </p>
          </section>

          <Separator />

          {/* Fetch Count Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500/10 p-2 rounded-lg">
                <Globe className="h-5 w-5 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold">Fetch Current Count</h2>
            </div>
            <p className="text-muted-foreground">
              Retrieve the current count for a counter. Use this for read only displays.
            </p>

            <div className="flex items-center gap-3 font-mono text-sm bg-muted p-3 rounded-md border border-emerald-100">
              <span className="font-bold text-emerald-600">GET</span>
              <span className="text-muted-foreground truncate">{BASE_URL}/api/counters/public/:public_key</span>
            </div>

            <div className="flex flex-col gap-2">
              <CodeBlock
                label="Request Example"
                code={`fetch("${BASE_URL}/api/counters/public/${SAMPLE_KEY}")\n  .then(res => res.json())`}
              />
              <CodeBlock
                variant="success"
                label="Expected Response"
                code={`{\n  "count": 120328\n}`}
              />
            </div>
          </section>

          <Separator />

          {/* Increment Count Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500/10 p-2 rounded-lg">
                <Terminal className="h-5 w-5 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold">Increment Count</h2>
            </div>
            <p className="text-muted-foreground">
              Trigger a count increase. This endpoint returns the new updated total.
            </p>

            <div className="flex items-center gap-3 font-mono text-sm bg-muted p-3 rounded-md border border-orange-100">
              <span className="font-bold text-orange-600">POST</span>
              <span className="text-muted-foreground truncate">{BASE_URL}/api/counters/public/:public_key/increment</span>
            </div>

            <div className="flex flex-col gap-2">
              <CodeBlock
                label="Request Example"
                code={`fetch("${BASE_URL}/api/counters/public/${SAMPLE_KEY}/increment", {\n  method: "POST"\n})`}
              />
              <CodeBlock
                variant="success"
                label="Expected Response"
                code={`{\n  "message": "Success",\n  "count": 120327\n}`}
              />
            </div>
          </section>

          {/* Tips Section */}
          {/* <section className="bg-zinc-50 rounded-2xl p-8 border border-zinc-200 mb-10">
            <h3 className="text-lg font-bold mb-4">Quick Integration Tip</h3>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              If you are using React, you can create a simple hook to manage your counter values automatically across your application.
            </p>
            <CodeBlock
                label="Simple React Integration"
                code={`const increment = async () => {\n  const res = await fetch(\`\${BASE_URL}/api/counters/public/\${key}/increment\`, { method: "POST" });\n  const data = await res.json();\n  setCount(data.count);\n};`}
            />
          </section> */}

          {/* Tips Section */}
          <section className="bg-muted/50 rounded-xl p-8 border border-border mb-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <h3 className="text-lg font-bold">Quick Integration Tip</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Using React? Here is a simple way to fetch and display your live count. This example uses <code className="text-primary font-mono bg-muted px-1 rounded">useEffect</code> to load the data when your component mounts.
            </p>

            <CodeBlock
                label="React Component Example"
                code={`import { useEffect, useState } from "react";

const CounterDisplay = ({ publicKey }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch(\`\${BASE_URL}/api/counters/public/\${publicKey}\`)
      .then(res => res.json())
      .then(data => setCount(data.count));
  }, [publicKey]);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">Live Views:</span>
      <span className="font-bold text-primary tabular-nums">
        {count.toLocaleString()}
      </span>
    </div>
  );
};`}
            />
          </section>

        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Docs