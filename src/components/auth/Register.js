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
  FormSelect,
  Button
} from "shards-react";

import { BounceLoader } from "react-spinners";
import { Redirect } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Store, Dispatcher, Constants } from "../../flux";
import CustomAlert from '../common/CustomAlert';
import MyFormInput from '../common/MyFormInput';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      username: "",
      payload: {
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        company: ""
      },
      loginGranted: false,
      plans: [],
      showSuccess:false,
      showErrorAlert:false,
      isAlertError:false,
      alertMessage:''
    };

    this.toggleSpinner = this.toggleSpinner.bind(this);
    this.grant = this.grant.bind(this);
    this.sendRegisterRequest = this.sendRegisterRequest.bind(this);
    this.updateFirstname = this.updateFirstname.bind(this);
    this.updateLastname = this.updateLastname.bind(this);
    this.updateUsername = this.updateUsername.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.updateCompany = this.updateCompany.bind(this);

    this.registerDone = this.registerDone.bind(this);
    this.problemInRegister = this.problemInRegister.bind(this);
    this.loadPlanDone = this.loadPlanDone.bind(this);
    this.problemInLoadPlans = this.problemInLoadPlans.bind(this);
    this.dismissAlert = this.dismissAlert.bind(this);

    Store.on(Constants.DONE_REGISTER, this.registerDone);
    Store.on(Constants.PROBLEM_REGISTER, this.problemInRegister);
    Store.on(Constants.DONE_LOAD_PLAN, this.loadPlanDone);
    Store.on(Constants.PROBLEM_LOAD_PLAN, this.problemInLoadPlans);

    Dispatcher.dispatch({
      actionType: Constants.LOAD_PLANS
    });
  }

    
  dismissAlert(){
    this.setState({
      showSuccess:false,
      isAlertError:false
    })
  }

  

  problemInRegister(error) {
    this.setState({
      loading: false ,
      showSuccess:true,
      showErrorAlert:true,
      isAlertError:true,
      alertMessage:error.message
    });
    // toast.error();
  }

  registerDone() {
    this.setState({ loginGranted: true });
  }

  problemInLoadPlans() {}

  loadPlanDone(plans) {
    this.setState({ loading: false });
    console.log(plans);
    this.setState({
      plans,
      payload: { ...this.state.payload, plan: plans[0]._id }
    });
  }

  updateFirstname = evt => {
    this.setState({
      payload: { ...this.state.payload, firstName: evt.target.value }
    });
  };

  updateLastname = evt => {
    this.setState({
      payload: { ...this.state.payload, lastName: evt.target.value }
    });
  };

  updateUsername = evt => {
    this.setState({
      payload: { ...this.state.payload, username: evt.target.value }
    });
  };

  updatePassword = evt => {
    this.setState({
      payload: { ...this.state.payload, password: evt.target.value }
    });
  };

  updateCompany = evt => {
    this.setState({
      payload: { ...this.state.payload, company: evt.target.value }
    });
  };

  updatePlan = evt => {
    this.setState({
      payload: { ...this.state.payload, plan: evt.target.value }
    });
  };

  toggleSpinner() {
    this.setState({ loading: !this.state.loading });
    setTimeout(this.grant, 5000);
  }

  grant() {
    this.setState({ loginGranted: true });
  }

  sendRegisterRequest() {
    
    if (
      this.state.payload.username === undefined ||
      this.state.payload.username === "" ||
      this.state.payload.password === undefined ||
      this.state.payload.password === "" ||
      this.state.payload.company === undefined ||
      this.state.payload.company === "" ||
      this.state.payload.plan === undefined ||
      this.state.payload.plan === ""
    ) {
      // console.log("fill");
      this.setState({
        loading: false ,
        showSuccess:true,
        showErrorAlert:true,
        isAlertError:true,
        alertMessage:"Please fill all require fields"
      });
      // toast.warn(" ");
      // this.setState({ loading: false });
      return;
    }

    this.setState({ loading: true });
    Dispatcher.dispatch({
      actionType: Constants.REGISTER_USER,
      payload: { ...this.state.payload }
    });

    // Store.
  }

  render() {
    if (this.state.loginGranted) {
      return <Redirect to="/xero_converter" />;
    }
    let {plans} = this.state
    return (
      <div>
        <Card small className="mb-4">
          <CardHeader className="border-bottom text-center">
            <h6 className="m-0">Sign up to Profeed</h6>
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
                  <Form>
                    <Row form>
                      {/* First Name */}
                      <Col md="6" className="form-group">
                        <label htmlFor="feFirstName">First Name</label>
                        <FormInput
                          id="feFirstName"
                          placeholder="Sierra"
                          value={this.state.payload.firstName}
                          onChange={this.updateFirstname}
                        />
                      </Col>
                      {/* Last Name */}
                      <Col md="6" className="form-group">
                        <label htmlFor="feLastName">Last Name</label>
                        <FormInput
                          id="feLastName"
                          placeholder="Brooks"
                          value={this.state.payload.lastName}
                          onChange={this.updateLastname}
                        />
                      </Col>
                    </Row>

                    <Row form>
                      {/* Email */}
                      <Col md="6" className="form-group">
                        <MyFormInput
                          required={true}
                          type="email"
                          validate={{required:true}}
                          id="feEmail"
                          label="Email"
                          placeholder="seira1992@profeed.com"
                          value={this.state.payload.username}
                          onChange={this.updateUsername}
                        />
                      </Col>
                      {/* Password */}
                      <Col md="6" className="form-group">
                        <MyFormInput
                          required={true}
                          type="password"
                          validate={{required:true}}
                          id="fePassword"
                          placeholder="Password"
                          value={this.state.payload.password}
                          onChange={this.updatePassword}
                        />
                      </Col>
                    </Row>
                    <Row form>
                      {/* Company */}
                      <Col md="6" className="form-group">
                        <MyFormInput
                          required={true}
                          validate={{required:true}}
                          type="text"
                          id="feCompany"
                          label="Company Name"
                          placeholder="My Company LLC"
                          value={this.state.payload.company}
                          onChange={this.updateCompany}
                        />
                      </Col>
                      {/* Plan */}
                      <Col md="6" className="form-group">
                        <label>Plan*</label>
                        <FormSelect
                          id="fePlan"
                          value={this.state.payload.plan}
                          onChange={this.updatePlan}
                        >
                          {plans.map((plan, index) => 
                            <option value={plan._id}>
                              {plan.name}
                            </option>
                          )}
                        </FormSelect>
                      </Col>
                    </Row>
                    <Row form>
                      {/* Description */}
                      <Col md="12" className="text-center">
                        <Button
                          onClick={this.sendRegisterRequest}
                          className="btn-block"
                          theme="accent"
                        >
                          <span style={{fontWeight:'bold',fontSize:'14px'}}>
                            Create new account
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
                      
                    </Row>
                  </Form>
                </Col>
              </Row>
            </ListGroupItem>
          </ListGroup>
          <ToastContainer />
        </Card>
        <div className="text-center mt-3">
        Back to{" "}
        <a className="m-0" href="/login">
          Sign in
        </a>
      
      </div>
      </div>
    );
  }
}
Register.propTypes = {
  loading: PropTypes.bool
};

Register.defaultProps = {
  loading: false
};

export default Register;
