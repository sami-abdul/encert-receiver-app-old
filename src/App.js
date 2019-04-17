// import React, { Component } from 'react';
// import UserInfo from './UserInfo';

// import { Card, Icon, Avatar, Modal, Button, Input, message } from 'antd';

// import './App.css';

// import { connect } from 'react-redux';
// import { USER_DATA } from './redux/actions/signin-action';
// import 'antd/dist/antd.css'
// import { Container, Row, Col } from 'react-grid-system';

// const blockstack = require('blockstack');
// const { Meta } = Card;
// const axios = require('axios');


// class App extends Component {
//   constructor(props) {
//     super(props)

//     let isSignedIn = this.checkSignedInStatus();

//     this.state = {
//       certificates: [],
//       isSignedIn,
//       person: undefined,
//       revokedIsVisible: false,
//       blockStackModalIsVisible: false,
//       userIdentity: false,
//       blockstackIdentity: "",
//       blockStackEmail: "",
//       blockStackName: "",
//       displayCertificates: null,
//       clickedCertificate: {
//         ID: "",
//         achievementTitle: "",
//         domain: "",
//         coverImage: "",
//         receiverName: "",
//         blockstackID: "",
//         issuerName: "",
//         description: "",
//         issueDate: "",
//         revokedDate: "",
//         reason: "",
//         expirationDate: ''
//       },
//     };

//     if (isSignedIn) {
//       this.loadPerson();
//     }

//     this.handleSignIn = this.handleSignIn.bind(this)
//     this.handleSignOut = this.handleSignOut.bind(this)
//   }


//   checkSignedInStatus() {
//     if (blockstack.isUserSignedIn()) {
//       return true;
//     } else if (blockstack.isSignInPending()) {
//       blockstack.handlePendingSignIn().then(function (userData) {
//         window.location = window.location.origin
//       });
//       return false;
//     }
//   }

//   loadPerson() {
//     let username = blockstack.loadUserData().username
//     console.log(blockstack.loadUserData(), "user data");
//     let userData = blockstack.loadUserData();
//     // history.push('/home');

//     if (userData.identityAddress) {
//       // alert("Identity exists in server. ", userData.identityAddress);
//       let that = this;
//       axios.get(`https://encert-server.herokuapp.com/issuer/participant/exist/${userData.identityAddress}`, {
//       })
//         .then(function (response) {

//           console.log("Data exists for blockstack ID in server : ", response.data.data.result);
//           if (!response.data.data.result) {
//             that.setState({ blockStackModalIsVisible: true });
//           }


//           blockstack.lookupProfile(username).then((person) => {
//             that.setState({ person });
//             console.log("LOOKUP RETURNS: ", person);
//             that.props.USER_DATA(userData);
//           })

//           axios.get("https://encert-server.herokuapp.com/issuer/certificate/blockstack/" + userData.identityAddress)
//             .then(function (response) {
//              console.log("Certificate Array is: ", response.data.data.results);
//               console.log("CERTIFICATES: " + response.data.data.results);
//               let arr = response.data.data.results
//               let displayCerts = arr.map(cert => {
//                 return (
//                     <Col md={3} sm={12}>
//                         <Card
//                         onClick={() => that.showModal()}
//                         // style={{ width: 300 }}
//                         cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
//                       // actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
//                       >
//                         <Meta
//                           avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
//                           title= {cert.achievement_title}
//                           description="This is the description"
//                         />
//                       </Card>
//                     </Col>
//                   );
//               });
//               that.setState({
//                 certificates: arr,
//                 displayCertificates: displayCerts
//               })
//               console.log(that.state)
//             })

//             .catch(function (error) {
//               console.log(error);
//             });
//           console.log(that.state, "state");

//           that.setState({
//             userIdentity: true,
//             blockstackIdentity: userData.identityAddress
//           })
//         })
//         .catch(function (error) {
//           console.log("Error while fetching identity from server. ", error);
//         });
//     }
//     else {
//       alert("No identity found in server.");
//     }
//   }

//   handleSignIn(event) {
//     event.preventDefault();
//     blockstack.redirectToSignIn()
//   }

