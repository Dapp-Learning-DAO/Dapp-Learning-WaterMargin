import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { ApolloClient, ApolloProvider, InMemoryCache, ApolloLink, HttpLink } from "@apollo/client";
import "./index.css";
import App from "./App";
import { LoadingProvider } from "./components/Loading";
import { ThemeSwitcherProvider } from "react-css-theme-switcher";

const themes = {
  dark: `${process.env.PUBLIC_URL}/dark-theme.css`,
  light: `${process.env.PUBLIC_URL}/light-theme.css`,
};

const prevTheme = window.localStorage.getItem("theme");

let subgraphUri = process.env.REACT_APP_GRAPHQL;
let subgraphRedPacketUri = process.env.REACT_APP_REDPACKET;

let clientRedPacket = new HttpLink({
  uri: subgraphRedPacketUri,
  cache: new InMemoryCache(),
});

let clientWaterMargin = new HttpLink({
  uri: subgraphUri,
  cache: new InMemoryCache(),
});

const client = new ApolloClient({
  link: ApolloLink.split(
    operation => operation.getContext().clientName === "RedPacket",
    clientRedPacket,
    clientWaterMargin,
  ),
  cache: new InMemoryCache(),
});

// const SwitchApolloProviderClient = () => {
//   // "http://localhost:8000/subgraphs/name/scaffold-eth/your-contract"
//   let subgraphUri = process.env.REACT_APP_GRAPHQL;
//   let subgraphRedPacketUri = process.env.REACT_APP_REDPACKET;

//   const [client, setClient] = useState()

//   useEffect(() => {
//     let clientRedPacket = new ApolloClient({
//       uri: subgraphRedPacketUri,
//       cache: new InMemoryCache()
//     });

//     let clientWaterMargin = new ApolloClient({
//       uri: subgraphUri,
//       cache: new InMemoryCache()
//     });
//     const _historyWrap = function (type) {
//       const orig = window.history[type];
//       const e = new Event(type);
//       return function () {
//         const rv = orig.apply(this, arguments);
//         e.arguments = arguments;
//         window.dispatchEvent(e);
//         return rv;
//       };
//     };
//     window.history.pushState = _historyWrap('pushState');
//     //window.history.replaceState = _historyWrap('replaceState');

//     window.addEventListener('pushState', function (e) {
//       const route = e?.arguments[2]
//       if (route === "/redPacket") {
//         setClient(clientRedPacket)
//       } else {
//         setClient(clientWaterMargin)
//       }
//     });

//     /* window.addEventListener('replaceState', function (e) {
//       const route = e?.arguments[2]
//       if (route === "/redPacket") {
//         setClient(clientRedPacket)
//       } else {
//         setClient(clientWaterMargin)
//       }
//     }); */

//     if (window.location.pathname === "/redPacket") {
//       setClient(clientRedPacket)
//     }else{
//       setClient(clientWaterMargin)
//     }
//   }, [subgraphRedPacketUri, subgraphUri])

//   return (client ? <ApolloProvider client={client}>
//     <ThemeSwitcherProvider themeMap={themes} defaultTheme={prevTheme ? prevTheme : "light"}>
//       <LoadingProvider >
//         <App subgraphUri={subgraphUri} />
//       </LoadingProvider>
//     </ThemeSwitcherProvider>
//   </ApolloProvider> : null)
// }

const Layout = () => (
  <ApolloProvider client={client}>
    <ThemeSwitcherProvider themeMap={themes} defaultTheme={prevTheme ? prevTheme : "light"}>
      <LoadingProvider>
        <App subgraphUri={subgraphUri} />
      </LoadingProvider>
    </ThemeSwitcherProvider>
  </ApolloProvider>
);

ReactDOM.render(<Layout />, document.getElementById("root"));
