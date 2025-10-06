import { render } from 'solid-js/web'
import App from './App'

function Root() {
  return <App />
}

render(() => <Root />, document.getElementById('root')!)
