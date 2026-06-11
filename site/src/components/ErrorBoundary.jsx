import React from "react";

// Keeps one broken live demo from taking down the whole page.
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div className="docs-demo-fallback">
          Preview unavailable. See the code example below.
        </div>
      );
    }
    return this.props.children;
  }
}
