import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Form,
  FormGroup,
  FormInput,
  Button
} from "shards-react";
import { BounceLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import { Store, Dispatcher, Constants } from "../../../flux";
import { Alert } from 'reactstrap';
import constants from "../../../flux/constants";
import ChangePassword from './ChangePassword';
import SendEmail from './SendEmail';
import VerifyCode from './VerifyCode';
import { Redirect } from "react-router-dom";

class ForgetPasswordLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email:'',
            code:'',
            password:'',
            loading_change_password:false,
            loading_send_email:false,
            loading_verification_code:false,
            exist_error:false,
            showCheckEmail:false,
            error:{
                code:0,
                message:''
            },
            current_step:0,
            tokenChecked:undefined,
            tokenIsValid: false,
            emailError:undefined,
            passwordError:undefined,
            codeError:undefined
        }
        this.sendEmail = this.sendEmail.bind(this);
        this.sendVerificationCode = this.sendVerificationCode.bind(this);
        this.sendNewPassword = this.sendNewPassword.bind(this);
        this.emailSentSuccess = this.emailSentSuccess.bind(this);
        this.emailSentFailed = this.emailSentFailed.bind(this);
        this.verificationCodeSuccess = this.verificationCodeSuccess.bind(this);
        this.verificationCodeFailed = this.verificationCodeFailed.bind(this);
        this.changePasswordSuccess = this.changePasswordSuccess.bind(this);
        this.changePasswordFailed = this.changePasswordFailed.bind(this);
        this.changeEmail = this.changeEmail.bind(this);
        this.updatePassword = this.updatePassword.bind(this);
        this.changeCode = this.changeCode.bind(this);
        this.changeToPreStep = this.changeToPreStep.bind(this);

        this.updateTokenIsNotOk = this.updateTokenIsNotOk.bind(this);
        this.updateTokenIsOk = this.updateTokenIsOk.bind(this);
      

        Store.on(Constants.SENT_EMAIL_SUCCESS,this.emailSentSuccess);
        Store.on(Constants.SENT_EMAIL_FAIL,this.emailSentFailed);
        Store.on(Constants.VERIFICATION_CODE_SUCCESS,this.verificationCodeSuccess);
        Store.on(Constants.VERIFICATION_CODE_FAILED,this.verificationCodeFailed);
        // Store.on(Constants.CHANGE_PASSWORD_SUCCESS,this.changePasswordSuccess);
        // Store.on(Constants.CHANGE_PASSWORD_FAILED,this.changePasswordFailed);

        Store.on(Constants.TOKEN_IS_NOT_OK,this.updateTokenIsNotOk);
        Store.on(Constants.TOKEN_IS_OK,this.updateTokenIsOk);
    }

      
    componentWillMount() {
        let _store = Store.get_Store();
        if(_store.checking_token==false)
            Dispatcher.dispatch({actionType:Constants.CHECK_TOKEN});
    }


    componentWillUnmount(){
        Store.removeListener(Constants.SENT_EMAIL_SUCCESS,this.emailSentSuccess);
        Store.removeListener(Constants.SENT_EMAIL_FAIL,this.emailSentFailed);
        Store.removeListener(Constants.VERIFICATION_CODE_SUCCESS,this.verificationCodeSuccess);
        Store.removeListener(Constants.VERIFICATION_CODE_FAILED,this.verificationCodeFailed);
        Store.removeListener(Constants.CHANGE_PASSWORD_SUCCESS,this.changePasswordFailed);
        Store.removeListener(Constants.CHANGE_PASSWORD_FAILED,this.changePasswordSuccess);
    }

    changeToPreStep(){
        switch(this.state.current_step){
            case 1:
                this.setState({code:''})
                break;
            case 2:
                this.setState({password:''})
                break;
            default:
                break;
        }
        this.setState({current_step:this.state.current_step-1});
    }


    changeEmail(value){
        this.setState({email:value});
    }

    updatePassword(value){
        this.setState({password:value});
    }

    changeCode(value){
        this.setState({code:value});
    }

    
    updateTokenIsNotOk(){
        this.setState({tokenChecked:true ,tokenIsValid:false});
    }

    updateTokenIsOk(){
        this.setState({tokenChecked:true ,tokenIsValid:true});
    }


    sendEmail(){
        this.setState({
            loading_send_email:true,
            exist_error:false,
            emailError:undefined
        });
        Dispatcher.dispatch({
            actionType:Constants.API_SEND_FORGET_PASSWROD_EMAIL
            ,payload:{
                email:this.state.email
            }
        });
    }

    sendVerificationCode(){
        this.setState({
            loading_verification_code:true,
            exist_error:false,
            codeError:undefined
        });
        Dispatcher.dispatch({
            actionType:Constants.API_SEND_FORGET_PASSWROD_CODE
            ,payload:{
                email:this.state.email,
                code:this.state.code
            }
        });
    }

    sendNewPassword(){
        this.setState({
            loading_change_password:true,
            exist_error:false,
            passwordError:undefined
        });
        Dispatcher.dispatch({
            actionType:Constants.API_SEND_FORGET_PASSWROD_NEW_PASSWORD
            ,payload:{
                email:this.state.email,
                code:this.state.code,
                password:this.state.password
            }
        });
    }

    emailSentSuccess(){
        this.setState({
            emailError:undefined,
            exist_error:false,
            loading_send_email:false,
            showCheckEmail:true
            // current_step:1
        });
    }

    emailSentFailed(error){
        let emailError = undefined;
        if(error.response && error.response.data){
            if(error.response.data.message){
                emailError = error.response.data.message;
            }
            else{
                emailError = `error code ${error.response.status}`;
            } 
        }
        console.log(emailError);
        this.setState({
            exist_error:true,
            loading_send_email:false,
            current_step:0,
            error,
            emailError:emailError
        });
    }

    verificationCodeSuccess(){
        this.setState({
            codeError:undefined,
            exist_error:false,
            loading_verification_code:false,
            showCheckEmail:true
            // current_step:2
        });
    }

    verificationCodeFailed(error){
        let codeError = undefined;
        if(error.response && error.response.data){
            if(error.response.data.message){
                codeError = error.response.data.message;
            }
            else{
                codeError = `error code ${error.response.status}`;
            } 
        }
            
        this.setState({
            exist_error:true,
            loading_verification_code:false,
            current_step:1,
            codeError:codeError,
            error
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
            exist_error:true,
            loading_change_password:false,
            current_step:2,
            passwordError:passwordError,
            error
        });
    }

    changePasswordSuccess(){
        toast.success("Changed Password Successfully");
        this.setState({
            passwordError:undefined,
            exist_error:false,
            loading_change_password:false,
            current_step:3
        });
    }


    render(){

        if((this.state.tokenIsValid === true && this.state.tokenChecked === true) 
            || this.state.loginGranted){
            return (<Redirect to="/xero_converter"/>);
        }
  
        let body = '';
        switch (this.state.current_step) {
            case 0:
                body = (<SendEmail                     
                    preStep={this.changeToPreStep} 
                    loading={this.state.loading_send_email} 
                    email={this.state.email} 
                    submit={this.sendEmail}
                    change={this.changeEmail}
                    showCheckEmail={this.state.showCheckEmail}
                    error={this.state.emailError}
                />);
                break;
            /*case 1:
                body = (<VerifyCode 
                    preStep={this.changeToPreStep} 
                    loading={this.state.loading_verification_code} 
                    code={this.state.code} 
                    submit={this.sendVerificationCode} 
                    change={this.changeCode}
                    success={this.state.showCheckEmail}
                    error={this.state.codeError}
                />);
                break;
             case 2:
                body = (<ChangePassword 
                    preStep={this.changeToPreStep} 
                    loading={this.state.loading_change_password} 
                    password={this.state.password} 
                    submit={this.sendNewPassword} 
                    change={this.updatePassword}
                    error={this.state.passwordError}
                />);
                break; */
            default:
                return (<Redirect to={{
                            pathname: '/login',
                            state: { status: 'changed_password' }
                        }}
                />);
        }
        return (
            <div>
                {body}
                <ToastContainer/>
            </div>
        )
    }

}

export default ForgetPasswordLayout;
