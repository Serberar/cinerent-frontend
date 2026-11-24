import { BrowserRouter as Router } from 'react-router-dom'
import Path from './components/Path'
import Nav from './components/Nav/Nav'
import { StoreProvider } from './store/StoreProvider'

function App() {
  return (
    <StoreProvider>
      <Router basename={import.meta.env.BASE_URL}>
        <Nav />
        <Path />
      </Router>
    </StoreProvider>
  )
}

export default App
