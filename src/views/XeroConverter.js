import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "shards-react";
import PageTitle from "./../components/common/PageTitle";
import UploadFile from "./../components/converter/UploadFile";
import FilesList from "../components/converter/FilesList";
import { Store, Dispatcher, Constants } from "./../flux";
import { ToastContainer } from "react-toastify";

class XeroConverter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nothinh: {}
    };
  }

  render() {
    return (
      <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4">
          <PageTitle
            title="Xero Conversion"
            subtitle=""
            className="text-sm-left mb-3"
          />
        </Row>
        <Row>
          <Col lg="12" md="12" sm="12" className="mb-4">
            <UploadFile />
          </Col>

          {/* Files List */}
          <Col lg="12" md="12" sm="12" className="mb-4">
            <FilesList />
          </Col>
        </Row>
        <ToastContainer />
      </Container>
    );
  }
}

export default XeroConverter;
