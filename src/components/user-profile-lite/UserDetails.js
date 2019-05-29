import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardHeader,
  Button,
  ListGroup,
  ListGroupItem,
  Progress,
  FormInput,
  Col,
  Form,
  Row
} from "shards-react";
import { Store, Dispatcher, Constants } from "./../../flux";
import { ToastContainer, toast } from "react-toastify";
import { BounceLoader } from "react-spinners";
import Loading from '../auth/Loading';
import MyFormInput from '../common/MyFormInput';
import CustomAlert from '../common/CustomAlert';

class UserDetails extends React.Component {
  
  
  constructor(props) {
    super(props);
    this.state = {
      update_disabled:true,
      loading: true,
      showAlert:false,
      alertMessage:"this is alert message",
      isErrorAlert:false,
      enableUpdateSetting:false,
      userDetails: {
        avatar: require("./../../images/avatars/notPhoto.png"),
        jobTitle: "Owner"
      }
    };
    this.loadUserProfileDone = this.loadUserProfileDone.bind(this);
    this.sendUpdateProfileRequest = this.sendUpdateProfileRequest.bind(this);
    this.problemInUserProfile = this.problemInUserProfile.bind(this);
    this.updateUserProfileDone = this.updateUserProfileDone.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.dismissAlert = this.dismissAlert.bind(this);

    Store.on(Constants.DONE_LOAD_USER_PROFILE, this.loadUserProfileDone);
    Store.on(Constants.PROBLEM_LOAD_USER_PROFILE, this.problemInUserProfile);
    Store.on(Constants.DONE_UPDATE_USER_PROFILE, this.updateUserProfileDone);
    Store.on(Constants.PROBLEM_UPDATE_USER_PROFILE, this.problemInUserProfile);

    Dispatcher.dispatch({
      actionType: Constants.LOAD_USER_PROFILE
    });
  }

  
  dismissAlert(){
    this.setState({
      showAlert:false,
      isErrorAlert:false
    });
  }


  onChangeEmail = evt => {
    this.setState({
      update_disabled:false,
      userDetails: {
        ...this.state.userDetails,
        username: evt.target.value
      }
    });
  }


  componentWillUnmount(){
    Store.removeListener(Constants.DONE_LOAD_USER_PROFILE,this.loadUserProfileDone);
    Store.removeListener(Constants.PROBLEM_LOAD_USER_PROFILE,this.problemInUserProfile);
    Store.removeListener(Constants.DONE_UPDATE_USER_PROFILE,this.updateUserProfileDone);
    Store.removeListener(Constants.PROBLEM_UPDATE_USER_PROFILE,this.problemInUserProfile);
  }

  loadUserProfileDone(userDetails) {
    this.setState({
      loading: false,
      userDetails: {
        ...userDetails,
        avatar: require("./../../images/avatars/notPhoto.png"),
        jobTitle: "Owner"
      }
    });
  }

  updateUserProfileDone() { 
    this.setState({
      update_disabled:true,
      loading: false,
      showAlert:true,
      isErrorAlert:false,
      alertMessage:"Updated user profile successfully"
    });
    // toast.success("Update User Profile Success");
  }
  problemInUserProfile(err) {
    this.setState({
      loading: false,
      showAlert:true,
      isErrorAlert:true,
      alertMessage:err.message
    });
    // toast.error();
  }
  

