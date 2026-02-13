import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/", label: "Overview" },
  { to: "/upload", label: "Upload ZIP" },
  { to: "/companies", label: "Companies" },
  { to: "/news", label: "News" },
  { to: "/reports", label: "Reports" },
  { to: "/predict", label: "Predict ESG" },
];

export function Layout() {
  return (
    <div className="layout-root">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <span className="brand-title">ESG IntelliScore</span>
            <span className="brand-sub">ESG Insights &amp; Reporting</span>
          </div>
          <nav className="topnav">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " nav-link-active" : "")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="main">
        <div className="main-inner">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

