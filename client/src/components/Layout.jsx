import CEO_Dashboard from "./CEO_Dashboard"

export default function Layout({ children }) {
  return (
    <div className="flex">
      <CEO_Dashboard />
      <main className="flex-1 p-6 bg-gray-50 min-h-screen">
        {children}
      </main>
    </div>
  )
}
