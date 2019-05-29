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
  FormGroup,
  FormInput,
  FormSelect,
  FormTextarea,
  Button
} from "shards-react";
import { Store, Dispatcher, Constants } from "./../../flux";
import { ToastContainer, toast } from "react-toastify";
import { BounceLoader } from "react-spinners";
import CustomAlert from '../common/CustomAlert';

class UserAccountDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      showAlert:false,
      alertMessage:"this is alert message",
      isErrorAlert:false,
      company: { activePlan: {} },
      config: {
        appType: "public",
        consumerKey: "",
        consumerSecret: "",
        number: ""
      }
    };
    this.loadCompanyProfileDone = this.loadCompanyProfileDone.bind(this);
    this.sendUpdateProfileRequest = this.sendUpdateProfileRequest.bind(this);
    this.problemInCompanyProfile = this.problemInCompanyProfile.bind(this);
    this.updateCompanyProfileDone = this.updateCompanyProfileDone.bind(this);

    Store.on(Constants.DONE_LOAD_COMPANY_PROFILE, this.loadCompanyProfileDone);
    Store.on(
      Constants.PROBLEM_LOAD_COMPANY_PROFILE,
      this.problemInCompanyProfile
    );
    Store.on(
      Constants.DONE_UPDATE_COMPANY_PROFILE,
      this.updateCompanyProfileDone
    );
    Store.on(
      Constants.PROBLEM_UPDATE_COMPANY_PROFILE,
      this.problemInCompanyProfile
    );

    Dispatcher.dispatch({
      actionType: Constants.LOAD_COMPANY_PROFILE
    });
  }

  sendUpdateProfileRequest() {
    const { consumerKey, consumerSecret } = this.state.config;
    let appType = "public";
    const { number } = this.state.config;

    if (
      consumerKey === undefined ||
      consumerKey === "" ||
      consumerSecret === undefined ||
      consumerSecret === "" ||
      appType === undefined ||
      appType === "" ||
      number === undefined ||
      number === ""
    ) {
      console.log("fill");
      toast.warn("Please fill all require fields ");
      this.setState({ loading: false });
      return;
    }
    this.setState({ loading: true });
    Dispatcher.dispatch({
      actionType: Constants.UPDATE_COMPANY_PROFILE,
      payload: {
        xero: { consumerKey, consumerSecret, appType },
        nids: { number }
      }
    });
  }

  problemInCompanyProfile(err) {
    this.setState({
      loading: false
    });
    toast.error(err.message);
  }

  updateCompanyProfileDone() {
    this.setState({
      loading: false,
      showAlert:true
    });
    // toast.success("Update Success");
    Dispatcher.dispatch({
      actionType: Constants.LOAD_COMPANY_PROFILE
    });
  }

  loadCompanyProfileDone(company) {
    if (!company.config) {
      company.config = {
        xero: {},
        nids: {}
      };
    }
    this.setState({
      loading: false,
      company,
      config: { ...company.config.xero, ...company.config.nids }
    });
  }
  render() {
    const { company } = this.state;
    return (
      <Card small className="mb-4">
        <CardHeader className="border-bottom">
          <h6 className="m-0">Setting</h6>
          <CustomAlert
                                        dimissAlert={this.dismissAlert}
                                        show={this.state.showAlert}
                                        error={this.state.isErrorAlert}
                                        message={this.state.alertMessage}
                                        autoHide={true}
                                        time={5000}
                                    />
        </CardHeader>
        <ListGroup flush>
          <ListGroupItem className="p-3">
            <Row>
              <Col>
                <Form>
                  <Row>
                    {" "}
                    <Col md="6" className="form-group">
                      <label htmlFor="feCompanyInfo">{`Your Subscription Plan: ${
                        company.activePlan.name
                      }`}</label>
                    </Col>
                    <Col md="6" className="form-group">
                      <label htmlFor="feCompanyInfo">{`Active Until:     ${
                        company.activePlan.activeUntil
                      }`}</label>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
          </ListGroupItem>
          <ListGroupItem className="p-3">
            <Row>
              <Col>
                <Form>
                  <Row>
                    {" "}
                    <Col md="6" className="form-group">
                      <label htmlFor="feXero">Xero:</label>
                    </Col>
                  </Row>
                  <Row>
                    {/* AppType */}
                    <Col md="4" className="form-group">
                      <label htmlFor="feAppType">AppType*</label>
                      <FormSelect id="fePlan" value="public">
                        <option value="public">"Public"</option>
                      </FormSelect>
                    </Col>

                    {/* consumerKey */}
                    <Col md="4" className="form-group">
                      <label htmlFor="feConsumerKey">consumerKey*</label>
                      <FormInput
                        id="feConsumerKey"
                        placeholder="consumerKey"
                        value={this.state.config.consumerKey}
                        onChange={evt => {
                          this.setState({
                            config: {
                              ...this.state.config,
                              consumerKey: evt.target.value
                            }
                          });
                        }}
                      />
                    </Col>
                    {/* consumerSecret */}
                    <Col md="4" className="form-group">
                      <label htmlFor="feConsumerSecret">consumerSecret*</label>
                      <FormInput
                        id="feConsumerSecret"
                        placeholder="consumerSecret"
                        value={this.state.config.consumerSecret}
                        onChange={evt => {
                          this.setState({
                            config: {
                              ...this.state.config,
                              consumerSecret: evt.target.value
                            }
                          });
                        }}
                      />
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
          </ListGroupItem>
          <ListGroupItem>
            <Row>
              {" "}
              <Col md="6" className="form-group">
                <label htmlFor="feXero">NDIS:</label>
              </Col>
            </Row>
            <Row>
              {/* consumerSecret */}
              <Col md="4" className="form-group">
                <label htmlFor="feRegistrationNumber">
                  Registration Number*
                </label>
                <FormInput
                  id="feRegistrationNumber"
                  placeholder="Registration Number"
                  value={this.state.config.number}
                  onChange={evt => {
                    this.setState({
                      config: {
                        ...this.state.config,
                        number: evt.target.value
                      }
                    });
                  }}
                />
              </Col>
            </Row>
          </ListGroupItem>
          <ListGroupItem>
            <ListGroupItem className="p-4" />
            <ToastContainer/>
            {this.state.loading ? (
              <div style={{ margin: "auto", width: "10%" }}>
                <BounceLoader
                  sizeUnit={"px"}
                  size={30}
                  color={"#007bff"}
                  loading={this.state.loading}
                />
              </div>
            ) : (
              <Button
                onClick={this.sendUpdateProfileRequest}
                theme="accent"
              >
                Update Setting
              </Button>
            )}
          </ListGroupItem>
        </ListGroup>
      </Card>
    );
  }
}

UserAccountDetails.propTypes = {
  /**
   * The component's title.
   */
  title: PropTypes.string
};

UserAccountDetails.defaultProps = {
  title: "Account Details"
};

export default UserAccountDetails;
