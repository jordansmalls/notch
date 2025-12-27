
import { useFetchUserCountersMutation } from "../../slices/counters-api-slice";
// import { useFetchUserCountersQuery } from "../../slices/counters-api-slice";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import { PlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";


import ResetButton from "../buttons/reset-button";
import CopyButton from "../buttons/copy-button";
import DeleteButton from "../buttons/delete-button";
import EditButton from "../buttons/edit-button";

interface Counter {
  _id: string;
  name: string;
  description: string;
  count: number;
  public_key: string;
  createdAt: string;
}

const Data = () => {
  const { userInfo } = useSelector((state: any) => state.auth);
  const [counters, setCounters] = useState<Counter[]>([]);
  const [fetchCounters, { isLoading }] = useFetchUserCountersMutation();
//   const [fetchCounters, { isLoading }] = useFetchUserCountersQuery();
  const navigate = useNavigate()

  const CHAR_LIMIT = 120;

  useEffect(() => {
    const getCounters = async () => {
      try {
        const res = await fetchCounters().unwrap();
        setCounters(res.counters);
      } catch (err: any) {
        console.error("Fetching counters error:", err);
        toast.error("Oops!", {
          description: "We're having trouble fetching your counters.",
        });
      }
    };

    if (userInfo) {
      getCounters();
    }
  }, [fetchCounters, userInfo]);


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };


  const formatNumber = function(value: number): string {
    return new Intl.NumberFormat("en-US").format(value)
  }

  const truncateText = (text: string, limit: number) => {
    if (text.length <= limit) return text;
    return text.slice(0, limit) + "...";
  };

  const handleCreateNew = (e) => {
    e.preventDefault()
    navigate("/create-counter")
  }

//   handle delete
  const handleDeleteSuccess = (id: string) => {
    // This removes the counter with the matching ID from local state
    setCounters((prev) => prev.filter((c) => c._id !== id));

    // add query logic and tags, and it will autmatically refresh
  };


// handle reset success
// TODO: update mutations/queries, so that auto refresh goes on
const handleResetSuccess = () => {
    window.location.reload();
}


// handle edit success
const handleEditSuccess = (id: string, name: string, description: string) => {
  setCounters((prev) =>
    prev.map((counter) =>
      counter._id === id
        ? { ...counter, name, description }
        : counter
    )
  );
};

  return (
    <div className="p-4 max-w-4xl mx-auto">
        <div className="flex justify-between">
            <h1 className="text-2xl font-bold mb-6">Your Counters</h1>

            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
            <Button onClick={handleCreateNew}><PlusIcon /></Button>
                    </TooltipTrigger>
                <TooltipContent>
                    Create New Counter
                </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Spinner />
          <p>Loading your data...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {counters.length > 0 ? (
            counters.map((counter) => (
              <div
                key={counter._id}
                className="flex items-center justify-between p-4 border rounded-lg bg-card shadow-sm transition-hover hover:shadow-md"
              >
                {/* Left Section: Identity & Description */}
                <div className="flex flex-col gap-1 overflow-hidden">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                  <h2 className="lg:text-lg text-sm font-semibold truncate leading-none text-wrap">
                    {counter.name}
                  </h2>
                  </TooltipTrigger>
                  <TooltipContent>
                    {truncateText(counter.description, CHAR_LIMIT)}
                  </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {/* <p className="text-sm text-muted-foreground">
                    {truncateText(counter.description, CHAR_LIMIT)}
                  </p> */}
                  <div className="flex items-center gap-2 mt-1 lg:text-xs text-[.625rem] text-muted-foreground">
                    <span>Created on {formatDate(counter.createdAt)}</span>
                  </div>
                </div>

                {/* Right Section: Count & Actions */}
                <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
                  <div className="text-right">
                    <span className="lg:text-3xl text-md font-bold text-primary">
                      {formatNumber(counter.count)}
                    </span>
                    <p className="lg:text-[.625rem] text-[.5rem] uppercase tracking-wider text-muted-foreground font-bold">
                      Count
                    </p>
                  </div>

                  <div className="flex items-center gap-2 border-l pl-4 ">

                      {/* Edit component */}

                      <EditButton
                      _id={counter._id}
                      counterName={counter.name}
                      counterDescription={counter.description}
                      onSuccess={handleEditSuccess}
                       />

                      {/* Copy component */}
                      <CopyButton counterName={counter.name} counterPublicKey={counter.public_key} />

                      {/* Reset Component */}
                      <ResetButton _id={counter._id} counterName={counter.name} onSuccess={handleResetSuccess} />

                      {/* Delete Component */}
                      <DeleteButton id={counter._id} onSuccess={handleDeleteSuccess} />

                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground mx-6">No counters found. Create your first one to get started!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Data;