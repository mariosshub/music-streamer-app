import { toast, ToastOptions } from "react-toastify"

const useCustomizedToast = () => {

  const options: ToastOptions = {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  }


  const toastSuccess = (message: string) => {
    toast.success(message, options)
  }

  const toastWarning = (message: string) => {
    toast.warning(message, options)
  }

  const toastError = (message: string) => {
    toast.error(message, options)
  }

  const toastErrorApi = (error: any) => {
    toast.error(
      <div>
        <h3 className="text-sm font-semibold">{error.response.data.message}</h3>
        <i className="text-sm text-zinc-300">Status code: {error.status}</i>
      </div>, options)
  }

  const toastWarningApi = (error: any) => {
    toast.warning(
      <div>
        <h3 className="text-sm font-semibold">{error.response.data.message}</h3>
        <i className="text-sm text-zinc-300">Status code: {error.status}</i>
      </div>, options)
  }

  return { toastSuccess, toastWarning, toastError, toastErrorApi, toastWarningApi }
}

export default useCustomizedToast