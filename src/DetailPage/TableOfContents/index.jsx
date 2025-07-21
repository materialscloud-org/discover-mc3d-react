import React, { useEffect, useState } from "react";
import { Nav } from "react-bootstrap";

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
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!loadedData) return <p>Loading contents...</p>;

  return (
    <>
      <h2 style={{ fontSize: "22px", borderBottom: "1px solid" }}> Contents</h2>
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
    </>
  );
}

export default TableOfContents;
