import React from 'react';
import { Link } from 'react-router-dom';

function Menu() {
  return (
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/insert">Lances</Link></li>
    </ul>
  );
}
export default Menu;
