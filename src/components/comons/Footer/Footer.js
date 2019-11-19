import React from 'react';

function Footer() {
  var date = new Date();
  var year = date.getFullYear(); 
  return (
    <footer className="footer">
      <div className="container">
        <span className="text-muted">Develped by <a href='http://github.com/cesarperes84'>Cesar Peres</a>. {year}</span>
      </div>
    </footer>
  );
}
export default Footer;
