import { useEffect, useState } from "react";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaSignOutAlt,
  FaChevronRight,
  FaChevronDown,
  FaVirus,
} from "react-icons/fa";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let aside = document.querySelector("aside");
    let icon = aside.querySelector(".menu-icon");
    let li = aside.getElementsByClassName("nav-item");
    let justremoved = false;

    icon.onclick = () => {
      if (aside.classList.contains("expand")) {
        aside.classList.remove("expand");
        justremoved = true;
      } else {
        aside.classList.add("expand");
        setIsOpen(true);
      }
    };

    for (let l of li) {
      l.onclick = activeli;
    }

    function activeli() {
      if (!this.classList.contains("active")) {
        Array.from(li).forEach((e) => e.classList.remove("active"));
        this.classList.add("active");
      } else {
        Array.from(li).forEach((e) => e.classList.remove("active"));
      }
    }

    document.onclick = (e) => {
      if (!aside.contains(e.target)) {
        if (aside.classList.contains("expand")) {
          aside.classList.toggle("expand");
          setIsOpen(false);
        }
      } else {
        if (!aside.classList.contains("expand")) {
          setIsOpen(true);
          if (!justremoved) {
            aside.classList.toggle("expand");
            justremoved = false;
          } else {
            //aside.classList.remove("expand");
            justremoved = false;
          }
        }
      }
    };
  }, []);

  return (
    <div className="sidebar">
      <aside>
        <div className="logo">
          
          <span className="menu-icon">
            <FaBars className={!isOpen ? "visible" : "hidden"} />
            <FaTimes className={isOpen ? "visible" : "hidden"} />
          </span>
          <a href="#" className="">
            <FaVirus />
            <span className="menu-icon__span">Menu</span>
          </a>
        </div>
        <ul className="side-menu">
          <li className="nav-item">
            <div>
              <a href="#" className="nav-item__a">
                <FaHome />
                <span className="side-menu-nav-item__span">Home</span>
                <FaChevronRight className="when-inactive"/>
                {/* <FaChevronDown className="when-active" /> */}
              </a>
              <ul className="sub-menu">
                <li>
                  <a href="#">Dashboard</a>
                </li>
                <li>
                  <a href="#">Items</a>
                </li>
                <li>
                  <a href="#">People</a>
                </li>
              </ul>
            </div>
          </li>
        </ul>
        {/* <ul className="log">
          <li className="nav-item">
            <a href="#">
              <FaSignOutAlt />
              <span className="side-menu-nav-item__span">Log-out</span>
            </a>
          </li>
        </ul> */}
        <ul className="logout">
          <li className="nav-item">
            <a href="#" className="nav-item__a">
              <FaSignOutAlt />
              <span className="nav-item__span">Log-out</span>
            </a>
          </li>
        </ul>
      </aside>
      <section>
        <h1>Comp</h1>
        <h2>Sidebar aside</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Accusantium
          saepe, placeat beatae impedit dolore vel aliquid voluptate! Obcaecati
          ad sunt laboriosam maxime itaque, nesciunt nemo quis, quasi, deleniti
          similique fugiat.
        </p>
      </section>
    </div>
  );
}
