import { skipToken } from "@reduxjs/toolkit/query/react"
import { useSelector } from "react-redux"
import { useFetchUserCountersQuery } from "@/slices/counters-api-slice"
import type { RootState } from "@/store"
import { AppLayout } from "../components/app-layout"
import Data from "../components/dashboard-ui/data"
import LoadingPage from "./loading"

const Dashboard = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth)
  const { data, isLoading, isError } = useFetchUserCountersQuery(userInfo?._id ?? skipToken)

  return (
    <>
      {isLoading ? (
        <LoadingPage />
      ) : (
        <AppLayout breadcrumbs={[{ label: "Dashboard" }]}>
          <Data counters={data?.counters ?? []} isError={isError} />
        </AppLayout>
      )}
    </>
  )
}

export default Dashboard
