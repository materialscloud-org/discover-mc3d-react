const order = ["pbesol-v2", "pbesol-v1", "pbe-v1"];

// simple component that takes methods and currentMethods and returns clickable buttons and some text string
export default function MethodologyButtons({
  commentString = "This structure has been relaxed with the following methodologies:",
  id,
  methods,
  currentMethod,
}) {
  if (!methods || Object.keys(methods).length === 0) return null;

  const sortedKeys = Object.keys(methods).sort((a, b) => {
    const ia = order.indexOf(a);
    const ib = order.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });

  return (
    <div className="my-1">
      <p className="d-inline-block me-2">{commentString}</p>

      <div className="d-inline-flex flex-wrap gap-1 align-items-center">
        {sortedKeys.map((key) => {
          const url = `#/details/${id}/${key}`;

          return (
            <a
              key={key}
              href={url}
              rel="noopener noreferrer"
              className={`btn btn-sm rounded-lg px-1 ${
                key === currentMethod ? "btn-secondary disabled" : "btn-primary"
              }`}
            >
              {key}
            </a>
          );
        })}
      </div>
    </div>
  );
}
