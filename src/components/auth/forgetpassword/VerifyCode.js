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
// import { ToastContainer, toast } from "react-toastify";
import CustomAlert from '../../common/CustomAlert';


class VerifyPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disable:true,
      showSuccess:false,
      isAlertError:false,
      alertMessage:''
    }
    this.changeVerifyCode = this.changeVerifyCode.bind(this);
    this.dismissAlert = this.dismissAlert.bind(this);
  }

  componentDidMount(){
    if(this.props.code.length>3){
      this.setState({disable:false});
    }
    else{
      this.setState({disable:true});
    }
  }

  dismissAlert(){
    this.setState({
      showSuccess:false,
      isAlertError:false
    })
  }

  changeVerifyCode(evt){
    let code = evt.target.value;
    this.props.change(code);
    if(code.length>3){
      this.setState({disable:false});
    }
    else{
      this.setState({disable:true});
    }
  }

  componentWillReceiveProps(nextProps){
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
      if(this.props.showCheckEmail===false && !this.state.showSuccess){
        this.setState({
          showSuccess:true,
          isAlertError:false,
          alertMessage:"Please check your email inbox"
        });
      }
    }
  }

  render(){
    return(
      <Card small className="mb-4">
      <CardHeader className="border-bottom">  
        <h6 className="m-auto text-center">Verification Code</h6>
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
                  {/* Verification Code */}
                  <Col md="12" className="form-group">
                    <label htmlFor="feCode">Verification Code</label>
                    <FormInput
                      type="text"
                      id="feCode"
                      placeholder="12ew4"
                      value={this.props.code}
                      onChange={this.changeVerifyCode}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col lg={12} className="justify-content-center text-center">
                    <Button disabled={this.state.disable} style={{cursor:"pointer"}} onClick={this.props.submit} theme="accent" className="btn-block pr-4 pl-4">Verify</Button>
                  </Col>
                  <Col style={{cursor:"pointer"}}  onClick={this.props.preStep} lg={12} className="text-center mt-1"><span  className="ml-1" style={{fontSize:"12px"}} >Back</span></Col>
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

export default VerifyPassword;
