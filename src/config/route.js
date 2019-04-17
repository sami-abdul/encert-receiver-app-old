import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  
} from 'react-router-dom';
import history from './history';
import App from '../App'
import Home from '../mainPage'
// history={history}

// const Routing = () => {
//   return (
//     <HashRouter>
//       <Structure/>
//     </HashRouter>
//   )
// }

// const Structure = () => {
//   return( <div>
//   <BasicRouting/>
//   </div>
//   )
// }

// componentDidUpdate() {
//   window.scrollTo(0,0);
// }
// onUpdate={() => window.scrollTo(0, 0)}
const BasicRouting = () => {
  // history.listen(_ => {
  //     window.scrollTo(0, 0)  
  //     })
  return ( 
    //   <Router onUpdate={() => window.scrollTo(0, 0)} history={history}>
      <Router  history={history}>
    <div>
       
        
            <Route exact path="/" component={App} />
            <Route exact path="/home" component={Home} />
            
          
            
        
        </div>
    </Router>
  )
}

export default (BasicRouting);