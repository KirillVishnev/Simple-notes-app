import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { Auth } from "aws-amplify";
import LoaderButton from "../components/LoaderButton";
import "./Login.css";

export default class Login extends Component {

    constructor(props){
        super(props);

        this.state ={
            isloading: false,
            email: "",
            password: ""
        };
    }


    validateForm() {
        return this.state.email.length> 0 && this.state.password.length> 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit =  async event => {
        event.preventDefault()
        this.setState({ isLoading: true });

        try{
          await Auth.signIn(this.state.email, this.state.password);
          var user = await Auth.currentAuthenticatedUser();
          this.props.setCurrentUser(user);
          this.props.userHasAuthenticated(true);
        }catch(e){
          alert(e.message);
          this.setState({ isLoading: false });
        }
      }

    render() {
        return (
        <div className="Login">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="email" bsSize="large">
            <ControlLabel>UserName</ControlLabel>
            <FormControl
              autoFocus
              type="text"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <LoaderButton
           block
           bsSize="large"
           disabled={!this.validateForm()}
           type="submit"
           isLoading={this.state.isLoading}
           text="Login"
           loadingText="Logging in…"
           />
        </form>
      </div>

        );
    }


}