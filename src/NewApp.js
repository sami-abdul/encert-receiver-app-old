import React, { Component } from 'react';
import UserInfo from './UserInfo';

import { Card, Icon, Avatar,Modal, Button, Input, Form} from 'antd';
// import { Button } from 'antd';

import './App.css';

import { connect } from 'react-redux';
import { USER_DATA } from './redux/actions/signin-action';
import 'antd/dist/antd.css'
const blockstack = require('blockstack');
const { Meta } = Card;
const axios = require('axios');


class App extends Component {
  constructor(props) {
    super(props)

    let isSignedIn = this.checkSignedInStatus();

    this.state = {
      certificates:[],
      isSignedIn,
      person: undefined,
      revokedIsVisible: false,
      blockStackModalIsVisible: false,
      userIdentity: false,
      blockstackIdentity: "",
      blockStackEmail: "",
      blockStackName: "",
      clickedCertificate: {
        ID: "",
        achievementTitle: "",
        domain: "",
        coverImage: "",
        receiverName: "",
        blockstackID: "",
        issuerName: "",
        description: "",
        issueDate: "",
        revokedDate: "",
        reason: "",
        expirationDate: ''
      },
    };

    if(isSignedIn) {
      this.loadPerson();
    }

    this.handleSignIn = this.handleSignIn.bind(this)
    this.handleSignOut = this.handleSignOut.bind(this)
  }


  checkSignedInStatus() {
    if (blockstack.isUserSignedIn()) {
      return true;
    } else if (blockstack.isSignInPending()) {
      blockstack.handlePendingSignIn().then(function(userData) {
        window.location = window.location.origin
      });
      return false;
    }
  }

  loadPerson() {
    let username = blockstack.loadUserData().username
    console.log(blockstack.loadUserData(),"user data");
    let userData=blockstack.loadUserData();
    // history.push('/home');

    if(userData.identityAddress)
    {
      // alert("Identity exists in server. ", userData.identityAddress);
      let that = this;
      axios.get(`https://encert-server.herokuapp.com/issuer/participant/exist/${userData.identityAddress}`, {
      })
      .then(function (response) {

        console.log("Data exists for blockstack ID in server : ", response.data.data.result);
          if(!response.data.data.result)
          {
            that.setState({blockStackModalIsVisible: true});
          }


          blockstack.lookupProfile(username).then((person) => {
            that.setState({ person });
            console.log("LOOKUP RETURNS: ", person);
            that.props.USER_DATA(userData);
          })
      
          axios.get('https://encert-server.herokuapp.com/issuer/certificate/5cab45923b74ef720a4288b7')
          .then(function (response) {
            console.log(response.data.data.result);
            let arr=response.data.data.result
            that.setState({
              certificates:arr
            })
          console.log(that.state)
          })
      
          .catch(function (error) {
            console.log(error);
          });             
          console.log(that.state,"state");            
    
          that.setState({
            userIdentity: true,
            blockstackIdentity: userData.identityAddress
          })
      })
      .catch(function (error) {
        console.log("Error while fetching identity from server. ", error);
      });
}
    else
    {
      alert("No identity found in server.");  
    }
  }

  handleSignIn(event) {
    event.preventDefault();
    blockstack.redirectToSignIn()
  }

  handleSignOut(event) {
    event.preventDefault();
    blockstack.signUserOut(window.location.href)

  }
  showModal = () => {
    // console.log(event);
    this.setState({
      revokedIsVisible: true,
      blockStackModalIsVisible: true
      
    });
  }
  handleOk = () => {
    this.setState({ loading: false, revokedIsVisible: false });
  }
  handleCancel = () => {
    this.setState({ revokedIsVisible: false });
  }
  showRevokeModal = () => {
    this.setState({
      revokeCertificateIsVisible: true,
    });
  }

  showBlockStackModal = () =>
  {
    this.setState({
      blockStackModalIsVisible: true
    })
  }

