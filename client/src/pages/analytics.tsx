import { AppLayout } from "../components/app-layout";

// placeholder until analytics is built
const Analytics = () => {
    return (
        <AppLayout breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Analytics" }]}>
            <h1 className="text-2xl font-medium">Analytics</h1>
            <p className="text-muted-foreground mt-2">Coming soon.</p>
        </AppLayout>
    );
}

export default Analytics;
