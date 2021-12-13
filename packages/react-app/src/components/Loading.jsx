import CloseCircleOutlined from "@ant-design/icons/lib/icons/CloseCircleOutlined";
import { debounce } from "lodash";
import React, { useEffect } from "react";
import { activeColor } from "../theme";

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

export const LoadingCore = (props) => {
  return (
    <svg
      width="40px"
      height="40px"
      viewBox="0 0 40 40"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `scale(${props?.scale || 3})`, marginTop: 100, marginLeft: 50 }}>
      <g id="页面-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="ai报警中心" transform="translate(-163.000000, -264.000000)" fill={activeColor}>
          <g id="videos" transform="translate(40.000000, 197.000000)">
            <g id="编组" transform="translate(123.000000, 67.000000)">
              <g id="Group" transform="translate(4.000000, 2.000000)">
                <path
                  d="M15,0 C15.5522847,-1.01453063e-16 16,0.44771525 16,1 C16,1.55228475 15.5522847,2 15,2 L14,2 L14,5 C14,7.08751516 12.9339347,8.92603743 11.3165298,10.0008411 C12.8665428,11.0292492 13.910204,12.7606035 13.9944848,14.7403948 L14,15 L14,18 L15,18 C15.5522847,18 16,18.4477153 16,19 C16,19.5522847 15.5522847,20 15,20 L1,20 C0.44771525,20 6.76353751e-17,19.5522847 0,19 C-6.76353751e-17,18.4477153 0.44771525,18 1,18 L2,18 L2,15 C2,12.9124848 3.06606531,11.0739626 4.6834702,9.99915894 C3.06606531,8.92603743 2,7.08751516 2,5 L2,2 L1,2 C0.44771525,2 6.76353751e-17,1.55228475 0,1 C-6.76353751e-17,0.44771525 0.44771525,1.01453063e-16 1,0 L15,0 Z M8,11 C5.85780461,11 4.10892112,12.6839685 4.00489531,14.8003597 L4,15 L4,18 L12,18 L12,15 C12,12.790861 10.209139,11 8,11 Z M12,2 L4,2 L4,5 C4,7.209139 5.790861,9 8,9 C10.209139,9 12,7.209139 12,5 L12,2 Z M10,4 L10,5 C10,6.1045695 9.1045695,7 8,7 C6.8954305,7 6,6.1045695 6,5 L6,4 L10,4 Z"
                  id="Combined-Shape">
                  <animateTransform
                    attributeName="transform"
                    attributeType="XML"
                    type="rotate"
                    values="180 8 10; 0 8 10; 0 8 10"
                    dur="1s"
                    repeatCount="indefinite"
                  />
                </path>
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
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
          <LoadingCore />
        </div>
        {/* {show && <div id="close-loading" onClick={closeLoading}><CloseCircleOutlined /></div>} */}
        {/* {show && <div id="close-text" >Chaining speed is slow, please be patient.</div>} */}
      </div>
    </div>
  );
};