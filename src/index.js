import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import Chart from './components/Chart'

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root')
  )
}

render(Chart)

if (module.hot) {
  module.hot.accept('./components/Chart', () => { render(Chart) })
}
