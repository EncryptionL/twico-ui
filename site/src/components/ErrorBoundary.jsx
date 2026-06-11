import React from "react";
import { Text } from "twico-ui";

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
        <Text tone="subtle" align="center" style={{ width: "100%", padding: 16 }}>
          Preview unavailable. See the code example below.
        </Text>
      );
    }
    return this.props.children;
  }
}
