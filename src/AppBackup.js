import React, { Component } from 'react';
import UserInfo from './UserInfo';

import { Card, Icon, Avatar,Modal, Button, } from 'antd';
// import { Button } from 'antd';

import './App.css';

// import UserInfo from './UserInfo';
import { connect } from 'react-redux';
import { USER_DATA } from './redux/actions/signin-action';
import history from './config/history'
import Home from './mainPage';
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
    }

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
      })
      return false;
    }
  }

  loadPerson() {
    let username = blockstack.loadUserData().username
    console.log(blockstack.loadUserData(),"user data")
    let userData=blockstack.loadUserData();
    // history.push('/home');


    blockstack.lookupProfile(username).then((person) => {
      this.setState({ person })
      this.props.USER_DATA(userData);
    })

    let that=this;
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
    
    console.log(this.state,"state");
    
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

  render() {
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


  
  <br/><br/>>
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
            {/* <p>{`Revoked Date: ${this.state.clickedCertificate.revokedDate}`}</p>
                    <p>{`Reason of Revocation: ${this.state.clickedCertificate.reason}`}</p> */}
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
