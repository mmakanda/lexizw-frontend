"use client"
import { Component, ReactNode } from "react"

interface State { hasError: boolean }

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"2rem"}}>
          <div style={{textAlign:"center"}}>
            <h2>Something went wrong</h2>
            <p>Please refresh the page.</p>
            <button onClick={() => this.setState({hasError:false})}>Try again</button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
