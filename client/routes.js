import React, {Component} from 'react'
import {Route, Switch} from 'react-router-dom'
import {Login, Signup, UserHome, Home, Create, WorldList} from './components'
import {db} from './firebase'
import Avatar from './components/Avatar'

/**
 * COMPONENT
 */
export default class Routes extends Component {
  componentDidMount() {}

  render() {
    return (
      <Switch>
        {/* Routes placed here are available to all visitors */}
        <Route exact path="/" component={Home} />
        <Route exact path="/create" component={Create} />
        <Route path="/create/:id" component={Create} />
        <Route path="/worlds" component={WorldList} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/avatar" component={Avatar} />
      </Switch>
    )
  }
}