  sendUpdateProfileRequest() {
    
    if (
      this.state.userDetails.password === undefined ||
      this.state.userDetails.password === ""
    ) {
      //fail alert here
      // toast.warn("Please fill all require fields ");
      this.setState({ loading: false });
      return;
    }
    const { firstName, lastName, password, address, username} = this.state.userDetails;
    this.setState({ loading: true });
    Dispatcher.dispatch({
      actionType: Constants.UPDATE_USER_PROFILE,
      payload: { firstName, lastName, password ,address ,username}
    });
  }
  render() {
    const { userDetails } = this.state;
    if(this.state.loading){
        return (<Card small className="mb-4 pt-3"><Loading/></Card>)
    }
    return (
      <Card small className="mb-4 pt-3">
        <CardHeader className="border-bottom text-center">     
          <div className="mb-3 mx-auto">
            <img
              className="rounded-circle"
              src={userDetails.avatar}
              alt={userDetails.name}
              width="110"
            />
          </div>
          <h4 className="mb-0">{`${userDetails.firstName} ${
            userDetails.lastName
          }`}</h4>
          <span className="text-muted d-block mb-2">
            {userDetails.jobTitle}
          </span>
        </CardHeader>
          
          <ListGroup flush>
          
          <ListGroupItem className="px-4">
            <Row>
              <Col>
                <CustomAlert
                    dismissAlert={this.dismissAlert}
                    show={this.state.showAlert}
                    error={this.state.isErrorAlert}
                    message={this.state.alertMessage}
                    autoHide={true}
                    time={5000}
                />
              </Col>
            </Row>
            <Form>
              <Row className="form-group">
                <Col>
                <Row>
                  <Col>
                    <label htmlFor="feFirstName">Name</label>
                    <FormInput
                      id="feFirstName"
                      placeholder="Name"
                      value={this.state.userDetails.firstName || ""}
                      onChange={evt => {
                        this.setState({
                          update_disabled:false,
                          userDetails: {
                            ...this.state.userDetails,
                            firstName: evt.target.value
                          }
                        });
                      }}
                    />
                  </Col>
                  <Col>
                    <label htmlFor="feLastName">Surename</label>
                    <FormInput
                      id="feLastName"
                      placeholder="Surename"
                      value={this.state.userDetails.lastName || ""}
                      onChange={evt => {
                        this.setState({
                          update_disabled:false,
                          userDetails: {
                            ...this.state.userDetails,
                            lastName: evt.target.value
                          }
                        });
                      }}
                    />
                  </Col>
                  <Col>
                    <label htmlFor="feEmail">Email</label>
                    <FormInput
                      id="feEmail"
                      disabled
                      placeholder="email"
                      value={this.state.userDetails.username || ""}
                      onChange={this.onChangeEmail}
                    />
                  </Col>
                </Row>
                <Row style={{marginTop:"15px"}}>
                  <Col>
                    <label htmlFor="feAddress">Address</label>
                    <FormInput
                      id="feAddress"
                      placeholder="address"
                      value={this.state.userDetails.address || ""}
                      onChange={evt => {
                        this.setState({
                          update_disabled:false,
                          userDetails: {
                            ...this.state.userDetails,
                            address: evt.target.value
                          }
                        });
                      }}
                    />
                  </Col>
                  <Col >
                    
                    {/* <label htmlFor="fePassword">Password <span style={{color:"red"}}>*</span></label> */}
                    <MyFormInput
                      required={true}
                      type="password"
                      id="fePassword"
                      placeholder="Password"
                      validate={{required:true}}
                      value={this.state.userDetails.password || ""}
                      onChange={evt => {
                        this.setState({
                          update_disabled:false,
                          userDetails: {
                            ...this.state.userDetails,
                            password: evt.target.value
                          }
                        });
                      }}
                    />
                  </Col>
                  <Col></Col>
                </Row> 
                </Col>
              </Row>
            </Form>
          </ListGroupItem>
          <ListGroupItem className="p-4">
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
                disabled={this.state.update_disabled}
                onClick={this.sendUpdateProfileRequest}
                theme="accent"
              >
                Update Profile
              </Button>
            )}
            
          </ListGroupItem>
        </ListGroup>

        
        
        {/* <ToastContainer /> */}
      </Card>
    );
  }
}
// UserDetails.propTypes = {
//   /**
//    * The user details object.
//    */
//   userDetails: PropTypes.object
// };

// UserDetails.defaultProps = {
//   userDetails: {
//     name: "Sierra Brooks",
//     avatar: require("./../../images/avatars/0.jpg"),
//     jobTitle: "Project Manager",
//     performanceReportTitle: "Workload",
//     performanceReportValue: 74,
//     metaTitle: "Description",
//     metaValue:
//       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio eaque, quidem, commodi soluta qui quae minima obcaecati quod dolorum sint alias, possimus illum assumenda eligendi cumque?"
//   }
// };

export default UserDetails;
