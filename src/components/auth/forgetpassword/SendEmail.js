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
// import { ToastContainer } from "react-toastify";
import CustomAlert from '../../common/CustomAlert';

class SendEmail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disable:true,
      showSuccess:false,
      isAlertError:false,
      alertMessage:''
    }
    this.validateAndChangeEmail = this.validateAndChangeEmail.bind(this);
    this.validateFirstTime = this.validateFirstTime.bind(this);
    this.dismissAlert = this.dismissAlert.bind(this);
  }


  
  componentWillReceiveProps(nextProps){
    console.log("next props");
    console.log(nextProps);
    console.log("props");
    console.log(this.props);
    if(nextProps.error !== this.props.error){
      if(this.props.error===undefined && !this.state.showSuccess){
        this.setState({
          showSuccess:true,
          isAlertError:true,
          alertMessage:nextProps.error
        });
      }
    }    
    else if(nextProps.showCheckEmail !== this.props.showCheckEmail){
      console.log("check email");
      console.log(nextProps.showCheckEmail,this.props.showCheckEmail);
      if(!this.props.showCheckEmail && !this.state.showSuccess){
        this.setState({
          showSuccess:true,
          isAlertError:false,
          alertMessage:"Please check your email inbox"
        });
      }
    }
  }
  
  dismissAlert(){
    this.setState({
      showSuccess:false,
      isAlertError:false
    })
  }


  componentDidMount(){
    this.validateFirstTime();
  }

  validateFirstTime(){
    var re = /\S+@\S+\.\S+/;
    if(re.test(this.props.email)){
      this.setState({disable:false});
    }
    else this.setState({disable:true});
  }

  validateAndChangeEmail(evt){
    console.log(this.state.disable);
    let email = evt.target.value;
    this.props.change(email);
    var re = /\S+@\S+\.\S+/;
    if(re.test(email)){
      this.setState({disable:false});
    }
    else this.setState({disable:true});
  }

  render(){
    // console.log(this.props.error);
    return(
      <Card small className="mb-4">
      <CardHeader className="border-bottom">
        <h6 className="m-auto text-center">Send Email</h6>
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
                    <label htmlFor="feEmail">Email</label>
                    <FormInput
                      type="text"
                      id="feUsername"
                      placeholder="sierra1993@profeed.com.au"
                      value={this.props.email}
                      onChange={this.validateAndChangeEmail}
                    />
                  </Col>
                </Row>
                
                <Row>
                  <Col lg={12} className="justify-content-center text-center">
                    <Button disabled={this.state.disable} style={{cursor:"pointer"}} onClick={this.props.submit} theme="accent" className="btn-block pr-4 pl-4">Send</Button>
                  </Col>
                  
                  <Col lg={12} className="text-center mt-3">
                    Back to{" "}
                    <a className="m-0" href="/login">
                      login
                    </a>
                  </Col>

                  <Col md="12" className="mt-2 text-center justify-content-center align-items-center">
                    <div style={{margin:"auto",width:"10%"}}>
                      <BounceLoader
                        sizeUnit={"px"}
                        size={30}
                        color={'#007bff'}
                        loading={this.props.loading}
                      />
                    </div>
                      
                  </Col>
                  
                
                </Row>
                
            </Col>
          </Row>
        </ListGroupItem>
      </ListGroup>
      {/* <ToastContainer /> */}
    </Card>
    );
  }

}

export default SendEmail;
