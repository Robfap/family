"use strict";
import ReactDOM from 'react-dom';
import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import { apiMiddleware } from 'redux-api-middleware';
import App from './appComponent';
import rootReducer from './reducers/rootReducer';
import { Router, Route, browserHistory } from 'react-router';
import About from './about';

let middlewares = [apiMiddleware, thunk];

if (process.env.NODE_ENV !== "production") {
    const logger = createLogger();
    middlewares.push(logger);
}

console.log(process.env.NODE_ENV);

let store = createStore(rootReducer, applyMiddleware(...middlewares));

ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={App} />
            <Route path="show" component={App} />
            <Route path="about" component={About} />
        </Router>

    </Provider>
    ,
document.getElementsByClassName('app')[0]
);
