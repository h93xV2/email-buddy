import Inbox from "@/components/inbox";
import Login from "@/components/login";
import { fetchRecentThreads, getFolders, getThreadsByFolderId } from "@/nylas";
import { cookies } from 'next/headers';

const getThreadsForInbox = async (grantId: string, folderId: string | undefined) => {
  if (folderId) {
    return (await getThreadsByFolderId(grantId, folderId))['data'];
  }

  return (await fetchRecentThreads(grantId))['data'];
};

export default async function Home() {
  const cookieStore = cookies();

  const grantCookie = cookieStore.get('email-buddy-nylas-grant-id');
  const grantId = grantCookie?.value;

  if (!grantId) {
    return (
      <Login />
    );
  }

  const folders = (await getFolders(grantId))['data'];
  const inbox = folders.find(folder => folder.name === 'INBOX');
  const threads = await getThreadsForInbox(grantId, inbox?.id);

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
      <Inbox grantId={grantId} threads={threads} folders={folders} />
    </main>
  );
}
