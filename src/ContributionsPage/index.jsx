import React, { useEffect, useState } from "react";

// standard markdown.
import ReactMarkdown from "react-markdown";
// for math support.
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

// for footnote support
import remarkGfm from "remark-gfm";
import remarkFootnotes from "remark-footnotes";

import "./index.css";

import { Container } from "react-bootstrap";

import TitleAndLogo from "../common/TitleAndLogo";

import MaterialsCloudHeader from "mc-react-header";

const markdownEntries = ["preface.md", "superconductivity.md"];

function ContributionsPage() {
  const [markdowns, setMarkdowns] = useState([]);

  useEffect(() => {
    Promise.all(
      markdownEntries.map((file) =>
        // fetch from public since these files are small
        fetch(`./contributions/${file}`).then((res) => {
          if (!res.ok) throw new Error(`Failed to fetch ${file}`);
          return res.text();
        }),
      ),
    )
      .then((contents) => setMarkdowns(contents))
      .catch((error) => {
        console.error(error);
        setMarkdowns([]);
      });
  }, []);

  return (
    <MaterialsCloudHeader
      activeSection={"discover"}
      breadcrumbsPath={[
        { name: "Discover", link: "https://www.materialscloud.org/discover" },
        {
          name: "Materials Cloud Three-Dimensional Structure Database",
          link: `${import.meta.env.BASE_URL}`,
        },
        { name: `Contributed Data`, link: null },
      ]}
    >
      <Container fluid="xxl">
        <TitleAndLogo />
        {markdowns.length === 0
          ? "Loading..."
          : markdowns.map((md, i) => {
              const containerId = `markdown-entry-${i}`; // unique ID per file
              return (
                <div key={i} className="markdown-entry" id={containerId}>
                  <ReactMarkdown
                    remarkPlugins={[remarkMath, remarkGfm, remarkFootnotes]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      a: ({ node, ...props }) => {
                        const href = props.href || "";
                        const isHashLink = href.startsWith("#");

                        if (isHashLink) {
                          return (
                            <a
                              {...props}
                              onClick={(e) => {
                                e.preventDefault();

                                // scope to container if needed
                                const container =
                                  e.currentTarget.closest(".markdown-entry");
                                const el = container?.querySelector(href);

                                if (el) {
                                  const yOffset = -80; // adjust for fixed header
                                  const y =
                                    el.getBoundingClientRect().top +
                                    window.pageYOffset +
                                    yOffset;
                                  window.scrollTo({
                                    top: y,
                                    behavior: "smooth",
                                  });

                                  // Add flash class
                                  el.classList.add("footnote-flash");
                                  setTimeout(() => {
                                    el.classList.remove("footnote-flash");
                                  }, 2000); // duration matches CSS animation
                                }
                              }}
                            />
                          );
                        }

                        // external links
                        return (
                          <a
                            {...props}
                            target="_blank"
                            rel="noopener noreferrer"
                          />
                        );
                      },
                    }}
                  >
                    {md}
                  </ReactMarkdown>
                </div>
              );
            })}
      </Container>
    </MaterialsCloudHeader>
  );
}

export default ContributionsPage;
