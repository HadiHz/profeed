import { EventEmitter } from "events";

import Dispatcher from "./dispatcher";
import Constants from "./constants";
import getSidebarNavItems from "../data/sidebar-nav-items";
import moment from "moment";
import axios from "axios";

let _store = {
  menuVisible: false,
  navItems: getSidebarNavItems(),
  isLogin: false,
  login_loading: false,
  register_loading: false,
  userGranted: false,
  token: "",
  loginInfo: {},
  user: {},
  checking_token: false,
  uploading_file: false,
  getting_updload_files: false,
  forget_is_requesting: false,
  login_in_progress: false
};

class Store extends EventEmitter {
  constructor() {
    super();

    this.registerToActions = this.registerToActions.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.loginUser = this.loginUser.bind(this);
    this.isAuthorized = this.isAuthorized.bind(this);
    Dispatcher.register(this.registerToActions.bind(this));
  }

  get_Store() {
    return _store;
  }

  registerToActions({ actionType, payload }) {
    switch (actionType) {
      case Constants.TOGGLE_SIDEBAR:
        this.toggleSidebar();
        break;
      case Constants.REGISTER_USER:
        this.registerUser(payload);
        break;
      case Constants.LOAD_PLANS:
        this.loadPlans();
        break;
      case Constants.LOGIN_USER:
        if (!_store.login_in_progress) this.loginUser(payload);
        break;
      case Constants.CHECK_TOKEN:
        if (!_store.checking_token) {
          //for prevent multiple checking on render()
          this.checkToken();
        }
        break;
      case Constants.LOAD_USER_PROFILE:
        this.checkToken();
        break;
      case Constants.UPDATE_USER_PROFILE:
        this.updateUserProfile(payload);
        break;
      case Constants.LOAD_COMPANY_PROFILE:
        this.loadCompanyProfile();
        break;
      case Constants.UPDATE_COMPANY_PROFILE:
        this.updateCompanyProfile(payload);
        break;

      case Constants.UPLOAD_FILE:
        if (!_store.uploading_file) this.uploadFile(payload);
        break;

      case Constants.GET_UPLOADED_FILES:
        if (!_store.getting_updload_files) {
          this.getUploadFilesList();
        }
        break;
      case Constants.DOWNLOAD_FILE:
        this.downloadFile(payload);
        break;
      case Constants.CONTINUE_CONVERT:
        this.continueConvert(payload);
        break;
      case Constants.GET_REPORT:
        this.getReport();
        break;
      case Constants.API_SEND_FORGET_PASSWROD_CODE:
        if (!_store.forget_is_requesting) this.sendCode(payload);
        break;
      case Constants.API_SEND_FORGET_PASSWROD_EMAIL:
        if (!_store.forget_is_requesting) this.sendEmail(payload);
        break;
      case Constants.API_SEND_FORGET_PASSWROD_NEW_PASSWORD:
        if (!_store.forget_is_requesting) this.sendNewPassword(payload);
        break;
      default:
    }
  }

  isAuthorized = () => {
    let token = localStorage.getItem("token");
    if (token == undefined) {
      return false;
    } else {
      return true;
    }
  };

  toggleSidebar() {
    _store.menuVisible = !_store.menuVisible;
    this.emit(Constants.CHANGE);
  }

  getMenuState() {
    return _store.menuVisible;
  }

  getSidebarItems() {
    return _store.navItems;
  }

