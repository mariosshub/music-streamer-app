import { axiosInstance } from "@/lib/axios";
import { useAuth } from "@/providers/AuthProvider"
import { AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";


// Define the structure of a retry queue item
type RetryQueueItem = {
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
  config: AxiosRequestConfig;
}

export const useAuthInterceptor = () => {
  const {isLoggedIn, refreshUsersToken} = useAuth();
  const [interceptorReady, setInterceptorReady] = useState(false);
  // Create a list to hold the failed requests that need to be retried after token refresh.
  const refreshAndRetryQueue: RetryQueueItem[] = [];
  let isRefreshing = false;

  useEffect(() => {
    let authInterceptor = axiosInstance.interceptors.response.use(
      response => response,
      async (error) => {
        const originalRequest: AxiosRequestConfig = error.config;

        // refreshToken expired handle in AuthProvider try cath
        if(originalRequest.url == "auth/refreshToken"){
          // return to handle in authProvider the rest actions to be made..
          return Promise.reject(error);

        }

        // access token expired
        if (error.response && error.response.status === 401) {
          // if refreshing dont enter, push request to the retry queue
          if(!isRefreshing) {
            isRefreshing = true;

            // user was loggedIn try to refresh the access token
            if(isLoggedIn){
              try {
                let accessToken = await refreshUsersToken();
                if(accessToken){
                  console.log('retrying the request')
                  error.config.headers["Authorization"] = "Bearer " + accessToken;

                  // Retry all requests in the queue with the new token if any
                  refreshAndRetryQueue.forEach(({ config, resolve, reject }) => {
                    axiosInstance
                      .request(config)
                      .then((response) => resolve(response))
                      .catch((err) => reject(err));
                  });

                  // Clear the queue
                  refreshAndRetryQueue.length = 0;

                  // retry the original request
                  return axiosInstance(originalRequest);
                }
              } catch (refreshError) {
                // Handle token refresh error
                throw refreshError;
              }finally {
                isRefreshing = false;
              }
            } 
          }
          // Add the original request to the queue
          return new Promise<void>((resolve, reject) => {
            refreshAndRetryQueue.push({ config: originalRequest, resolve, reject });
          });
        }
        return Promise.reject(error);
      }
    );

    // when user refreshes the page add a delay so that interceptor mounts.
    setTimeout(() => {
      setInterceptorReady(true);
    }, 500)

    return () => {
      // remove interceptor on dismount/auth change
      axiosInstance.interceptors.response.eject(authInterceptor); 
    };
  }, [isLoggedIn])

  return { interceptorReady };
}