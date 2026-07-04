import * as React from "react";

export interface PortalProps {
  children?: React.ReactNode;
}

export function Portal(props: PortalProps): React.ReactPortal | React.ReactNode | null;
