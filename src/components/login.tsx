'use client';

import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

export default function Login() {
  const [userEmail, setUserEmail] = useState("");

  return (
    <main className="container">
      <div className="is-flex is-justify-content-center">
       <div style={{width: "600px"}}>
        <h1 className="title mb-3">{"Email Buddy"}</h1>
          <h2 className="subtitle mb-3">{"Login"}</h2>
          <div className="field mb-3">
            <p className="control has-icons-left">
              <input className="input" type="email" placeholder="Email Address" onChange={(e) => setUserEmail(e.target.value)} />
              <span className="icon is-small is-left">
                <FontAwesomeIcon icon={faEnvelope} />
              </span>
            </p>
          </div>
          <a className="button" href={`/api/auth?userEmail=${encodeURIComponent(userEmail)}`}>Sign In</a>
       </div>
      </div>
    </main>
  );
}