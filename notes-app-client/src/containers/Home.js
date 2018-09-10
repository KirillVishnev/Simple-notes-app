import React, {Component, Fragment} from "react";
import "./Home.css";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import Select from "react-select";
import { Link } from "react-router-dom";
import {API} from "aws-amplify"; 
export default class Home extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
          isLoading: true,
          notes: [],
          users: [],
          selectedUser: null
        };
      }

      
      async componentDidMount() {
        if(!this.props.isAuthenticated){
          return;
        }

        try{
           const notes = await this.notes();
           const users= await this.users();
           const activeUsers =  users.map(
                function (user) { 
              return({
                value: `/notes/byusers/${user.Username}`,
                label: user.Username
                });
              }
                
           );
           var currentUsers=[{value: "/notes", label: "My"}, {value: "/notes/shared", label: "shared"}].concat(activeUsers);
           this.setState({notes, users, currentUsers, selectedUser: currentUsers[0]});

        }catch(e){
          alert(e);
        }
        this.setState({isLoading: false});
      }
      
      notes(){
        return API.get("notes", "/notes")
      }
    
      users(){
        return API.get("notes", "/users");
      }
      renderNotesList(notes) {
        return [{}].concat(notes).map(
           (note, i) => 
             i!==0  
             ? <ListGroupItem
                key= {note.noteId}
                href={`notes/${note.noteId}`}
                onClick={this.handleNoteClick}
                header={note.header}
                >
                {"created :" + new Date(note.createdAt).toLocaleString()}
                </ListGroupItem>
                : <ListGroupItem
                key="new"
                href="/notes/new"
                onClick={this.handleNoteClick}
                >
                <h4>
                  <b>{"\uFF0B"}</b> Create a New note
                  </h4>
                </ListGroupItem>
        );
      }

      handleNoteClick = event => {
        event.preventDefault();
        this.props.history.push(event.currentTarget.getAttribute("href"));
      }

      handleUserChange = async (selectedUser) => {
        var userNotes;
        userNotes = await API.get("notes", selectedUser.value);
        this.setState({notes: userNotes, selectedUser});
      }
    
      renderLander() {
        return (
          <div className="lander">
          <h1>Scratch</h1>
        <p>A simple note taking app</p>
        <div>
         <Link to="/login" className="btn btn-info btn-lg">
           Login
         </Link>
          <Link to="/signup" className="btn btn-success btn-lg">
           Signup
         </Link>
       </div>
     </div>
        );
      }


     
      renderNotes() {
        const { selectedUser } = this.state;
        return (
          <Fragment>
          <Select
          value={selectedUser}
          onChange={this.handleUserChange}
          options={this.state.currentUsers}/>
          <div className="notes">
            <PageHeader> {selectedUser? selectedUser.label : " "}  Notes</PageHeader>
            <ListGroup>
              {!this.state.isLoading && this.renderNotesList(this.state.notes)}
            </ListGroup>
          </div>
          </Fragment>
        );
      }
    
      render() {
        return (
          <div className="Home">
           {this.props.isAuthenticated ? this.renderNotes() : this.renderLander()}
          </div>
        );
      }
    }
