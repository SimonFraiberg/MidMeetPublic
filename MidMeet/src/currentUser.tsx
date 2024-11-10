import useSWR from "swr";
import { getUser } from "./apiOperations/userApi";

export default function currentUser(
  token: string,
  setToken: (str: string) => void
) {
  const { data, error, isLoading } = useSWR(`/api/user/self/data`, () =>
    getUser(token, setToken)
  );

  return {
    user: data,
    isLoading,
    isError: error,
  };
}
