import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function Portal({ children }) {
  const [mounted, setMounted] = useState(false);
  const [portalRoot, setPortalRoot] = useState(null);

  useEffect(() => {
    const root = document.getElementById("portal-root");
    setPortalRoot(root);
    setMounted(true);
  }, []);

  if (!mounted || !portalRoot) return null;

  return createPortal(children, portalRoot);
}
