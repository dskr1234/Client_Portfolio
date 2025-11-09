import React from "react"

export default class ErrorBoundary extends React.Component {
  constructor(props){ super(props); this.state = { hasError: false } }
  static getDerivedStateFromError(){ return { hasError: true } }
  componentDidCatch(err, info){ console.error("UI error:", err, info) }
  render(){
    if (this.state.hasError) {
      return (
        <div className="soft-2 rounded-[28px] neo p-6 text-rose-300">
          Something went wrong while rendering. Please refresh.
        </div>
      )
    }
    return this.props.children
  }
}
