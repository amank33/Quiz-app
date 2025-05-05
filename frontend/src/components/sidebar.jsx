import React, { useState } from 'react';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleItemClick = (index) => {
    setActiveItem(activeItem === index ? null : index);
  };

  return (
    <aside className={isExpanded ? 'expand' : ''}>
      <div className="logo">
        <span className="menu-icon" onClick={toggleSidebar}>
          <i className="fa-solid fa-bars"></i>
          <i className="fa-solid fa-x"></i>
        </span>
        <a href="#">
          <i className="fa-solid fa-virus-covid"></i>
          <span>Menu</span>
        </a>
      </div>
      <ul className="side-menu">
        {['Home', 'Orders', 'Account'].map((item, index) => (
          <li
            key={index}
            className={`nav-item ${activeItem === index ? 'active' : ''}`}
            onClick={() => handleItemClick(index)}
          >
            <a href="#">
              <i className="fa-solid fa-house"></i>
              <span>{item}</span>
              {item === 'Account' && <i className="fa-solid fa-chevron-right"></i>}
            </a>
            {item === 'Account' && activeItem === index && (
              <ul className="sub-menu">
                {['Address', 'Contact', 'Settings'].map((subItem, subIndex) => (
                  <li key={subIndex}>
                    <a href="#">{subItem}</a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      <ul className="log">
        <li className="nav-item">
          <a href="#">
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Log-out</span>
          </a>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;