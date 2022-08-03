import React from "react";

const Footer = () => {
  var d = new Date();
  return (
    <div className="footer">
      <div className="copyright">
        <p>
          Copyright © My Equity Finder  {d.getFullYear()}
          {/* <a href="http://dexignzone.com/" target="_blank">
            DexignZone
          </a>{" "} */}
         
        </p>
      </div>
    </div>
  );
};

export default Footer;
