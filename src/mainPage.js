import React, { Component } from 'react';
import UserInfo from './UserInfo';

const blockstack = require('blockstack');


class Home extends Component {
    constructor(props){
        super(props)
        this.handleSignOut = this.handleSignOut.bind(this)
    }

    handleSignOut(event) {
        event.preventDefault();
        blockstack.signUserOut(window.location.href)
    
      }


    render() {
        console.log("here")
        return (
            <div>
                Home page      
                <p style={{display: !this.state.isSignedIn ? 'none' : 'block' }}>
          <UserInfo user={this.state.person} />
          <button onClick={this.handleSignOut}>
            Sign-out
          </button>
        </p>          
            </div>
        );
    }
}

export default Home;