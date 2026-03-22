import { Component } from 'react'
import type { ReactNode } from 'react'

interface ErrorBoundaryState {
  hasError: boolean
}

export default class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    console.error('Error boundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="m-10 rounded-xl border border-red-300 bg-red-50 p-8 text-center text-red-700 dark:border-red-700 dark:bg-red-900/30">
          <h1 className="text-2xl font-bold">Something went wrong.</h1>
          <p>Please refresh or try again later.</p>
        </div>
      )
    }
    return this.props.children
  }
}
