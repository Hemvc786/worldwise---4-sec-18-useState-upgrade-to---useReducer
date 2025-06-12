// import styles from "./AppNav.module.css";
import { NavLink } from "react-router-dom";
import { nav } from "./AppNav.module.css"; //here we are destructuring the styles object

function AppNav() {
  return (
    <nav className={nav}>
      <ul>
        <li>
          {/* Declarative way to navigating to component.  */}
          <NavLink to="cities">Cities</NavLink>
          <NavLink to="countries">Countries</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default AppNav;
