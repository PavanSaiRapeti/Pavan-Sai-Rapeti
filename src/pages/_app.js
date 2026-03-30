import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "../styles/globals.css";
import { wrapper } from "../redux/store";

function MyApp({ Component, ...rest }) {
  const { store, props } = wrapper.useWrappedStore(rest);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={store.__PERSISTOR}>
        <Component {...props.pageProps} />
      </PersistGate>
    </Provider>
  );
}

// Do not use wrapper.withRedux() here: MyApp already calls wrapper.useWrappedStore().
// Double-wrapping runs useRouter-based hydration twice and can throw "NextRouter was not mounted".
export default MyApp;

/** Dev-only Web Vitals logging for performance checks (Lighthouse-style metrics in the console). */
export function reportWebVitals(metric) {
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console -- intentional dev logging
    console.log("[web-vitals]", metric.name, metric.value, metric.label);
  }
}