  handleblockStackModalOk = () =>
  {
    this.setState({loading: true});
    let that = this;
      axios.put("https://encert-server.herokuapp.com/issuer/participant/", {
        blockstack_id: this.state.blockstackIdentity, 
        name: this.state.blockStackName,
        email: this.state.blockStackEmail
      })
      .then(function (response) {
      // that.setState({      //   blockStackModalIsVisible: false,      
      // });
        console.log("Server returned response for info insertion: ", response);
        that.setState({loading: false, blockStackModalIsVisible: false});        
      })
    .catch(function (error) {
      console.log("Error inserting data: ", error);
    }); 
    
  }

  handleblockStackModalCancel = () => 
  {
    this.setState({ blockStackModalIsVisible: false });
  }

  onBlockStackModalNameChange = (event) =>
  {
    console.log("Received Input: ", event.target.value);
    this.setState({
      blockStackName: event.target.value
    })
  }

  onBlockStackModalEmailChange = (event) =>
  {
    console.log("Received Input: ", event.target.value);
    this.setState({
      blockStackEmail: event.target.value
    })
  }

  handleBlockStackModalSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
      else
      {
          console.log("Validation succeeded! Submitting form.");
      }
    });
  }


  componentDidMount = () =>
  {
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    
    return (
      <div className="App">

      <header className="App-header">
          <h1 className="App-title">Blockstack Create React App</h1>
        </header>
        <div style={{display: this.state.isSignedIn ? 'none' : 'block' }}>
          <button onClick={this.handleSignIn}>
            Sign-in with Blockstack
          </button>
        </div>
        <div style={{display: !this.state.isSignedIn ? 'none' : 'absolute' }}>
        <UserInfo user={this.state.person} />
          <button onClick={this.handleSignOut}>
            Sign-out
          </button>
          <div>


          <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>Remember me</Checkbox>
          )}
          <a className="login-form-forgot" href="">Forgot password</a>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
          Or <a href="">register now!</a>
        </Form.Item>
      </Form>


          <Card
          onClick={() => this.showModal()}
    style={{ width: 300 }}
    cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
    // actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
  >
    <Meta
      avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
      title="Card title"
      description="This is the description"
    />
  </Card>



  <br/><br/>
  </div>
  <div>
          <Modal
            visible={this.state.revokedIsVisible}
            title="Revoked Certificate Details"
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={[
              <Button key="submit" type="primary" onClick={this.handleOk}>
                OK
              </Button>,
            ]}
          >
            <p>{`ID: ${this.state.clickedCertificate.ID}`}</p>
            <p>{`Achievement Title:  ${this.state.clickedCertificate.achievementTitle}`}</p>
            <p>{`Domain:  ${this.state.clickedCertificate.domain}`}</p>
            <p>{`Cover Image: ${this.state.clickedCertificate.coverImage}`}</p>
            <p>{`Receiver Name: ${this.state.clickedCertificate.receiverName}`}</p>
            <p>{`Blockstack ID: ${this.state.clickedCertificate.blockstackID}`}</p>
            <p>{`Issuer Name: ${this.state.clickedCertificate.issuerName}`}</p>
            <p>{`Description: ${this.state.clickedCertificate.description}`}</p>
            <p>{`Issue Date: ${this.state.clickedCertificate.issueDate}`}</p>
            <p>{`Expiration Date: ${this.state.clickedCertificate.expirationDate}`}</p>
          </Modal>
        </div>
        <div>
          <Modal
            visible={this.state.blockStackModalIsVisible}
            title="Enter Blockstack Details"
            onOk={this.handleblockStackModalOk}
            onCancel={this.handleblockStackModalCancel}
            footer={[
              <Button key="submit" type="primary" onClick={this.handleblockStackModalOk}>
                SUBMIT
              </Button>,
            ]}
          >
            Name: <Input placeholder="Blockstack Name" onChange = {this.onBlockStackModalNameChange} />
            Email: <Input placeholder="Blockstack Name" onChange = {this.onBlockStackModalEmailChange} />
          </Modal>
        </div>
        </div>


      </div>
    )
  }
}


function mapDispatchToProp(dispatch) {
  return ({
      USER_DATA: (user) => {
          dispatch(USER_DATA(user))
      },
  })
}


export default connect(null,mapDispatchToProp)(App);

// export default App;
