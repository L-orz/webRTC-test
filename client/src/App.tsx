import { RecoilRoot } from 'recoil'

import AppRouterView from '@/router'
import { Suspense } from 'react'

function App() {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <RecoilRoot>
        <AppRouterView></AppRouterView>
      </RecoilRoot>
    </Suspense>
  )
}

export default App
