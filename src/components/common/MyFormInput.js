import React, { Component } from 'react'
import { FormInput } from "shards-react";
import validator from 'validator';

export default class MyFormInput extends Component {
    constructor(props){
        super(props);
        this.state = { 
            errorMessage:'',
            showError:false
        }
        this.doValidation = this.doValidation.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onChange(e){
        this.props.onChange(e);
        let {validate} = this.props;
        // console.log(validate);
        // console.log("this is value",e.target.value);
        this.doValidation(validate,e.target.value);
    }

    doValidation = (validate,value) =>{
        if(!validate) return true;
        let {required,email,number,max,min,equal} = validate;
        if(required){
            if(value.length <= 0){
                console.log("in required1")
                this.setState({
                    errorMessage:'Required',
                    showError:true
                });
                return false;
            }
            //value length must be more than 0
        }
        if(email){
            if(!validator.isEmail(value)){
                this.setState({
                    errorMessage:'Please enter a valid email',
                    showError:true
                });
                return false;
            }
            //value must be email
        }
        /* if(number){
            if(!isNaN(value)){
                this.setState({
                    errorMessage:'Input must be digits',
                    showError:true
                });
                return false;
            }
        } */
        if(max && !isNaN(max)){
            if(value.length > max){
                this.setState({
                    errorMessage:'Length must be less than ' + max ,
                    showError:true
                });
                return false;
            }
        }
        if(min && !isNaN(min)){
            if(value.length < min){
                this.setState({
                    errorMessage:'Length must be more than ' + min ,
                    showError:true
                });
                return false;
            }
        }
        if(equal && !isNaN(equal)){
            // console.log("equal");
            if(value.length !== equal){
                this.setState({
                    errorMessage:'Length must be equal to ' + equal ,
                    showError:true
                });
                return false;
            }
        }
        this.setState({
            showError:false
        });
        if(this.props.isValid){
            this.props.isValid();
        }
        return true;
        
    }

    render() {
        // let {validate,value} = this.props;
        // this.doValidation(validate,value);
        return (
            <div className={["m-input-group",this.state.showError ? "m-error" : ''].join(" ")}>
                <label htmlFor={this.props.id}>{this.props.label || this.props.placeholder || ""}</label>
                {
                    (this.props.required || false) ? (<span className="require"> *</span>) : ''
                }
                <FormInput  {...this.props} onChange={this.onChange}/>
                {this.state.showError ?
                    (<span>{this.state.errorMessage}</span>) :''
                }
            </div>
            
        )
    }
}
