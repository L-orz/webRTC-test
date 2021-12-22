import { FC, lazy, Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'

const DemoLazy = lazy(() => import('@/pages/Demo'))

const MainRouterView: FC = (props) => {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <Switch>
        <Route path="/demo" component={DemoLazy}></Route>
      </Switch>
    </Suspense>
  )
}

export default MainRouterView
