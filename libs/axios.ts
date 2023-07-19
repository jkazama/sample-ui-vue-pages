import Axios, { AxiosError } from "axios";
import { Level, Log } from "./log";
import { useEventStore } from "@/store/event";
export const axios = () => {
  const baseUrl = useRuntimeConfig().public.apiRoot;
  const lib = Axios.create({
    baseURL: baseUrl,
    headers: {
      Expires: -1,
      "Cache-Control": "no-cache,no-store,must-revalidate,max-age=-1,private",
    },
    withCredentials: true,
  });
  lib.interceptors.response.use(
    (res) => {
      return res.data;
    },
    (err: AxiosError) => {
      const res = err.response;
      if (res && res.status) {
        Log.warn(
          "[" + res.status + "] " + (res.statusText || "empty statusText")
        );
        switch (res.status) {
          case 0:
            Log.error("No host was found to connect to.");
            break;
          case 200:
            Log.error(
              "Failed to parse the return value, please check if the response is returned in JSON format"
            );
            break;
          case 400:
            if (res.data) {
              Log.warn(res.data);
              const columnMessages = res.data as Record<string, string[]>;
              useEventStore().notify(
                "Please confirm your input.",
                Level.WARN,
                columnMessages
              );
            }
            break;
          case 401:
            Log.error("You do not have permission to execute the api.");
            break;
          default:
            if (res.data) {
              Log.error(res.data);
            }
        }
      } else {
        Log.error(err);
      }
      return Promise.reject(err);
    }
  );
  return lib;
};
