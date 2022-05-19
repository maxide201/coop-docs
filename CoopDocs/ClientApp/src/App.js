import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { Counter } from './components/Counter';
import { Signup } from './components/Signup';
import { Signin } from './components/Signin';
import { Documents } from './components/Documents';
import { EditorPage } from './components/EditorPage';

import './custom.css'

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
            <Route exact path='/' component={Home} />
            <Route path='/signup' component={Signup} />
            <Route path='/signin' component={Signin} />
            <Route path='/documents' component={Documents} />
            <Route path="/editor/:id" component={EditorPage}/>
      </Layout>
    );
  }
}