//   handleSignOut(event) {
//     event.preventDefault();
//     blockstack.signUserOut(window.location.href)

//   }
//   showModal = () => {
//     // console.log(event);
//     this.setState({
//       revokedIsVisible: true,
// //      blockStackModalIsVisible: true

//     });
//   }
//   handleOk = () => {
//     this.setState({ loading: false, revokedIsVisible: false });
//   }
//   handleCancel = () => {
//     this.setState({ revokedIsVisible: false });
//   }
//   showRevokeModal = () => {
//     this.setState({
//       revokeCertificateIsVisible: true,
//     });
//   }

//   showBlockStackModal = () => {
//     this.setState({
//       blockStackModalIsVisible: true
//     })
//   }

//   handleblockStackModalOk = () => {
//     this.setState({ loading: true });
//     let that = this;
//     axios.put("https://encert-server.herokuapp.com/issuer/participant/", {
//       blockstack_id: this.state.blockstackIdentity,
//       email: this.state.blockStackEmail
//     })
//       .then(function (response) {
//         console.log("Server returned response for info insertion: ", response);
//         that.showMessage("Data submitted. Redirecting...", "success");
//         that.setState({ loading: false, blockStackModalIsVisible: false });
//       })
//       .catch(function (error) {
//         console.log("Error inserting data: ", error);
//         that.showMessage("Error submitting data. Please check your information and retry.", "error");
//         that.setState({ loading: false });
//       });

//   }

//   handleblockStackModalCancel = () => {
//     this.setState({ blockStackModalIsVisible: false });
//   }

//   onBlockStackModalNameChange = (event) => {
//     console.log("Received Input: ", event.target.value);
//     this.setState({
//       blockStackName: event.target.value
//     })
//   }

//   onBlockStackModalEmailChange = (event) => {
//     console.log("Received Input: ", event.target.value);
//     this.setState({
//       blockStackEmail: event.target.value
//     })
//   }

//   handleBlockStackModalSubmit = (e) => {
//     e.preventDefault();
//     this.props.form.validateFields((err, values) => {
//       if (!err) {
//         console.log('Received values of form: ', values);
//       }
//       else {
//         console.log("Validation succeeded! Submitting form.");
//       }
//     });
//   }

//   showMessage = (text, type) => {

//     if (type == "success") {
//       message.success(text, 5000);
//     }
//     else if (type == "warning") {
//       message.warning(text, 5000);
//     }
//     else if (type == "error") {
//       message.error(text, 5000);
//     }
//     // else
//     // {
//     //   message.warning(text, 5000);
//     // }
//   };


//   render() {
//     // const { getFieldDecorator } = this.props.form;

//     return (
//       <div className="App">

//         <header className="App-header">
//           <h1 className="App-title">Blockstack Create React App</h1>
//         </header>
//         <div style={{ display: this.state.isSignedIn ? 'none' : 'block' }}>
//           <button onClick={this.handleSignIn}>
//             Sign-in with Blockstack
//           </button>
//         </div>

//         <div style={{ display: !this.state.isSignedIn ? 'none' : 'absolute' }}>
//         {
//           !this.state.blockStackModalIsVisible ?
//           <div>
//             <div>
//             <UserInfo user={this.state.person} />
//             <button onClick={this.handleSignOut}>
//               Sign-out
//             </button>
//             </div>
//             <br />
//             <Container>
//             <Row>
//             {this.state.displayCertificates}
//             </Row>
//             </Container>
//             <br />
//             {/* <div>
//               <Card
//                 onClick={() => this.showModal()}
//                 style={{ width: 300 }}
//                 cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
//               // actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
//               >
//                 <Meta
//                   avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
//                   title="Card title"
//                   description="This is the description"
//                 />
//               </Card>
//             </div> */}
//           </div>
//             :
//             <div>
//               <div>
//                 <Input
//                   placeholder="Enter your email address"
//                   prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
//                   onChange={this.onBlockStackModalEmailChange}
//                 />
//                 <Button type="primary" loading={this.state.loading} onClick={this.handleblockStackModalOk}>
//                   Click me!
//                 </Button>
//               </div>

