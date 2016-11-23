import App from './App.jsx';
import Board from './Pages/Board.jsx';
import Index from './Pages/Index.jsx';
import NotFound from './Pages/NotFound.jsx';
import services from '../services';
import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

// const authCheck = (nextState, replace, callback) => {
//     services.user.getCurrentUser().then((response) => {
//         if (!response.content.loggedIn){
//             replace('/signin');
//         }
//         callback();
//     }).catch((err) => {
//         console.log("Err on getCurrentUser() : ", err);
//         callback();
//     });
// };

export default (
    <Router history={browserHistory} >
        <Route path='/' component={App}  >
            <IndexRoute component={Index}/>
            <Route path="boards"
                   component={Board} />
            <Route path="users/:username"
                   component={Profile}
                   onEnter={authCheck} />
            <Route path="*"
                   component={NotFound} />
        </Route>
    </Router>
);
