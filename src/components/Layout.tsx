import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-bg-base">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
