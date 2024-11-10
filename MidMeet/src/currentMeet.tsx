import useSWR from "swr";
import { getMeet } from "./apiOperations/meetApi";

export default function useCurrentMeet(
  token: string,
  setToken: (str: string) => void,
  meetId: string | undefined
) {
  const { data, error, isLoading } = useSWR(
    meetId ? `/api/meet/self/data/${meetId}` : null,
    () => getMeet(token, setToken, meetId),
    {
      refreshInterval: 5000, // Refetch data every 5 seconds
    }
  );

  return {
    meetData: data,
    isLoading,
    isError: error,
  };
}
