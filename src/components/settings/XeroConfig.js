import React from "react";
import PropTypes from "prop-types";
import {
  
  ListGroupItem,
  Row,
  Col,
  
  FormInput,
  FormSelect
} from "shards-react";
import MyFormInput from '../common/MyFormInput';

class XeroConfig extends React.Component{

    render(){
        let {config,changeConsumerKey,changeConsumerSecret} = this.props;
        return(
             <ListGroupItem className="p-3">
                <Row>
                    <Col>
                        <Row><Col><h5>Xero</h5></Col></Row>
                        <Row>
                            {/* AppType */}
                            <Col md="4" className="form-group">
                            <label htmlFor="feAppType">AppType*</label>
                            <FormSelect id="fePlan" value="public" onChange={evt => {

                            }}>
                                <option value="public">"Public"</option>
                            </FormSelect>
                            </Col>

                            {/* consumerKey */}
                            <Col md="4" className="form-group">
                            
                            <MyFormInput
                                required={true}
                                validate={{required:true}}
                                id="feConsumerKey"
                                placeholder="consumerKey"
                                value={config.consumerKey || ""}
                                onChange={evt => {
                                    changeConsumerKey(evt.target.value)
                                }}
                            />
                            </Col>
                            {/* consumerSecret */}
                            <Col md="4" className="form-group">
                            <MyFormInput
                                required={true}
                                validate={{required:true}}
                                id="feConsumerSecret"
                                placeholder="consumerSecret"
                                value={config.consumerSecret || ""}
                                onChange={evt => {
                                    changeConsumerSecret(evt.target.value)
                                }}
                            />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                
            </ListGroupItem>           
            
        );
    }
}

export default XeroConfig;