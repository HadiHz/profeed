import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout,AuthLayout } from "./layouts";

// Route Views
// import BlogOverview from "./views/BlogOverview";
import UserProfileLite from "./views/UserProfileLite";
// import AddNewPost from "./views/AddNewPost";
// import Errors from "./views/Errors";
// import ComponentsOverview from "./views/ComponentsOverview";
import XeroConverter from './views/XeroConverter';
// import Tables from "./views/Tables";
// import BlogPosts from "./views/BlogPosts";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Settings from "./components/settings";
import ChangePassword from "./components/auth/forgetpassword/ChangePassword";
import ForgetPasswordLayout from "./components/auth/forgetpassword/ForgetPasswordLayout";

export default [

  
  {
    path: "/",
    exact: true,
    layout: DefaultLayout,
    component: () => <Redirect to="/xero_converter" />
  },
  {
    path: "/settings",
    layout: DefaultLayout,
    component: Settings
  },
  {
    path: "/register",
    layout: AuthLayout,
    component: Register
  },
  {
    path: "/login",
    layout: AuthLayout,
    component: Login
  },

  /* {
    path: "/dashboard",
    layout: DefaultLayout,
    component: BlogOverview
  }, */
  {
    path: "/xero_converter",
    layout: DefaultLayout,
    component: XeroConverter
  },
  {
    path: "/user-profile",
    layout: DefaultLayout,
    component: UserProfileLite
  },
  {
    path: "/forgetPassword",
    layout: AuthLayout,
    component: ForgetPasswordLayout
  },
  {
    path: "/changePassword",
    layout: AuthLayout,
    exact:true,
    component: ChangePassword
  }
  /* {
    path: "/user-profile-lite",
    layout: DefaultLayout,
    component: UserProfileLite
  },
  {
    path: "/add-new-post",
    layout: DefaultLayout,
    component: AddNewPost
  },
  {
    path: "/errors",
    layout: DefaultLayout,
    component: Errors
  },
  {
    path: "/components-overview",
    layout: DefaultLayout,
    component: ComponentsOverview
  },
  {
    path: "/tables",
    layout: DefaultLayout,
    component: Tables
  },
  {
    path: "/blog-posts",
    layout: DefaultLayout,
    component: BlogPosts
  } */
];
