import React, { Component } from "react";
import { Alert, Row, Col, Button } from "shards-react";
import ReactTimeout from "react-timeout";
import PropTypes from "prop-types";
import { FaTimes } from "react-icons/fa";

class CustomAlert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
    this.toggle = this.toggle.bind(this);
    this.hide = this.hide.bind(this);
  }

  toggle() {
    // this.setState({show: false});
    console.log("local");
    if (this.props.dismissAlert) {
      console.log("dimiss");
      this.props.dismissAlert();
    }
  }

  hide() {
    if (this.props.autoHide === true) {
      this.props.setTimeout(this.toggle, this.props.time);
    }
  }

  // componentDidMount() {
  //   if (this.props.show === true) {
  //     this.props.clearTimeout();
  //     // this.props.setTimeout(this.toggle, this.props.time);
  //     console.log(this.props.time);
  //     this.hide();
  //   } else {
  //     console.log("did mount " + this.props.show);
  //   }
  // }
  /* 
  componentWillReceiveProps(nextProps){
    if(this.props.show === true && nextProps.show !== true){
      
    }  
  } */
  /* 
  componentDidUpdate(prevProps){
    if(prevProps.show===false && this.props.show===true){
      if((this.props.autoHide===true && this.props.time > 0)){
        this.props.clearTimeout();
        this.props.setTimeout(this.toggle, this.props.time);
      }
    }
  } */

  /*  componentWillReceiveProps(nextProps) {
    console.log("in alert message");
    console.log(nextProps);
    console.log("state");
    console.log(this.state);
    console.log("end alert message");
    if (nextProps.show === true && this.state.show===false) {
      this.setState({ show: true });
      if((nextProps.autoHide===true && nextProps.time > 0)){
        this.props.clearTimeout();
        console.log("clear timeout");
        this.props.setTimeout(this.toggle, nextProps.time);
      }
    }
    else{
      this.setState({show:false});
    }
  } */

  render() {
    console.log(this.props.show);
    if (!this.props.show) {
      return <div />;
    }
    if (this.props.error) {
      console.log("render " + this.props.show);
      this.hide();
      return (
        <Row style={{ padding: "0" }}>
          <Col>
            <Alert
              theme="danger"
              style={{
                backgroundColor: "#f1dddd",
                color: "#aa525f",
                fontSize: "14px",
                borderRadius: "5px"
              }}
            >
              <Row>
                <Col>
                  <span>{this.props.message}</span>
                </Col>
                <Col md="1" lg="1">
                  <FaTimes
                    onClick={this.toggle}
                    style={{ cursor: "pointer" }}
                  />
                </Col>
              </Row>
            </Alert>
          </Col>
        </Row>
      );
    } else {
      return (
        <Row style={{ padding: "0" }}>
          <Col>
            <Alert
              theme="danger"
              style={{
                backgroundColor: "#d4edda",
                color: "#155724",
                fontSize: "14px",
                borderRadius: "5px"
              }}
            >
              <Row>
                <Col>
                  <span>{this.props.message}</span>
                </Col>
                <Col md="1" lg="1">
                  <span onClick={this.toggle} style={{ cursor: "pointer" }}>
                    <FaTimes />
                  </span>
                </Col>
              </Row>
            </Alert>
          </Col>
        </Row>
      );
    }
  }
}

CustomAlert.propTypes = {
  /* 
    enable alert
   */
  show: PropTypes.bool,

  /* 
    content message of alert
  */
  message: PropTypes.string,

  /* 
    change style of alert to error mode
  */
  error: PropTypes.bool,

  /* 
    if alert need to be autohide base on time
  */
  autoHide: PropTypes.bool,

  /* 
    if auto hide is enable use this int to set timeout
   */
  time: PropTypes.number,

  /* 
    call on dismiss alert
   */
  dimissAlert: PropTypes.func
};

export default ReactTimeout(CustomAlert);
