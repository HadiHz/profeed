import React from "react";
import PropTypes from "prop-types";
import {
  ListGroupItem,
  Row,
  Col,
  Form,
  FormInput,
} from "shards-react";
import MyFormInput from '../common/MyFormInput';
class GeneralTab extends React.Component{

    render() {
        let { config, company } = this.props;
        let contact = this.props.company.contact || {};
        let { changeEmail,
            changeAddress,
            changePhone,
            changeMobile,
            changeCompanyName,
            changeRegisterationNumber,
            changeABNNumber
        } = this.props;
        return (
            <div>
                <ListGroupItem className="p-3">
                    <Row><Col><h5>Plan</h5></Col></Row>
                    <Row>
                        <Col>
                            <Row>
                                {" "}
                                <Col md="6" className="form-group">
                                    <label htmlFor="feCompanyInfo">{`Your Subscription Plan: ${
                                        company.activePlan.name
                                        }`}</label>
                                </Col>
                                <Col md="6" className="form-group">
                                    <label htmlFor="feCompanyInfo">{`Active Until:     ${
                                        company.activePlan.activeUntil
                                        }`}</label>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </ListGroupItem>
                <ListGroupItem className="px-3">
                    <Form>
                        <Row><Col><h5>Company</h5></Col></Row>
                        <Row className="form-group">
                            <Col>
                                <Row>
                                    <Col>
                                        <label htmlFor="coName">Name</label>
                                        <FormInput
                                            id="coName"
                                            placeholder="Name"
                                            value={company.name || ""}
                                            onChange={evt => {
                                                changeCompanyName(evt.target.value)
                                            }}
                                        />
                                    </Col>
                                    <Col>
                                        <label htmlFor="coPhone">Phone</label>
                                        <FormInput
                                            id="coPhone"
                                            placeholder="Phone"
                                            value={contact.phone || ""}
                                            onChange={evt => {
                                                changePhone(evt.target.value)
                                            }}
                                        />
                                    </Col>
                                    <Col>
                                        <label htmlFor="coMobile">Mobile</label>
                                        <FormInput
                                            id="coMobile"
                                            placeholder="Mobile"
                                            value={contact.mobile || ""}
                                            onChange={evt => {
                                                changeMobile(evt.target.value)
                                            }}
                                        />
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: "15px" }}>
                                    <Col lg="4" md="12">
                                        <label htmlFor="coEmail">Email</label>
                                        <FormInput
                                            id="coEmail"
                                            type="email"
                                            placeholder="Email"
                                            value={contact.email || ""}
                                            onChange={evt => {
                                                changeEmail(evt.target.value)
                                            }}
                                        />
                                    </Col>
                                    <Col lg="4" md="12">
                                        <label htmlFor="coAddress">Address</label>
                                        <FormInput
                                            id="coAddress"
                                            placeholder="Address"
                                            value={contact.address || ""}
                                            onChange={evt => {
                                                changeAddress(evt.target.value)
                                            }}
                                        />
                                    </Col>
                                    <Col lg="4" sm="12">
                                        <MyFormInput
                                            required={true}
                                            validate={{ required: true }}
                                            id="feRegistrationNumber"
                                            placeholder="Registration Number"
                                            value={config.number || ""}
                                            onChange={evt => {
                                                changeRegisterationNumber(evt.target.value);
                                            }}
                                        />
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: "15px" }}>
                                    {/* consumerSecret */}
                                    
                                    <Col lg="4" md="12">
                                        <MyFormInput
                                            required={true}
                                            validate={{ required: true, equal: 11, number: true }}
                                            id="coABNNumber"
                                            placeholder="ABN Number"
                                            type="number"
                                            value={company.ABNNumber || ""}
                                            onChange={evt => {
                                                changeABNNumber(evt.target.value)
                                            }}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                </ListGroupItem>
            </div>
        );
    }
}

export default GeneralTab;