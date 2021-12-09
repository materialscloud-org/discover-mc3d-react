import { Link, Outlet } from "react-router-dom";

const compound_list = ["AgB2","CoCO3","Sb2Zr"];

export default function Compounds() {
    return (
      <div style={{ display: "flex" }}>
        <nav
        style={{
          //borderRight: "solid 1px",
          padding: "1rem"
        }}
      >
          {compound_list.map(compound => (
            <Link style={{ display: "block", margin: "1rem 0" }}
              to={`/details/${compound}`}
              key={compound}
            >
              {compound}
            </Link>
          ))}
          </nav>
        <Outlet />
      </div>
    );
  }