//               {/* <br /><br /> */}
//             </div>
//         }
//         </div>
        
        
//         <div>
//             <Modal
//               visible={this.state.revokedIsVisible}
//               title="Revoked Certificate Details"
//               onOk={this.handleOk}
//               onCancel={this.handleCancel}
//               footer={[
//                 <Button key="submit" type="primary" onClick={this.handleOk}>
//                   OK
//               </Button>,
//               ]}
//             >
//               <p>{`ID: ${this.state.clickedCertificate.ID}`}</p>
//               <p>{`Achievement Title:  ${this.state.clickedCertificate.achievementTitle}`}</p>
//               <p>{`Domain:  ${this.state.clickedCertificate.domain}`}</p>
//               <p>{`Cover Image: ${this.state.clickedCertificate.coverImage}`}</p>
//               <p>{`Receiver Name: ${this.state.clickedCertificate.receiverName}`}</p>
//               <p>{`Blockstack ID: ${this.state.clickedCertificate.blockstackID}`}</p>
//               <p>{`Issuer Name: ${this.state.clickedCertificate.issuerName}`}</p>
//               <p>{`Description: ${this.state.clickedCertificate.description}`}</p>
//               <p>{`Issue Date: ${this.state.clickedCertificate.issueDate}`}</p>
//               <p>{`Expiration Date: ${this.state.clickedCertificate.expirationDate}`}</p>
//             </Modal>
//           </div>
//       </div>
//     )
//   }
// }


// function mapDispatchToProp(dispatch) {
//   return ({
//     USER_DATA: (user) => {
//       dispatch(USER_DATA(user))
//     },
//   })
// }


// export default connect(null, mapDispatchToProp)(App);

// // export default App;





import React, { Component } from 'react';
import UserInfo from './UserInfo';

import { Card, Icon, Avatar, Modal, Button, Input, message } from 'antd';

import './App.css';

import { connect } from 'react-redux';
import { USER_DATA } from './redux/actions/signin-action';
import 'antd/dist/antd.css'
import blockstackLogo from './assets/blockstack-icon.svg'
import encertLogo from './assets/logo-blackweb.png'
import { Container, Row, Col } from 'react-grid-system';

const blockstack = require('blockstack');
const { Meta } = Card;
const axios = require('axios');


