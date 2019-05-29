import React from "react";
import PropTypes from "prop-types";
import {      
  Container,
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Form,
  FormInput,
  Button
} from "shards-react";
import { TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap';
import { BounceLoader } from 'react-spinners';
import { Redirect } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { Store, Dispatcher, Constants } from "../../flux";
import PageTitle from "../common/PageTitle";
import classnames from 'classnames';
import GeneralTab  from './GeneralTab';
import XeroConfig from './XeroConfig';
import Loading from '../auth/Loading';
import CustomAlert from '../common/CustomAlert';


class Settings extends React.Component {
    
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            save_btn_enable:true,
            activeTab: '1',
            loading: true,
            showAlert:false,
            isErrorAlert:false,
            alertMessage:"",
            company: { 
                activePlan: {},
                ABNNumber:"",
                contact:{
                    email:"",
                    mobile:"",
                    phone:"",
                    address:""
                }
            },
            config: {
                appType: "public",
                consumerKey: "",
                consumerSecret: "",
                number: ""
            }
        };

        this.loadCompanyProfileDone = this.loadCompanyProfileDone.bind(this);
        this.sendUpdateProfileRequest = this.sendUpdateProfileRequest.bind(this);
        this.problemInCompanyProfile = this.problemInCompanyProfile.bind(this);
        this.updateCompanyProfileDone = this.updateCompanyProfileDone.bind(this);
        this.changeConsumerSecret = this.changeConsumerSecret.bind(this);
        this.changeConsumerKey = this.changeConsumerKey.bind(this);
        this.changePlan = this.changePlan.bind(this);
        this.changeCompanyName = this.changeCompanyName.bind(this);
        this.changeEmail = this.changeEmail.bind(this);
        this.changeAddress = this.changeAddress.bind(this);
        this.changePhone = this.changePhone.bind(this);
        this.changeMobile = this.changeMobile.bind(this);
        this.changeABNNumber = this.changeABNNumber.bind(this);
        this.changeRegisterationNumber = this.changeRegisterationNumber.bind(this);
        this.dismissAlert = this.dismissAlert.bind(this);
    
        Store.on(Constants.DONE_LOAD_COMPANY_PROFILE, this.loadCompanyProfileDone);
        Store.on(
          Constants.PROBLEM_LOAD_COMPANY_PROFILE,
          this.problemInCompanyProfile
        );
        Store.on(
          Constants.DONE_UPDATE_COMPANY_PROFILE,
          this.updateCompanyProfileDone
        );
        Store.on(
          Constants.PROBLEM_UPDATE_COMPANY_PROFILE,
          this.problemInCompanyProfile
        );
    
        Dispatcher.dispatch({
          actionType: Constants.LOAD_COMPANY_PROFILE
        });
    }

    componentWillUnmount(){
        Store.removeListener(Constants.DONE_LOAD_COMPANY_PROFILE, this.loadCompanyProfileDone);
        Store.removeListener(Constants.PROBLEM_LOAD_COMPANY_PROFILE, this.problemInCompanyProfile);
        Store.removeListener(Constants.DONE_UPDATE_COMPANY_PROFILE, this.updateCompanyProfileDone);
        Store.removeListener(Constants.PROBLEM_UPDATE_COMPANY_PROFILE, this.problemInCompanyProfile);
    }

    dismissAlert(){
        this.setState({showAlert:false})
    }


    changeEmail(value){
        
        this.setState({
            save_btn_enable:false,
            company:{
                ...this.state.company,
                contact:{
                    ...this.state.company.contact,
                    email:value
                }
            }
        })
    }

    changePhone(value){
        
        this.setState({
            save_btn_enable:false,
            company:{
                ...this.state.company,
                contact:{
                    ...this.state.company.contact,
                    phone:value
                }
            }
        })
    }

    changeAddress(value){
        this.setState({
            save_btn_enable:false,
            company:{
                ...this.state.company,
                contact:{
                    ...this.state.company.contact,
                    address:value
                }
            }
        })
    }

    changeMobile(value){
        this.setState({
            save_btn_enable:false,
            company:{
                ...this.state.company,
                contact:{
                    ...this.state.company.contact,
                    mobile:value
                }
            }
        })
    }

    changeCompanyName(value){
        this.setState({
            save_btn_enable:false,
            company:{
                ...this.state.company,
                name:value
            }
        })
    }

    changeConsumerSecret = (value) =>{
        this.setState({
            save_btn_enable:false,
            config: {
                ...this.state.config,
                consumerSecret: value
            }
        });
    }


    changeConsumerKey = (value) =>{
        this.setState({
            save_btn_enable:false,
            config: {
                ...this.state.config,
                consumerKey: value
            }
        });
    }

    changeABNNumber(value){
        
        this.setState({
            save_btn_enable:false,
            company:{
                ...this.state.company,
                ABNNumber:value
            }
        });
    }
    
    toggle(tab) {
        if (this.state.activeTab !== tab) {
        this.setState({
            activeTab: tab
        });
        }
    }

    
    sendUpdateProfileRequest() {
        let reg = /^\d+$/;
        if(this.state.company.ABNNumber.length !=11 || isNaN(this.state.company.ABNNumber)){
            // toast.warn("ABN Number must be 11 digit")
            return;
        }
        const { consumerKey, consumerSecret } = this.state.config;
        let appType = "public";
        const { number } = this.state.config;
        const { contact } = this.state.company;

        /* if (
        consumerKey === undefined ||
        consumerKey === "" ||
        consumerSecret === undefined ||
        consumerSecret === "" ||
        appType === undefined ||
        appType === "" ||
        number === undefined ||
        number === ""
        ) {
        console.log("fill");
        toast.warn("Please fill all require fields ");
        this.setState({ loading: false });
        return;
        } */
        this.setState({ loading: true });
        Dispatcher.dispatch({
        actionType: Constants.UPDATE_COMPANY_PROFILE,
        payload: {
            name:this.state.company.name,
            ABNNumber:this.state.company.ABNNumber || "",
            contact,
            config: {
                xero: { consumerKey, consumerSecret, appType },
                nids: { number }
            }
        }
        });
    }

    problemInCompanyProfile(err) {
        this.setState({
            loading: false,
            showAlert:true,
            isErrorAlert:true,
            alertMessage:err.message
        });
        // toast.error(err.message);
    }

    updateCompanyProfileDone() {
        this.setState({
            save_btn_enable:true,
            loading: false,
            showAlert:true,
            isErrorAlert:false,
            alertMessage:"Updated Successfully"
        });
        // toast.success("Update Success");
        Dispatcher.dispatch({
        actionType: Constants.LOAD_COMPANY_PROFILE
        });
    }

    loadCompanyProfileDone(company) {
        if (!company.config) {
        company.config = {
            xero: {},
            nids: {}
        };
        }
        this.setState({
        loading: false,
        company,
        config: { ...company.config.xero, ...company.config.nids }
        });
    }

    changePlan = () =>{

    }

    changeRegisterationNumber(value){
        this.setState({
            save_btn_enable:false,
            config: {
              ...this.state.config,
              number: value
            }
          });
    }

    render(){        
        return(
            <Container fluid className="main-content-container px-4">
                <Row noGutters className="page-header py-4"></Row>
                <Row>
                    <Col lg="12" md="12" sm="12" className="mb-4">
                        <Card small className="h-100">
                            {/* Card Header */}
                            <CardHeader>
                            <Nav tabs>
                            <NavItem>
                                <NavLink
                                style={{fontSize:"14px",fontWeight:600,paddingLeft:"30px",paddingRight:"30px"}}
                                className={[classnames({ active: this.state.activeTab === '1' }),classnames({ 'hight-light': this.state.activeTab === '1' })].join(" ")}
                                onClick={() => { this.toggle('1'); }}
                                >
                                Account
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                style={{fontSize:"14px",fontWeight:600,paddingRight:"30px",paddingLeft:"30px"}}
                                className={[classnames({ active: this.state.activeTab === '2' }),classnames({ 'hight-light': this.state.activeTab === '2' })].join(" ")}
                                onClick={() => { this.toggle('2'); }}
                                >
                                Xero Config
                                </NavLink>
                            </NavItem>
                        </Nav>
                            </CardHeader>
                            {(this.state.loading)?(<Loading/>):(
                                <CardBody className="d-flex flex-column">
                                <TabContent activeTab={this.state.activeTab}>
                                    <CustomAlert
                                        dismissAlert={this.dismissAlert}
                                        show={this.state.showAlert}
                                        error={this.state.isErrorAlert}
                                        message={this.state.alertMessage}
                                        autoHide={true}
                                        time={5000}
                                    />
                                    <TabPane tabId="1">
                                        <Row>
                                        <Col sm="12">
                                            <GeneralTab company={this.state.company}
                                             config={this.state.config}
                                             changeEmail={this.changeEmail}
                                             changePhone={this.changePhone}
                                             changeMobile={this.changeMobile}
                                             changeAddress={this.changeAddress}
                                             changeCompanyName={this.changeCompanyName}
                                             changeABNNumber = {this.changeABNNumber}
                                             changeRegisterationNumber={this.changeRegisterationNumber}/>
                                        </Col>
                                        </Row>
                                    </TabPane>
                                    <TabPane tabId="2">
                                        <Row>
                                            <Col sm="12">
                                                <XeroConfig config={this.state.config} changeConsumerSecret={this.changeConsumerSecret} changeConsumerKey={this.changeConsumerKey}  changePlan={this.changePlan}/>
                                            </Col>                                            
                                        </Row>
                                    </TabPane>
                                </TabContent>  
                                <Row>
                                    <Col lg={4}>
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
                                            disabled={this.state.save_btn_enable}
                                            style={{marginTop:"5%"}}
                                            onClick={this.sendUpdateProfileRequest}
                                            theme="accent"
                                        >
                                            Save
                                        </Button>
                                        )}
                                    </Col>
                                </Row> 
                                    
                                    <ToastContainer/>
                                    
                            </CardBody>
                                )}
                                
                            
                        </Card>                 
                    </Col>
                </Row>
            </Container>
        );
    }
}


export default Settings;
