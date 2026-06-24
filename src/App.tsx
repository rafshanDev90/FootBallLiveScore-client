import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Matches from './pages/Matches'
import Standings from './pages/Standings'
import MatchDetail from './pages/MatchDetail'
import TeamPage from './pages/Team'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/matches/:id" element={<MatchDetail />} />
          <Route path="/standings" element={<Standings />} />
          <Route path="/teams/:id" element={<TeamPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
