import React from 'react'
import { Globe } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="airbnb-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-sm mb-4">Support</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><a href="#" className="hover:underline">Help Center</a></li>
              <li><a href="#" className="hover:underline">Safety Information</a></li>
              <li><a href="#" className="hover:underline">Cancellation Options</a></li>
              <li><a href="#" className="hover:underline">Report a Concern</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-4">Community</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><a href="#" className="hover:underline">Disaster Relief Housing</a></li>
              <li><a href="#" className="hover:underline">Combating Discrimination</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-4">Hosting</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><a href="#" className="hover:underline">Try Hosting</a></li>
              <li><a href="#" className="hover:underline">Protection for Hosts</a></li>
              <li><a href="#" className="hover:underline">Explore Hosting Resources</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-4">About</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><a href="#" className="hover:underline">Newsroom</a></li>
              <li><a href="#" className="hover:underline">Learn About Features</a></li>
              <li><a href="#" className="hover:underline">Careers</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>© 2026 Rental, Inc.</span>
            <span>·</span>
            <a href="#" className="hover:underline">Privacy</a>
            <span>·</span>
            <a href="#" className="hover:underline">Terms</a>
            <span>·</span>
            <a href="#" className="hover:underline">Sitemap</a>
          </div>
          <div className="flex items-center gap-4 text-sm font-semibold">
            <button className="flex items-center gap-2 hover:underline">
              <Globe className="w-4 h-4" />
              English (US)
            </button>
            <button className="hover:underline">$ USD</button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer