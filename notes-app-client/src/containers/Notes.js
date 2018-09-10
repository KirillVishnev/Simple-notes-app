import React, {Component} from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import AsyncSelect from "react-select/lib/Async";
import Select from "react-select";
import {API, Storage} from "aws-amplify";
import {s3Upload} from "../libs/awsLib"; 
import "./Notes.css";

export default class Notes extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
        isLoading: null,
        isDeleting: null,
        note: null,
        header: "",
        content: "",
        sharedusers: [],
        userts: null,
        attachmentURL: null,
        file: false
    };
  }

  async componentDidMount() {
    try {
      let attachmentURL;
      const note = await this.getNote();
      const { header, content, sharedusers, attachment } = note;
      var isMy = note.userId==this.props.currentUser.username ? true : false;
      var isShared = note.sharedusers.filter(user => user.label==this.props.currentUser.username).length >= 0 || isMy ? true : false;
      var shusers = null;
      if (attachment) {
        attachmentURL = await Storage.vault.get(attachment, {level: 'public'});
      }
      const us= await this.getUsers();
      const allUsers= us.map(
        function (user) {
          return({
            value: user.Attributes[1].Value,
            label: user.Username
            });
    });
    console.log(allUsers);
    if(sharedusers != []){
      shusers = sharedusers;
    }
      this.setState({
        note,
        header,
        shusers,
        sharedusers,
        content,
        users: allUsers,
        isMy,
        isShared,
        attachmentURL
      });
    } catch (e) {
      alert(e);
    }
  }

  getNote() {
    return API.get("notes", `/notes/${this.props.match.params.id}`);
  }

  saveNote(note) {
    return API.put("notes", `/notes/${this.props.match.params.id}`, {
      body: note
    });
  }

  deleteNote(){
      return API.del("notes", `/notes/${this.props.match.params.id}`);
  }

  getUsers() {
    return API.get("notes", "/users");
}


  validateForm() {
    return this.state.content.length > 0 &&
           this.state.header.length > 0;
  }
  
  formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }
  
  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }
  
  handleFileChange = event => {
    this.file = event.target.files[0];
  }
  
  handleSubmit = async event => {
      let attachment;

      event.preventDefault();
  
    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE/1000000} MB.`);
      return;
    }


    
    this.setState({ isLoading: true });
    
    const userlist = this.state.shusers;

    try {
        if (this.file) {
          attachment = await s3Upload(this.file);
        }
    
        var newSharedUsers =this.state.shusers.filter( user => this.state.sharedusers.indexOf(user) == -1);; 

        await this.saveNote({
          content: this.state.content,
          header: this.state.header,
          sharedusers: userlist,
          attachment: attachment || this.state.note.attachment,
          newsharedusers: newSharedUsers 
        });
        this.props.history.push("/");
      } catch (e) {
        alert(e);
        this.setState({ isLoading: false });
      }
    }

 
  
  
  
  
  handleDelete = async event => {
    event.preventDefault();
  
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );
  
    if (!confirmed) {
      return;
    }
  
    this.setState({ isDeleting: true });
    
    try{
        if(this.state.note.attachment){
        await Storage.remove(this.state.note.attachment, {level: 'public'});
        }

        await this.deleteNote();
        this.props.history.push("/");
    }catch(e){
        alert(e);
        this.setState({isDeleting: false});
    }
  }

  handleUserChange = shared => {
    this.setState({shusers: shared});
  }
  
  render() {
    return (
      <div className="Notes">
        {this.state.note &&
          <form onSubmit={this.handleSubmit}>
            <FormGroup controlId="header">
            <ControlLabel>Header</ControlLabel>
              <FormControl
                onChange={this.handleChange}
                value={this.state.header}
                type="text"
                disabled={!this.state.isShared}
              />
            </FormGroup>
            <FormGroup controlId="content">
            <ControlLabel>Content</ControlLabel>
              <FormControl
                onChange={this.handleChange}
                value={this.state.content}
                componentClass="textarea"
                disabled={!this.state.isShared}
              />
              </FormGroup>
            <FormGroup controlId="Author">
            <ControlLabel>Author: {this.state.note.userId}</ControlLabel>
            </FormGroup>
            {this.state.note.attachment &&
              <FormGroup>
                <ControlLabel>Attachment</ControlLabel>
                <FormControl.Static>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={this.state.attachmentURL}
                  >
                    {this.formatFilename(this.state.note.attachment)}
                  </a>
                </FormControl.Static>
              </FormGroup>}
           { (this.state.isMy || this.state.isShared) && ( 
           <FormGroup controlId="file">
              {!this.state.note.attachment &&
                <ControlLabel>Attachment</ControlLabel>}
              <FormControl onChange={this.handleFileChange} type="file" />
           </FormGroup> )}
            {this.state.isMy && 
            (<FormGroup>
              <ControlLabel>Share</ControlLabel>
            <Select
             isMulti
             value={this.state.shusers}
             onChange={this.handleUserChange}
             options={this.state.users}
             />
            </FormGroup>) }
           { (this.state.isMy || this.state.isShared) &&(
           <LoaderButton
              block
              bsStyle="primary"
              bsSize="large"
              disabled={!this.validateForm()}
              type="submit"
              isLoading={this.state.isLoading}
              text="Save"
              loadingText="Saving…"
           />)}
            { this.state.isMy && (<LoaderButton
              block
              bsStyle="danger"
              bsSize="large"
              isLoading={this.state.isDeleting}
              onClick={this.handleDelete}
              text="Delete"
              loadingText="Deleting…"
            />)}
          </form>}
      </div>
    );
  }
}