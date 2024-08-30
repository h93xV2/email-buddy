import Inbox from "@/components/inbox";
import Login from "@/components/login";
import { GRANT_ID_COOKIE } from "@/constants";
import { getFolders, getGrant } from "@/nylas";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { cookies } from 'next/headers';

export default async function Home() {
  const cookieStore = cookies();

  const grantCookie = cookieStore.get(GRANT_ID_COOKIE);
  const grantId = grantCookie?.value;

  if (!grantId) {
    return (
      <Login />
    );
  }

  const activeFolder = 'INBOX';
  const grant = await getGrant(grantId);

  if (!grant.email) {
    throw new Error('No user email');
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['folders', grantId],
    queryFn: async () => (await getFolders(grantId))['data']
  });

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
          <a className="navbar-item" href="/api/auth/logout">
            Logout
          </a>
        </div>
      </nav>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Inbox
          activeFolder={activeFolder}
          grantId={grantId}
          userEmail={{ email: grant.email }}
        />
      </HydrationBoundary>
    </main>
  );
}
