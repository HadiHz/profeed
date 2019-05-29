import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Form,
  FormGroup,
  FormInput,
  Button,
  Alert
} from "shards-react";
import { BounceLoader } from "react-spinners";
import { toast } from "react-toastify";
import { Store, Dispatcher, Constants } from "../../flux";
import CustomAlert from '../common/CustomAlert';

// import {  } from 'reactstrap';

class UploadFile extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      theInputKey: 0,
      loading: false,
      selectedFile: null,
      showErrorAlert: false,
      showSuccessUpload:false,
      alertMessage: "File uploaded successfully",
      error:{
        code:400,
        message:'',
        log_link:'http://www.google.com'
      }
    };

    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.downloadReport = this.downloadReport.bind(this);
    this.mdismissAlert = this.mdismissAlert.bind(this);

    Store.on(Constants.UPLOAD_FILE_SUCCESS, this.uploadFileSuccess);
    Store.on(Constants.UPLOAD_FILE_FAIL, this.uploadFileFail);
  }

  componentWillUnmount(){
    Store.removeListener(Constants.UPLOAD_FILE_SUCCESS, this.uploadFileSuccess);
    Store.removeListener(Constants.UPLOAD_FILE_FAIL, this.uploadFileFail);
  }


  mdismissAlert(){
    console.log("mamad");
    this.setState({
      showSuccessUpload:false,
      isAlertError:false
    })
  }

  downloadReport(event) {
    event.preventDefault();
    if (this.state.error && this.state.error.report)
      Dispatcher.dispatch({
        actionType: Constants.DOWNLOAD_FILE,
        payload: {
          name: "report",
          id: this.state.error.report
        }
      });
  }

  uploadFileSuccess = result => {
    this.fileInput.value = '';
    let randomString = Math.random().toString(36);
    this.fileInput.value = null;
    this.setState({
      theInputKey:randomString, 
      loading: false,
      showErrorAlert:false,
      showSuccessUpload:true,
      isAlertError:false,
      selectedFile:null,
      alertMessage:"File uploaded successfully",
      error:{
        code:400,
        message:''
      }
    });
    
    // toast.success("File uploaded successfully");
    Dispatcher.dispatch({ actionType: Constants.GET_UPLOADED_FILES });
    if (result.authUrl) window.open(result.authUrl, "_blank");
  };

  uploadFileFail = error => {
    console.log("error is herer");
    this.setState({
      loading: false,
      showErrorAlert:true,
      showSuccessUpload:false,
      isAlertError:true,
      error
    });    
    // toast.error(error.message);
  };

  uploadFile = () => {
    if (this.state.selectedFile === null) {
      this.setState({
        showSuccessUpload:true,
        isAlertError:true,
        alertMessage:"Please select a file"
      });
      // toast.error("Select File");
      return;
    }
    this.setState({ 
      loading: true,
      showErrorAlert:false,
      showSuccessUpload:false,
      isAlertError:false
    });
    Dispatcher.dispatch({
      actionType: Constants.UPLOAD_FILE,
      payload: this.state.selectedFile
    });
  };

  handleFileUpload = evt => {
    if (evt.target.files.length <= 0) return;
    this.setState({ selectedFile: evt.target.files[0] });
  };

  render() {
    return (
      <Card small className="h-100">
        {/* Card Header */}
        <CardHeader className="border-bottom">
          <h6 className="m-0">Upload Invoice(s)</h6>
        </CardHeader>

        <CardBody className="d-flex flex-column">
          <CustomAlert
            dismissAlert={this.mdismissAlert}
            show={this.state.showSuccessUpload}
            error={this.state.isAlertError}
            message={this.state.alertMessage}
            autoHide={true}
            time={8000}
          />

          {this.state.showErrorAlert ?
            (<Alert theme="danger" style={{
                backgroundColor:"#f1dddd",
                color:"#aa525f",
                fontSize:"14px",
                borderRadius:"5px"
              }}>
                {
                  this.state.error.status===412?
                  (
                    <div>
                      <span>Data validation error found, please check the&nbsp;</span>
                      <a onClick={this.downloadReport} style={{color:"blue"}} href="#">
                        report
                      </a>
                    </div>
                )
                :(<span>{`The file contains invalid entries: ${this.state.error.message}`}</span>)
                }
                
              </Alert>
            ) 
          : ''
          }
          <Form className="quick-post-form">
            {/* Body */}
            <FormGroup className="mb-0 mt-3">
              <FormInput
                key={this.state.theInputKey || '' }
                ref={ref => (this.fileInput = ref)}
                type="file"
                name="file"
                onChange={this.handleFileUpload}
                accept=".csv"
              />
            </FormGroup>
            <FormGroup className="mb-0 mt-3">
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
                  onClick={this.uploadFile}
                  disabled={!this.state.selectedFile}
                  theme="accent"
                  type="button"
                >
                  Upload File
                </Button>
              )}
            </FormGroup>
          </Form>
        </CardBody>
        {/* <ToastContainer /> */}
      </Card>
    );
  }
}

export default UploadFile;
