import React, { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AppHeader, AppFooter } from "components";
import { ChatBox } from "components/chatbox";

import { authService } from "services/auth";

export class FrontendLayout extends React.Component {
  render() {
    const currentPath = window.location.pathname;
    return (
      <div>
        <AppHeader />
        <ToastContainer />
        {this.props.children}
        {!currentPath.includes("search") && !currentPath.includes("inbox") ? (<AppFooter />) : null}

        {/* <Suspense fallback={<div>Loading...</div>}>
          {authService.isSigned() && !currentPath.includes("inbox") ? (<ChatBox />) : null}
        </Suspense> */}
      </div>
    );
  }
}