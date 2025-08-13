// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/login'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* Outras rotas como: 
            <Route path="/cadastro" element={<Register />} /> 
            podem ser adicionadas aqui depois
        */}
      </Routes>
    </Router>
  )
}

export default App
