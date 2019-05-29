import React from "react";
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
import { ToastContainer, toast } from "react-toastify";
import CustomAlert from '../../common/CustomAlert';
import { Store, Dispatcher, Constants } from "../../../flux";
import { Redirect } from "react-router-dom";

class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectLogin:false,
      pswd:"",
      disable:true,
      showSuccess:false,
      isAlertError:false,
      alertMessage:'',
      password:'',
      loading:false,
      error:false,
      errorMessage:undefined
    }
    this.updateRePassword = this.updateRePassword.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.dismissAlert = this.dismissAlert.bind(this);
    this.sendNewPassword = this.sendNewPassword.bind(this);
    this.changePasswordSuccess = this.changePasswordSuccess.bind(this);
    this.changePasswordFailed = this.changePasswordFailed.bind(this);
    this.getParameterByName = this.getParameterByName.bind(this);
    Store.on(Constants.CHANGE_PASSWORD_SUCCESS,this.changePasswordSuccess);
    Store.on(Constants.CHANGE_PASSWORD_FAILED,this.changePasswordFailed);
  }

  
  dismissAlert(){
    this.setState({
      showSuccess:false,
      isAlertError:false
    })
  }

  

  updatePassword(evt){
    let pass = evt.target.value;
    if(this.state.pswd == pass){
        this.setState({disable:false})
    }
    else{
      this.setState({disable:true})
    }
    this.setState({password:pass});
  }

  getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  updateRePassword(evt){
      let repass = evt.target.value;
      this.setState({pswd:repass});
      if(repass==this.state.password){
          this.setState({disable:false})
      }
      else{
        this.setState({disable:true})
      }
  }

  sendNewPassword(){
    let username = this.getParameterByName('username');
    let code = this.getParameterByName('code');
    console.log(username,"   ",code,"  ",this.state.password);
    this.setState({
        loading:true,
        error:false,
        errorMessage:undefined
    });
    Dispatcher.dispatch({
        actionType:Constants.API_SEND_FORGET_PASSWROD_NEW_PASSWORD
        ,payload:{
            email:username,
            code:code,
            password:this.state.password
        }
    });
  }


  changePasswordFailed(error){
    let passwordError = undefined;
    if(error && error.response && error.response.data){
        if(error.response.data.message){
            passwordError = error.response.data.message;
        }
        else{
            passwordError =  `error code ${error.response.status}`;
        } 
    }
        
    this.setState({
        loading:false,
        error:true,
        errorMessage:passwordError,
    });
  }

  changePasswordSuccess(){
      // toast.success("Changed Password Successfully");
      this.setState({
          errorMessage:undefined,
          error:false,
          loading:false,
          redirectLogin:true
      });
  }
    
  render(){
    if(this.state.redirectLogin){
      return (<Redirect to={{
        pathname: '/login',
        state: { status: 'changed_password' }
      }}
      />);
    }
    
    return(
        <Card small className="mb-4">
        <CardHeader className="border-bottom">
          <h6 className="m-auto text-center">Change Password </h6>
        </CardHeader>
        <ListGroup flush>
          <ListGroupItem className="p-3">  
            <Row>
              <Col>
                <CustomAlert
                  dismissAlert={this.dismissAlert}
                  show={this.state.error}
                  error={this.state.error}
                  message={this.state.errorMessage}
                  autoHide={true}
                  time={8000}
                />
              </Col>
            </Row>
        
            <Row>
              <Col>
                  <Row>
                    {/* Email */}
                    <Col lg="12" md="12" className="form-group">
                      <label htmlFor="fePassword">Password</label>
                      <FormInput
                        type="password"
                        id="fePassword"
                        placeholder="password"
                        value={this.state.password}
                        onChange={this.updatePassword}
                      />
                    </Col>

                    <Col lg="12" md="12" className="form-group">
                      <label htmlFor="feRePassword">Repeat Password</label>
                      <FormInput
                        type="password"
                        id="feRePassword"
                        placeholder="re-password"
                        value={this.state.pswd}
                        onChange={this.updateRePassword}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12} className="justify-content-center text-center">
                      <Button disabled={this.state.disable} style={{cursor:"pointer"}} onClick={this.sendNewPassword} theme="accent" className="btn-block pr-4 pl-4">Submit</Button>
                    </Col>
                    <Col style={{cursor:"pointer"}}  onClick={this.props.preStep} lg={12} className="text-center mt-1"><span  className="ml-1" style={{fontSize:"12px"}} >Back</span></Col>
                    <Col md="12" className="mt-2 text-center justify-content-center align-items-center">
                      <div style={{margin:"auto",width:"10%"}}>
                        <BounceLoader
                          sizeUnit={"px"}
                          size={30}
                          color={'#007bff'}
                          loading={this.state.loading}
                        />
                      </div>
                        
                    </Col>
                  </Row>
              </Col>
            </Row>
          </ListGroupItem>
        </ListGroup>
        <ToastContainer />
      </Card>
    );
  }

}

export default ChangePassword;