  addChangeListener(callback) {
    this.on(Constants.CHANGE, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(Constants.CHANGE, callback);
  }

  loginUser(payload) {
    _store.login = payload;
    this.emit(Constants.LOGIN_LOADING);
    let that = this;
    _store.login_in_progress = true;
    axios
      .post(Constants.url + "/login", payload)
      .then(function(response) {
        let { token, user, company } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("company", JSON.stringify(company));
        _store.userGranted = true;
        _store.login_in_progress = false;
        that.emit(Constants.DONE_LOGIN);
      })
      .catch(function(error) {
        console.log(error);
        _store.userGranted = false;
        _store.login_in_progress = false;
        that.emit(Constants.PROBLEM_LOGIN, error);
      });
  }

  registerUser(payload) {
    _store.loginInfo = payload;
    this.emit(Constants.REGISTER_LOADING);
    let that = this;
    axios
      .post(Constants.url + "/signup", payload)
      .then(function(response) {
        let { token, user, company } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("company", JSON.stringify(company));
        _store.userGranted = true;
        that.emit(Constants.DONE_REGISTER);
      })
      .catch(function(error) {
        console.log(error);
        _store.userGranted = false;
        let data =
          error.response && error.response.data
            ? error.response.data
            : { message: "Timeout" };
        that.emit(Constants.PROBLEM_REGISTER, data);
      });
  }

  loadPlans() {
    this.emit(Constants.PLAN_LOADING);
    let that = this;
    axios
      .get(Constants.url + "/plan")
      .then(function(response) {
        that.emit(Constants.DONE_LOAD_PLAN, response.data);
      })
      .catch(function(error) {
        that.emit(Constants.PROBLEM_LOAD_PLAN, error);
      });
  }

  checkToken = () => {
    _store.checking_token = true;
    let token = localStorage.getItem("token");
    if (token == undefined) {
      console.log("token not defined");
      this.emit(Constants.TOKEN_IS_NOT_OK);
    } else {
      let uid = JSON.parse(localStorage.getItem("user"))._id;
      let that = this;
      axios
        .get(Constants.url + "/user/" + uid + "/profile", {
          headers: {
            Authorization: token
          }
        })
        .then(function(response) {
          _store.userGranted = true;
          that.emit(Constants.TOKEN_IS_OK);
          that.emit(Constants.DONE_LOAD_USER_PROFILE, response.data);
        })
        .catch(function(error) {
          console.log(error);
          _store.userGranted = false;
          that.emit(Constants.TOKEN_IS_NOT_OK, error);
          that.emit(Constants.PROBLEM_LOAD_USER_PROFILE, error);
        });
    }
  };

  updateUserProfile(payload) {
    let token = localStorage.getItem("token");
    if (token === undefined) {
      console.log("token not defined");
      this.emit(Constants.TOKEN_IS_NOT_OK);
    } else {
      let uid = JSON.parse(localStorage.getItem("user"))._id;
      let that = this;
      axios
        .patch(`${Constants.url}/user/${uid}/profile`, payload, {
          headers: {
            Authorization: token
          }
        })
        .then(function(response) {
          that.emit(Constants.DONE_UPDATE_USER_PROFILE);
        })
        .catch(function(error) {
          that.emit(Constants.TOKEN_IS_NOT_OK);
          that.emit(Constants.PROBLEM_UPDATE_USER_PROFILE, error);
        });
    }
  }

  downloadFile(payload) {
    let { name, id } = payload;
    let token = localStorage.getItem("token");
    if (token === undefined) {
      this.emit(Constants.TOKEN_IS_NOT_OK);
    } else {
      let that = this;
      axios
        .get(`${Constants.url}/file/${id}`, {
          headers: {
            Authorization: token
          }
        })
        .then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute(
            "download",
            `${name}-${moment().format("YYYY/MM/DD HH:mm")}.csv`
          ); //or any other extension
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch(function(error) {
          that.emit(Constants.TOKEN_IS_NOT_OK);
        });
    }
  }

  updateCompanyProfile(payload) {
    let token = localStorage.getItem("token");
    if (token === undefined) {
      console.log("token not defined");
      this.emit(Constants.TOKEN_IS_NOT_OK);
    } else {
      let cid = JSON.parse(localStorage.getItem("company"))._id;
      let that = this;
      axios
        .patch(`${Constants.url}/company/${cid}/profile`, payload, {
          headers: {
            Authorization: token
          }
        })
        .then(function(response) {
          that.emit(Constants.DONE_UPDATE_COMPANY_PROFILE);
        })
        .catch(function(error) {
          that.emit(Constants.TOKEN_IS_NOT_OK);
          that.emit(Constants.PROBLEM_UPDATE_COMPANY_PROFILE, error);
        });
    }
  }

  loadCompanyProfile() {
    let token = localStorage.getItem("token");
    if (token === undefined) {
      console.log("token not defined");
      this.emit(Constants.TOKEN_IS_NOT_OK);
    } else {
      let cid = JSON.parse(localStorage.getItem("company"))._id;
      let that = this;
      axios
        .get(`${Constants.url}/company/${cid}/profile`, {
          headers: {
            Authorization: token
          }
        })
        .then(function(response) {
          that.emit(Constants.DONE_LOAD_COMPANY_PROFILE, response.data);
        })
        .catch(function(error) {
          that.emit(Constants.TOKEN_IS_NOT_OK);
          that.emit(Constants.PROBLEM_LOAD_COMPANY_PROFILE, error);
        });
    }
  }

  getReport() {
    let token = localStorage.getItem("token");
    if (token === undefined) {
      console.log("token not defined");
      this.emit(Constants.TOKEN_IS_NOT_OK);
    } else {
      let cid = JSON.parse(localStorage.getItem("company"))._id;
      let that = this;
      axios
        .get(`${Constants.url}/company/${cid}/report`, {
          headers: {
            Authorization: token
          }
        })
        .then(function(response) {
          that.emit(Constants.GET_REPORT_SUCCESS, response.data);
        })
        .catch(function(error) {
          that.emit(Constants.TOKEN_IS_NOT_OK);
          that.emit(Constants.GET_REPORT_ERROR, error);
        });
    }
  }

  continueConvert(payload) {
    let { id, code } = payload;
    let token = localStorage.getItem("token");
    if (token === undefined) {
      console.log("token not defined");
      this.emit(Constants.TOKEN_IS_NOT_OK);
    } else {
      let cid = JSON.parse(localStorage.getItem("company"))._id;
      let that = this;
      axios
        .put(
          `${Constants.url}/company/${cid}/convert/${id}/xerocode`,
          {
            code
          },
          {
            headers: {
              Authorization: token
            }
          }
        )
        .then(function(response) {
          that.emit(Constants.CONTINUE_CONVERT_DONE);
        })
        .catch(function(error) {
          let data =
            error.response && error.response.data
              ? error.response.data
              : { message: "Timeout" };
          that.emit(Constants.TOKEN_IS_NOT_OK);
          that.emit(Constants.CONTINUE_CONVERT_ERROR, { ...data, id });
        });
    }
  }

  uploadFile = file => {
    _store.uploading_file = true;
    let token = localStorage.getItem("token");
    if (token === undefined) {
      console.log("token not defined");
      this.emit(Constants.UPLOAD_FILE_CAN_NOT_BE_STARTED);
    } else {
      let data = new FormData();
      data.append("file", file);
      let cid = JSON.parse(localStorage.getItem("company"))._id;
      let that = this;
      axios
        .post(`${Constants.url}/company/${cid}/convert`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token
          }
        })
        .then(function(response) {
          _store.uploading_file = false;
          that.emit(Constants.UPLOAD_FILE_SUCCESS, response.data);
        })
        .catch(function(error) {
          let data =
            error.response && error.response.data
              ? error.response.data
              : { message: "Timeout" };
          _store.uploading_file = false;
          that.emit(Constants.UPLOAD_FILE_FAIL, {
            ...data,
            status: error.response ? error.response.status : 504
          });
        });
    }
  };

  getUploadFilesList = () => {
    _store.getting_updload_files = true;
    let token = localStorage.getItem("token");
    if (token === undefined) {
      this.emit(Constants.TOKEN_IS_NOT_OK);
    } else {
      let cid = JSON.parse(localStorage.getItem("company"))._id;
      let that = this;
      axios
        .get(`${Constants.url}/company/${cid}/convert`, {
          headers: {
            Authorization: token
          }
        })
        .then(function(response) {
          // console.log(response);
          //store user profile if request for checking token was ok
          _store.getting_updload_files = false;
          that.emit(Constants.UPLOAD_FILES_LIST_SUCCESS, response.data);
        })
        .catch(function(error) {
          console.log(error);
          _store.getting_updload_files = false;
          that.emit(Constants.UPLOAD_FILES_LIST_FAIL, error);
        });
    }
  };

  sendEmail = payload => {
    let that = this;
    console.log("requested");
    _store.forget_is_requesting = true;
    let data = { username: payload.email };
    axios
      .post(Constants.url + "/forgottenPassword", data)
      .then(function(response) {
        _store.forget_is_requesting = false;
        console.log("success");
        that.emit(Constants.SENT_EMAIL_SUCCESS);
      })
      .catch(function(error) {
        console.log(error);
        _store.forget_is_requesting = false;
        // that.emit(Constants.SENT_EMAIL_SUCCESS);
        that.emit(Constants.SENT_EMAIL_FAIL, error);
      });
  };

  sendCode = payload => {
    let that = this;
    _store.forget_is_requesting = true;
    let data = {
      username: payload.email,
      resetToken: payload.code
    };
    axios
      .put(Constants.url + "/validateResetPasswordCode", data)
      .then(function(response) {
        _store.forget_is_requesting = false;
        that.emit(Constants.VERIFICATION_CODE_SUCCESS);
      })
      .catch(function(error) {
        console.log(error);
        _store.forget_is_requesting = false;
        // that.emit(Constants.VERIFICATION_CODE_SUCCESS);
        that.emit(Constants.VERIFICATION_CODE_FAILED, error);
      });
  };

  sendNewPassword = payload => {
    let that = this;
    _store.forget_is_requesting = true;
    let data = {
      username: payload.email,
      resetToken: payload.code,
      newPassword: payload.password
    };
    axios
      .put(Constants.url + "/resetPassword", data)
      .then(function(response) {
        _store.forget_is_requesting = true;
        that.emit(Constants.CHANGE_PASSWORD_SUCCESS);
      })
      .catch(function(error) {
        console.log(error);
        _store.forget_is_requesting = true;
        // that.emit(Constants.CHANGE_PASSWORD_SUCCESS);
        that.emit(Constants.CHANGE_PASSWORD_FAILED, error);
      });
  };
}

export default new Store();
