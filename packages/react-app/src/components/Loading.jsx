import CloseCircleOutlined from "@ant-design/icons/lib/icons/CloseCircleOutlined";
import { debounce } from "lodash";
import React, { useEffect } from "react";

// When using, you can introduce the useLoading hook
// const ExampleLoading = () => {
//   const { openLoading, closeLoading } = useLoading()

//   useEffect(async () => {
//     openLoading()
//     await fetch()
//     closeLoading()
//   }, [])

//   return (<YourComponents />)
// }

export const LoadingContext = React.createContext({});

export const useLoading = () => React.useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  // Determine if it is currently in the loading
  const [loading, setLoading] = React.useState(false);

  // Turn on the loading effect
  const openLoading = () => {
    setLoading(true)
  }

  // Close the loading effect (one second delay off)
  const closeDelayLoading = debounce(() => {
    setLoading(false)
  }, 1000)

  // Turn off the loading effect
  const closeLoading = () => {
    setLoading(false)
  }

  return (
    <LoadingContext.Provider value={{ loading, openLoading, closeLoading, closeDelayLoading }}>
      {children}
    </LoadingContext.Provider>
  )
}

export const Loading = () => {
  const { loading, closeLoading } = useLoading()
  const [show, setShow] = React.useState(false)
  React.useEffect(() => {
    let timer;
    if (loading) {
      setTimeout(() => {
        setShow(true)
        clearTimeout(timer)
      }, 2000)
    }

    return () => {
      setShow(false)
      clearTimeout(timer)
    }
  }, [loading])

  return (
    loading && <div id="loading">
      <div id="loading-center">
        <div id="loading-center-absolute">
          <div className="object" id="object_four"></div>
          <div className="object" id="object_three"></div>
          <div className="object" id="object_two"></div>
          <div className="object" id="object_one"></div>
        </div>
        {show && <div id="close-loading" onClick={closeLoading}><CloseCircleOutlined /></div>}
        {/* {show && <div id="close-text" >Chaining speed is slow, please be patient.</div>} */}
      </div>
    </div>
  );
};