class App extends Component {
  constructor(props) {
    super(props)

    let isSignedIn = this.checkSignedInStatus();

    this.state = {
      certificates: [],
      isSignedIn,
      person: undefined,
      revokedIsVisible: false,
      blockStackModalIsVisible: false,
      userIdentity: false,
      blockstackIdentity: "",
      blockStackEmail: "",
      blockStackName: "",
      displayCertificates: null,
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

    if (isSignedIn) {
      this.loadPerson();
    }

    this.handleSignIn = this.handleSignIn.bind(this)
    this.handleSignOut = this.handleSignOut.bind(this)
  }


  checkSignedInStatus() {
    if (blockstack.isUserSignedIn()) {
      return true;
    } else if (blockstack.isSignInPending()) {
      blockstack.handlePendingSignIn().then(function (userData) {
        window.location = window.location.origin
      });
      return false;
    }
  }

  loadPerson() {
    let username = blockstack.loadUserData().username
    console.log(blockstack.loadUserData(), "user data");
    let userData = blockstack.loadUserData();
    // history.push('/home');

    if (userData.identityAddress) {
      // alert("Identity exists in server. ", userData.identityAddress);
      let that = this;
      axios.get(`https://encert-server.herokuapp.com/issuer/participant/exist/${userData.identityAddress}`, {
      })
        .then(function (response) {

          console.log("Data exists for blockstack ID in server : ", response.data.data.result);
          if (!response.data.data.result) {
            that.setState({ blockStackModalIsVisible: true });
          }


          blockstack.lookupProfile(username).then((person) => {
            that.setState({ person });
            console.log("LOOKUP RETURNS: ", person);
            that.props.USER_DATA(userData);
          })

          axios.get("https://encert-server.herokuapp.com/issuer/certificate/blockstack/" + userData.identityAddress)
            .then(function (response) {
             console.log("Certificate Array is: ", response.data.data.results);
              console.log("CERTIFICATES: " + response.data.data.results);
              let arr = response.data.data.results
              let displayCerts = arr.map(cert => {
                return (
                    <Col md={3} sm={12}>
                        <Card
                        onClick={() => this.showModal()}
                        // style={{ width: 300 }}
                        cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
                      // actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
                      >
                        <Meta
                          avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                          title= {cert.achievement_title}
                          description="This is the description"
                        />
                      </Card>
                    </Col>
                  );
              });
              that.setState({
                certificates: arr,
                displayCertificates: displayCerts
              })
              console.log(that.state)
            })

            .catch(function (error) {
              console.log(error);
            });
          console.log(that.state, "state");

          that.setState({
            userIdentity: true,
            blockstackIdentity: userData.identityAddress
          })
        })
        .catch(function (error) {
          console.log("Error while fetching identity from server. ", error);
        });
    }
    else {
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

  showBlockStackModal = () => {
    this.setState({
      blockStackModalIsVisible: true
    })
  }

  handleblockStackModalOk = () => {
    this.setState({ loading: true });
    let that = this;
    axios.put("https://encert-server.herokuapp.com/issuer/participant/", {
      blockstack_id: this.state.blockstackIdentity,
      email: this.state.blockStackEmail
    })
      .then(function (response) {
        console.log("Server returned response for info insertion: ", response);
        that.showMessage("Data submitted. Redirecting...", "success");
        that.setState({ loading: false, blockStackModalIsVisible: false });
      })
      .catch(function (error) {
        console.log("Error inserting data: ", error);
        that.showMessage("Error submitting data. Please check your information and retry.", "error");
        that.setState({ loading: false });
      });

  }

  handleblockStackModalCancel = () => {
    this.setState({ blockStackModalIsVisible: false });
  }

  onBlockStackModalNameChange = (event) => {
    console.log("Received Input: ", event.target.value);
    this.setState({
      blockStackName: event.target.value
    })
  }

  onBlockStackModalEmailChange = (event) => {
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
      else {
        console.log("Validation succeeded! Submitting form.");
      }
    });
  }

  showMessage = (text, type) => {

    if (type == "success") {
      message.success(text, 5000);
    }
    else if (type == "warning") {
      message.warning(text, 5000);
    }
    else if (type == "error") {
      message.error(text, 5000);
    }
    // else
    // {
    //   message.warning(text, 5000);
    // }
  };


  render() {
    // const { getFieldDecorator } = this.props.form;

    return (
      <div className="App">

        {/* <header className="App-header">
          <h1 className="App-title">Encert</h1>
        </header> */}
        <header className="App-header">
          <h1 className="App-title">Encert</h1>
        </header>

        <div className="signin-container" style={{ display: this.state.isSignedIn ? 'none' : 'block' }}>
          <div>
            <img className="logo" src={encertLogo} />
          </div>

          <Button className="signin-btn" onClick={this.handleSignIn}>
          <img className="blockstack-logo" src={blockstackLogo} />
          <span className="signin-btn-text">
          Sign-in with Blockstack
          </span>
          </Button>

        </div>

        <div style={{ display: !this.state.isSignedIn ? 'none' : 'absolute' }}>
        {
          !this.state.blockStackModalIsVisible ?
          <div>
            <div>
            <UserInfo user={this.state.person} />
            <button onClick={this.handleSignOut}>
              Sign-out
            </button>
            </div>
            <br />
            <Container>
            <Row>
            {this.state.displayCertificates}
            </Row>
            </Container>
            <br />
            {/* <div>
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
            </div> */}
          </div>
            :
            <div>
              <div>
                <Input
                  placeholder="Enter your email address"
                  prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  onChange={this.onBlockStackModalEmailChange}
                />
                <Button type="primary" loading={this.state.loading} onClick={this.handleblockStackModalOk}>
                  Click me!
                </Button>
              </div>

              {/* <br /><br /> */}
            </div>
        }
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


export default connect(null, mapDispatchToProp)(App);

// export default App;
