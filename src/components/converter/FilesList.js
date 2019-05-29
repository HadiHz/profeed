import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  FormInput,
  Row,
  Col
} from "shards-react";
import { FaDownload } from "react-icons/fa";
import { toast } from "react-toastify";
import { Store, Dispatcher, Constants } from "../../flux";
import { BounceLoader } from "react-spinners";
import moment from "moment";
import CustomAlert from '../common/CustomAlert';

class FilesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showErrorAlert: false,
      showSuccess:false,
      alertMessage: "File uploaded successfully",
      files: [],
      xeroCode: {},
      loading: {}
    };
    this.continueRequest = this.continueRequest.bind(this);
    this.downloadFile = this.downloadFile.bind(this);
    this.updateUploadedFilesSuccess = this.updateUploadedFilesSuccess.bind(
      this
    );
    this.successContinueRequest = this.successContinueRequest.bind(this);
    this.problemContinueRequest = this.problemContinueRequest.bind(this);
    this.updateUploadedFilesFail = this.updateUploadedFilesFail.bind(this);
    this.dismissAlert = this.dismissAlert.bind(this);
    Store.on(
      Constants.UPLOAD_FILES_LIST_SUCCESS,
      this.updateUploadedFilesSuccess
    );
    Store.on(Constants.CONTINUE_CONVERT_DONE, this.successContinueRequest);
    Store.on(Constants.CONTINUE_CONVERT_ERROR, this.problemContinueRequest);
  }

  updateUploadedFilesSuccess = files => {
    this.setState({ files: [...files] });
  };


  
  dismissAlert(){
    this.setState({
      showSuccess:false,
      isAlertError:false
    })
  }


  updateUploadedFilesFail = error => {
    // console.log(error);
    // toast.error(error.message);
    this.setState({
      showSuccess:true,
      showErrorAlert:true,
      isAlertError:true,
      alertMessage:error.message
    });
  };

  componentWillMount() {
    Dispatcher.dispatch({ actionType: Constants.GET_UPLOADED_FILES });
    this.interval = setInterval(() => {
      Dispatcher.dispatch({ actionType: Constants.GET_UPLOADED_FILES });
    }, 5000);
  }

  componentWillUnmount = () => {
      if(this.interval){
          clearInterval(this.interval)
      }
  };

  downloadFile(id, name) {
    Dispatcher.dispatch({
      actionType: Constants.DOWNLOAD_FILE,
      payload: { name, id }
    });
  }

  successContinueRequest() {
    this.setState({
      showSuccess:true,
      showErrorAlert:false,
      alertMessage:"Success"
    })
    // toast.success("Success");
    Dispatcher.dispatch({ actionType: Constants.GET_UPLOADED_FILES });
  }

  problemContinueRequest(payload) {
    let { id, message } = payload;
    // let { loading } = this.state;
    // loading[id] = false;
    // this.setState({ loading });
    // this.setState({});
    this.setState({
      showSuccess:true,
      showErrorAlert:true,
      isAlertError:true,
      alertMessage:message
    });
    // toast.error();
    Dispatcher.dispatch({ actionType: Constants.GET_UPLOADED_FILES });
  }

  continueRequest(id, code) {
    let loading = this.state.loading;
    loading[id] = true;
    this.setState({
      loading
    });
    Dispatcher.dispatch({
      actionType: Constants.CONTINUE_CONVERT,
      payload: {
        id,
        code
      }
    });
  }

  render() {
    const renderGeneratedFile = item => {
      let loading = this.state.loading[item._id];
      if (item.status === "Pending") {
        return (
          <div style={{ margin: "auto", width: "10%" }}>
            <BounceLoader
              sizeUnit={"px"}
              size={30}
              color={"#007bff"}
              loading={loading}
            />
          </div>
        );
      } else if (item.status === "Waiting") {
        if (loading) {
          return (
            <div style={{ margin: "auto", width: "10%" }}>
              <BounceLoader
                sizeUnit={"px"}
                size={30}
                color={"#007bff"}
                loading={loading}
              />
            </div>
          );
        } else {
          return (
            <Row form>
              <Col md="4" className="form-group">
                <FormInput
                  id="feXeroCode"
                  placeholder="Xero Code"
                  value={this.state.xeroCode[item._id]}
                  onChange={evt => {
                    let xeroCode = this.state.xeroCode;
                    xeroCode[item._id] = evt.target.value;
                    this.setState({
                      xeroCode
                    });
                  }}
                />
              </Col>
              {/* Password */}
              <Col md="3" className="form-group">
                <Button
                  type="button"
                  disabled={
                    !this.state.xeroCode[item._id] ||
                    this.state.xeroCode[item._id].length < 5
                  }
                  onClick={() => {
                    let { loading } = this.state;
                    loading[item._id] = true;
                    this.continueRequest(
                      item._id,
                      this.state.xeroCode[item._id],
                      loading
                    );
                  }}
                >
                  Process
                </Button>
              </Col>
              <Col md="4" className="form-group">
                <Button
                  type="button"
                  theme="warning"
                  onClick={() => {
                    if (item.authUrl) window.open(item.authUrl, "_blank");
                  }}
                >
                  Try Again
                </Button>
              </Col>
            </Row>
          );
        }
      } else if (item.status === "Done") {
        return (
          <Button
            type="button"
            theme="success"
            onClick={() => {
              this.downloadFile(item.to, "Proda");
            }}
          >
            <FaDownload />
          </Button>
        );
      }
    };
    return (
      <Card small className="mb-4">
        <CardHeader className="border-bottom">
          <h6 className="m-0">Uploaded Files</h6>
          <CustomAlert
            dismissAlert={this.dismissAlert}
            show={this.state.showSuccess}
            error={this.state.isAlertError}
            message={this.state.alertMessage}
            autoHide={true}
            time={8000}
          />
        </CardHeader>
        <CardBody className="p-0 pb-3">
          <table className="table mb-0">
            <thead className="bg-light">
              <tr>
                <th scope="col" className="border-0">
                  #
                </th>
                <th scope="col" className="border-0">
                  File Name
                </th>
                <th scope="col" className="border-0">
                  Upload Date
                </th>
                <th scope="col" className="border-0">
                  Status
                </th>
                <th scope="col" className="border-0">
                  Download
                </th>
                <th scope="col" className="border-0">
                  Generated File
                </th>
              </tr>
            </thead>
            <tbody>
              {this.state.files.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.orginalName}</td>
                    <td>
                      {moment(item.requestTime).format("YYYY/MM/DD HH:mm")}
                    </td>
                    <td>{item.status}</td>
                    <td>
                      <Button
                        type="button"
                        onClick={() => {
                          this.downloadFile(item.from, "Xero");
                        }}
                      >
                        <FaDownload />
                      </Button>
                    </td>
                    <td>{renderGeneratedFile(item)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
        {/* <ToastContainer /> */}
      </Card>
    );
  }
}

export default FilesList;
