import Inbox from "@/components/inbox";
import { fetchRecentThreads } from "@/nylas";

export default async function Home() {
  const threads = (await fetchRecentThreads())['data'];

  return (
    <main>
      <nav className="navbar has-shadow is-fixed-top">
        <div className="navbar-brand">
          <a className="navbar-item" href="../">
            <b>Email Buddy</b>
          </a>

          <div className="navbar-burger burger" data-target="navMenu">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div className="navbar-end">
          <div className="navbar-item has-dropdown is-hoverable">
            <a className="navbar-link">
              Account
            </a>
            <div className="navbar-dropdown">
              <a className="navbar-item">
                Dashboard
              </a>
              <a className="navbar-item">
                Profile
              </a>
              <a className="navbar-item">
                Settings
              </a>
              <hr className="navbar-divider" />
              <a className="navbar-item">
                Logout
              </a>
            </div>
          </div>
        </div>
      </nav>
      <Inbox threads={threads} />
    </main>
  );
}
