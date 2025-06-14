import React from 'react'

function Footer() {
  return (
    <footer className="bg-gray-50 py-8 text-center border-t mt-auto">
    <p className="text-gray-500 text-sm">
      &copy; {new Date().getFullYear()} ShelfShare. All rights reserved.
    </p>
    <p className="mt-2 text-sm">
      <a href="/privacy-policy" className="text-gray-500 hover:text-yellow-500 transition-colors">Privacy Policy</a> |
      <a href="/terms-of-service" className="text-gray-500 hover:text-yellow-500 transition-colors ml-2">Terms of Service</a>
    </p>
  </footer>
  )
}

export default Footer