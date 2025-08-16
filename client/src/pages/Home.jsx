import React from 'react'
import SideBar from '../components/SideBar'
import Topbar from '../components/Topbar'
import Footer from '../components/Footer'
import { Outlet } from 'react-router-dom'

const Home = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        {/* Topbar */}
        <Topbar />

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}

export default Home