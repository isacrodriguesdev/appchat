import React from "react";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { store } from "./src/store/index"
import AuthProvider from "./src/contexts/auth";

import Routes from './src/routes/index'

function App() {

  return (
    <Provider store={store}>
        <AuthProvider>
          <NavigationContainer
            theme={{
              colors: { background: "white" },
            }}>
            <Routes />
          </NavigationContainer>
        </AuthProvider>
    </Provider>
  );
};

export default App;