import React, { Component, Fragment } from 'react';
import {Link, withRouter} from "react-router-dom";
import Routes from  "./Routes"
import {Nav,Navbar, NavItem} from  "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Auth }  from "aws-amplify";
import './App.css';

 class App extends Component {

  constructor(props){
    super(props);

    this.state={
      isAuthenticated: false,
      isAuthenticating: true,
      currentUser: null
    };
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated});
  }
  setCurrentUser = user => {
    this.setState({currentUser : user});
  }

  async componentDidMount(){
    try{
      if (await Auth.currentSession()){
        var user = await Auth.currentAuthenticatedUser();
        this.setCurrentUser(user);
        this.userHasAuthenticated(true);
      }
    }catch(e){
      if(e != 'No current user'){
        alert(e);
      }
    }
    this.setState({isAuthenticating: false});
  }


  handleLogout = async event => {
    
    await Auth.signOut();

    this.userHasAuthenticated(false);

    this.props.history.push("/login");
  }

  render() {
     const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated,
      currentUser: this.state.currentUser,
      setCurrentUser: this.setCurrentUser
    }; 
    return (
      !this.state.isAuthenticating &&
      <div className="App container">
        <Navbar fluid collapseOnSelect>
           <Navbar.Header>
           <Navbar.Brand>
            <Link to="/">Scratch</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav pullRight>
        {this.state.isAuthenticated
         ? <NavItem onClick={this.handleLogout}>Logout</NavItem>
         : <Fragment>
            <LinkContainer to="/signup">
            <NavItem>Signup</NavItem>
            </LinkContainer>
            <LinkContainer to="/login">
            <NavItem>Login</NavItem>
            </LinkContainer>
           </Fragment>
          }
        </Nav>
      </Navbar.Collapse>
        </Navbar>
        <Routes childProps={childProps} />
      </div>
    );
  }
}

export default withRouter(App);