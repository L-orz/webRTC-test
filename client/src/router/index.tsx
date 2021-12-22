import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom'

import MainRouterView from './Main'

function AppRouterView() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={MainRouterView} />
      </Switch>
    </Router>
  )
}

export default AppRouterView
