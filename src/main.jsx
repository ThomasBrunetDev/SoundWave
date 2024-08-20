import ReactDOM from "react-dom/client";
import React from "react";
import "./config/firebase";
import { AuthProvider } from "./context/authContext";
import App from "./App";
import { MusicProvider } from "./context/musicContext";
import { SkeletonTheme } from "react-loading-skeleton";

const RootComponent = (
  <SkeletonTheme baseColor="#492F75" highlightColor="#7349b6">
    <AuthProvider>
      <MusicProvider>
        <App />
      </MusicProvider>
    </AuthProvider>
  </SkeletonTheme>
);

ReactDOM.createRoot(document.getElementById("root")).render(RootComponent);
