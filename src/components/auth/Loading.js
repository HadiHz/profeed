import React from "react";
import { PulseLoader } from 'react-spinners';
import { Row, Col } from "shards-react";
import { css } from '@emotion/core';
const override = css`
    margin: 0 20 0 auto;
`;
const Loading = ()=>(
    <div className="justify-content-center align-items-center text-center"
     style={{height:"100%",minHeight:"100%"}}>
        <Row>
            <Col className="justify-content-center align-items-center text-center" style={{padding:'5px'}}  lg={12} md={12}>
                <PulseLoader css={override} sizeUnit={"px"} size={12}/>
            </Col>
            <Col className="justify-content-center align-items-center" lg={12} md={12}>
                <span>Please wait...</span>
            </Col>
        </Row>
    </div>
)

export default Loading;