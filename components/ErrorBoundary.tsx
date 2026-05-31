'use client'
import { Component, ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { hasError: boolean; requestId?: string }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[LexiZW ErrorBoundary]', error, info.componentStack)
    // TODO: send to Sentry when configured
    // Sentry.captureException(error, { extra: { componentStack: info.componentStack } })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md p-8">
            <div className="text-4xl mb-4">⚖️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-500 mb-6 text-sm">
              An unexpected error occurred. Please refresh the page.
              If the issue persists, contact{' '}
              <a href="mailto:support@lexizw.com" className="text-blue-600 underline">
                support@lexizw.com
              </a>
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
