import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "shards-react";

import MainNavbar from "../components/layout/MainNavbar/MainNavbar";
// import MainSidebar from "../components/layout/MainSidebar/MainSidebar";
import MainFooter from "../components/layout/MainFooter";
// import bg from '../images/bg.23517b0b.png';
// import Background from './../images/bg.23517b0b.png';

var sectionStyle = {
  minHeight:"100%",
  height: "100%",
  backgroundPosition: 'center bottom',
  backgroundRepeat: 'no-repeat',
  backgroundImage: "url(" + require('../images/bg.23517b0b.png') + ")"
};

const AuthLayout = ({ children, noNavbar, noFooter }) => (
  <div style={ sectionStyle } >
    <Row style={{overflow:"hidden",height:"100%",minHeight:"100%"}} className="justify-content-center align-items-center ">
      <Col lg={4} className="mx-auto">
        {children}
      </Col>
    </Row>
  </div>
);

AuthLayout.propTypes = {
  /**
   * Whether to display the navbar, or not.
   */
  noNavbar: PropTypes.bool,
  /**
   * Whether to display the footer, or not.
   */
  noFooter: PropTypes.bool
};

AuthLayout.defaultProps = {
  noNavbar: true,
  noFooter: false
};

export default AuthLayout;
