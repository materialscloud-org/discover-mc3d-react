import React from "react";
import { useNavigate } from "react-router-dom";

const order = ["pbesol-v2", "pbesol-v1", "pbe-v1"];

// simple component that takes metods and currentMethods and returns clickable buttons and some text string
export default function MethodologyButtons({
  commentString = "This structure has also been optimized with methodologies:",
  id,
  methods,
  currentMethod,
}) {
  const navigate = useNavigate();

  if (!methods || Object.keys(methods).length === 0) return null;

  // Define preferred ordering

  // Sort keys according to the order array
  const keys = Object.keys(methods).sort((a, b) => {
    const ia = order.indexOf(a);
    const ib = order.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
  methods;

  const handleClick = (key) => {
    if (key === currentMethod) return;
    navigate(`/details/${id}/${key}`);
  };

  return (
    <div className="my-1">
      <p className=" d-inline-block me-2">{commentString}</p>
      <div className="d-inline-flex flex-wrap gap-1 align-items-center">
        {keys.map((key) => (
          <button
            key={key}
            onClick={() => handleClick(key)}
            className={`btn btn-sm rounded-lg px-1 ${
              key === currentMethod ? "btn-secondary disabled" : "btn-primary"
            }`}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
}
