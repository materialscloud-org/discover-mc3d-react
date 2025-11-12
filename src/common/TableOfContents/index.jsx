import React, { useState, useEffect, useRef } from "react";
import "./index.css";

const TableOfContents = () => {
  const [activeSection, setActiveSection] = useState("");
  const [sections, setSections] = useState([]);
  const [isOpen, setIsOpen] = useState(() => window.innerWidth >= 1200); // open on XL, closed on small
  const sectionsRef = useRef([]);

  useEffect(() => {
    const container = document.querySelector(".container-xxl");
    if (!container) return;

    const setupSections = () => {
      const elems = container.querySelectorAll(".section-heading");
      const array = Array.from(elems).map((el, idx) => {
        if (!el.id) el.id = `section-${idx + 1}`;
        return {
          id: el.id,
          title: el.getAttribute("data-title") || el.textContent.trim(),
          element: el,
        };
      });
      setSections(array);
      sectionsRef.current = array;
    };

    setupSections();

    const observer = new MutationObserver(setupSections);
    observer.observe(container, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = sectionsRef.current;
      if (!sections.length) return;

      const scrollY = window.scrollY + 100;
      let activeId = "";
      let maxVis = 0;

      sections.forEach((section) => {
        const rect = section.element.getBoundingClientRect();
        const visHeight =
          Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
        const visRatio = visHeight / window.innerHeight;
        if (visRatio > maxVis && visRatio > 0.1) {
          maxVis = visRatio;
          activeId = section.id;
        }
      });

      if (!activeId) {
        for (let i = sections.length - 1; i >= 0; i--) {
          if (sections[i].element.offsetTop <= scrollY) {
            activeId = sections[i].id;
            break;
          }
        }
      }

      setActiveSection(activeId);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 20;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Always show the toggle text
  const toggleText = isOpen ? "hide" : "show";

  return (
    <div className="toc">
      <div className="toc-heading" style={{ userSelect: "none" }}>
        Table of Contents
        <span
          className="toc-heading-toggle"
          style={{ cursor: "pointer" }}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {toggleText}
        </span>
      </div>

      {isOpen && (
        <ul>
          {sections.map((section) => (
            <li key={section.id}>
              <button
                className={`toc-item ${activeSection === section.id ? "active" : ""}`}
                onClick={() => scrollToSection(section.id)}
              >
                {section.title}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TableOfContents;
