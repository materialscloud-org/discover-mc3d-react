import React, { useEffect, useState } from "react";

// TOC component (uses div IDs to #nav to sections)
// This seemed a bit finnicky with how ReactRouter works and maybe there is a cleaner solution
function TableOfContents({ loadedData }) {
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    if (!loadedData) {
      setHeadings([]);
      return;
    }

    const headingElements = Array.from(
      document.querySelectorAll(".section-heading"),
    );
    if (headingElements.length === 0) {
      setHeadings([]);
      return;
    }

    const newHeadings = headingElements.map((heading, index) => {
      if (!heading.id) heading.id = `section-${index}`;
      return { id: heading.id, text: heading.innerText || heading.textContent };
    });
    setHeadings(newHeadings);
  }, [loadedData]);

  const handleClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    window.history.replaceState(null, "", `#${id}`);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.history.replaceState(null, "", "#");
  };

  if (!loadedData) return <p>Loading contents...</p>;
  if (headings.length === 0)
    return (
      <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
        <li style={{ marginBottom: "0.5rem" }}>
          <button
            onClick={scrollToTop}
            style={{
              background: "none",
              border: "none",
              color: "#007bff",
              cursor: "pointer",
              padding: 0,
              fontSize: "0.9rem",
              textDecoration: "underline",
            }}
            aria-label="Scroll to top"
          >
            (Top)
          </button>
        </li>
      </ul>
    );

  return (
    <nav aria-label="Table of Contents">
      <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
        <li style={{ marginBottom: "0.5rem" }}>
          <button
            onClick={scrollToTop}
            style={{
              background: "none",
              border: "none",
              color: "#007bff",
              cursor: "pointer",
              padding: 0,
              fontSize: "0.9rem",
              textDecoration: "underline",
            }}
            aria-label="Scroll to top"
          >
            (Top)
          </button>
        </li>
        {headings.map(({ id, text }) => (
          <li key={id} style={{ marginBottom: "0.5rem" }}>
            <a
              href={`#${id}`}
              onClick={(e) => handleClick(e, id)}
              style={{
                color: "#007bff",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default TableOfContents;
