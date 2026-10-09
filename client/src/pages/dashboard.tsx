import { useCounters } from "@/hooks/use-counters"
import { AppLayout } from "../components/app-layout"
import Data from "../components/dashboard-ui/data"
import LoadingPage from "./loading"

const Dashboard = () => {
  const { counters, hasData, isLoading, isError, isFetching, refetch } = useCounters()

  return (
    <>
      {isLoading ? (
        <LoadingPage />
      ) : (
        <AppLayout breadcrumbs={[{ label: "Dashboard" }]}>
          <Data counters={counters} hasData={hasData} isError={isError} isFetching={isFetching} onRetry={() => void refetch()} />
        </AppLayout>
      )}
    </>
  )
}

export default Dashboard
