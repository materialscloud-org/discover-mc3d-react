import React, { useState, useEffect } from "react";
import "./index.css";

// Helper container component.
function FloatingContainer({
  children, // content inside the container
  heading, // heading aligned to hamburger
  expandedStyle = { top: 150, left: 20, width: 250 },
  minimizedStyle = { top: 150, left: 20, width: 40 },
  initialCollapsed = false, // start state.
  autoshrinkSize = 1440, // autoshrink
}) {
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [userToggled, setUserToggled] = useState(false);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // No autoclose if the user has clicked atleast once.
    if (userToggled) return;

    // autoclose on small pages
    if (windowWidth < autoshrinkSize && !collapsed) {
      setCollapsed(true);
    } else if (
      windowWidth >= autoshrinkSize &&
      collapsed &&
      !initialCollapsed
    ) {
      setCollapsed(false);
    }
  }, [windowWidth, autoshrinkSize, collapsed, initialCollapsed, userToggled]);

  // userToggle.
  const toggleCollapse = () => {
    setUserToggled(true);
    setCollapsed(!collapsed);
  };

  // dont show at all if the page is tiny?
  if (windowWidth < 300) return null;

  // restyle based on state.
  const style = collapsed
    ? { position: "fixed", ...minimizedStyle }
    : { position: "fixed", ...expandedStyle };

  return (
    <div
      className={`floating-container ${collapsed ? "collapsed" : ""}`}
      style={style}
    >
      <div className="header-row">
        {heading && !collapsed && (
          <h3 className="floating-heading" title={heading}>
            {heading}
          </h3>
        )}
        <button
          className="toggle-btn"
          onClick={toggleCollapse}
          aria-label={collapsed ? "Expand container" : "Collapse container"}
          aria-expanded={!collapsed}
          title={collapsed ? "Expand container" : "Collapse container"}
        >
          ☰
        </button>
      </div>

      {!collapsed && <div className="floating-content">{children}</div>}
    </div>
  );
}

export default FloatingContainer;
