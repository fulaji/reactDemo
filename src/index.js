import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import reportWebVitals from "./reportWebVitals";
import SimpleReactLightbox from "simple-react-lightbox";

// redux setup
import { PersistGate } from 'redux-persist/integration/react';
import Store from './stores';
import { Provider } from 'react-redux';

ReactDOM.render(
  <Provider store={Store().store}>
    <PersistGate loading={null} persistor={Store().persistor}>
      <React.StrictMode>
        <SimpleReactLightbox>
          <App />
        </SimpleReactLightbox>
      </React.StrictMode>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);
reportWebVitals();
