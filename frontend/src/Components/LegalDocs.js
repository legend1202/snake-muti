import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../Styles/LegalDocs.css";

function LegalDocs() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  return (
    <div className="legal-section-title">
      <h1 className="legal-siteTitle">
        <Link to="/">
          Snamba
        </Link>
      </h1>

      <div className="legal-text-content">
     
        <p className="legal-title">Terms of Service</p>
        <p className="legal-description">
          When using Health Plus, you agree to our Terms of Service. This
          includes guidelines for using our platform, interacting with doctors,
          and the responsibilities of both parties. It's essential to understand
          these terms to ensure a smooth experience for all users.
        </p>
      </div>

      <div className="legal-footer">
        <p>© 2013-2023 Snamba. All rights reserved.</p>
      </div>
    </div>
  );
}

export default LegalDocs;
