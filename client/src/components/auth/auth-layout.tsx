type AuthLayoutProps = {
  title: string
  description: string
  footer: React.ReactNode
  children: React.ReactNode
}

export function AuthLayout({ title, description, footer, children }: AuthLayoutProps) {
  return (
    <main className="flex min-h-svh items-center justify-center px-6 py-12">
      <div className="w-full max-w-[360px]">
        <h1 className="text-2xl leading-[1.2] font-medium">
          {title}
        </h1>
        <p className="text-muted-foreground mt-2">{description}</p>
        <div className="mt-8">{children}</div>
        <p className="text-muted-foreground mt-6">{footer}</p>
      </div>
    </main>
  )
}
