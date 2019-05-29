import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardHeader,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Form,
  FormInput,
  Button
} from "shards-react";
import { BounceLoader } from "react-spinners";
import { Redirect } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Store, Dispatcher, Constants } from "../../flux";
import Loading from "./Loading";
import CustomAlert from "../common/CustomAlert";
import MyFormInput from "../common/MyFormInput";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      payload: {},
      loginGranted: false,
      username: "",
      password: "",
      tokenChecked: undefined,
      tokenIsValid: false,
      showSuccess: false,
      showErrorAlert: false,
      isAlertError: false,
      alertMessage: "",

      redirect: false
    };

    this.toggleSpinner = this.toggleSpinner.bind(this);
    this.grant = this.grant.bind(this);
    this.sendLoginRequest = this.sendLoginRequest.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.updateUsername = this.updateUsername.bind(this);
    this.updateTokenIsNotOk = this.updateTokenIsNotOk.bind(this);
    this.updateTokenIsOk = this.updateTokenIsOk.bind(this);
    this.loginDone = this.loginDone.bind(this);
    this.problemInLogin = this.problemInLogin.bind(this);
    this.dismissAlert = this.dismissAlert.bind(this);

    //listerns on Store events
    Store.on(Constants.TOKEN_IS_NOT_OK, this.updateTokenIsNotOk);
    Store.on(Constants.TOKEN_IS_OK, this.updateTokenIsOk);
    Store.on(Constants.DONE_LOGIN, this.loginDone);
    Store.on(Constants.PROBLEM_LOGIN, this.problemInLogin);
  }

  dismissAlert() {
    this.setState({
      showSuccess: false,
      isAlertError: false
    });
  }

  componentWillMount() {
    let _store = Store.get_Store();
    if (_store.checking_token == false)
      Dispatcher.dispatch({ actionType: Constants.CHECK_TOKEN });
  }

  componentDidMount() {
    if (
      this.props.location.state &&
      this.props.location.state.status === "changed_password"
    ) {
      this.setState({
        showSuccess: true,
        showErrorAlert: false,
        isAlertError: false,
        alertMessage: "Password Changed Successfully"
      });
      //
    }
  }

  problemInLogin(error) {
    console.log(error);
    this.setState({ loading: false });
    if (error.response && error.response.data) {
      console.log("in data ");
      this.setState({
        showSuccess: true,
        showErrorAlert: true,
        isAlertError: true,
        alertMessage: error.response.data.message
      });
    }
    // toast.error();
  }

  loginDone() {
    this.setState({ loginGranted: true });
  }

  updateTokenIsNotOk() {
    this.setState({ tokenChecked: true, tokenIsValid: false });
  }

  updateTokenIsOk() {
    this.setState({ tokenChecked: true, tokenIsValid: true });
  }

  updatePassword = evt => {
    this.setState({ password: evt.target.value });
  };

  updateUsername = evt => {
    this.setState({ username: evt.target.value });
  };

  sendLoginRequest() {
    if (this.state.username === undefined || this.state.username === "") {
      // toast.error("Please Enter Username");
      this.setState({
        loading: false,
        showSuccess: true,
        isAlertError: true,
        alertMessage: "Please Enter Username"
      });
      return;
    }

    if (this.state.password === undefined || this.state.password === "") {
      this.setState({
        loading: false,
        showSuccess: true,
        isAlertError: true,
        alertMessage: "Please Enter Password"
      });
      // toast.error("Please Enter Password");
      return;
    }
    // console.log("in send request");
    this.setState({ loading: true });
    Dispatcher.dispatch({
      actionType: Constants.LOGIN_USER,
      payload: {
        username: this.state.username,
        password: this.state.password
      }
    });

    // Store.
  }

  notify = () => toast("Wow so easy !");

  grant() {
    this.setState({ loginGranted: true });
  }

  toggleSpinner() {
    this.setState({ loading: !this.state.loading });
    setTimeout(this.grant, 5000);
  }

  handleOnClick = () => {
    console.log(this);
    this.setState({ redirect: true });
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to="/register" />;
    }

    if (this.state.tokenChecked === false) {
      return <Loading />;
    }

    if (
      (this.state.tokenIsValid === true && this.state.tokenChecked === true) ||
      this.state.loginGranted
    ) {
      return <Redirect to="/xero_converter" />;
    }

    return (
      <div>
        <Card small className="mb-4">
          <CardHeader className="border-bottom">
            <h6 className="m-auto text-center">Welcome back!</h6>
          </CardHeader>
          <ListGroup flush>
            <ListGroupItem className="p-3">
              <Row>
                <Col>
                  <CustomAlert
                    dismissAlert={this.dismissAlert}
                    show={this.state.showSuccess}
                    error={this.state.isAlertError}
                    message={this.state.alertMessage}
                    autoHide={true}
                    time={8000}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Row>
                    {/* Email */}
                    <Col md="12" className="form-group">
                      <MyFormInput
                        required={true}
                        validate={{ required: true }}
                        type="text"
                        id="feUsername"
                        label="Email"
                        placeholder="seiera1992@profeed.com"
                        value={this.state.username}
                        onChange={this.updateUsername}
                      />
                    </Col>
                    {/* Password */}
                    <Col md="12" className="form-group">
                      <MyFormInput
                        required={true}
                        validate={{ required: true }}
                        type="password"
                        id="fePassword"
                        placeholder="Password"
                        value={this.state.password}
                        onChange={this.updatePassword}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12} className="justify-content-center text-center">
                      <Button
                        style={{ cursor: "pointer" }}
                        onClick={this.sendLoginRequest}
                        theme="accent"
                        className="btn-block pr-4 pl-4"
                      >
                        <span style={{ fontWeight: "bold", fontSize: "14px" }}>
                          Sign in to your account
                        </span>
                      </Button>
                    </Col>
                    <Col
                      md="12"
                      className="mt-2 text-center justify-content-center align-items-center"
                    >
                      <div style={{ margin: "auto", width: "10%" }}>
                        <BounceLoader
                          sizeUnit={"px"}
                          size={30}
                          color={"#007bff"}
                          loading={this.state.loading}
                        />
                      </div>
                    </Col>

                    <Col lg={12} className="text-center mt-1">
                      <a
                        className="ml-1"
                        style={{ fontSize: "14px" }}
                        href="/forgetpassword"
                      >
                        Forget your password?
                      </a>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </ListGroupItem>
          </ListGroup>
        </Card>
        <div className="text-center px-6">
          Don't have an account?{" "}
          {/* <a className="ml-1" href="/register">
            Sign up
          </a> */}
          <a className="ml-1" onClick={this.handleOnClick} href="#">
            Sign up
          </a>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  /**
   * The component's title.
   */
  title: PropTypes.string
};

/* Login.defaultProps = {
  title: "Account Details"
};  */

export default Login;
