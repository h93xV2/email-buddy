'use client';

import { Folder } from "nylas";

type Props = {
  activeFolder: string,
  folders?: Folder[],
  onClick: (folder: Folder) => void
}

export default function Folders({ folders, activeFolder, onClick }: Props) {
  return (
    <div className="menu pt-3 pl-3">
      <p className="menu-label">Folders</p>
      <ul className="menu-list">
        {
          folders?.map((folder, index) => {
            if (folder.attributes && folder.attributes.length > 0) {
              const folderName = folder.attributes[0].replace("\\", "");
              const unread = folder.unreadCount && folder.unreadCount > 0 ? ` (${folder.unreadCount})` : undefined;
              const read = folder.totalCount;
              return (
                <li key={index}>
                  <a
                    className={folder.name === activeFolder ? 'is-active' : ''}
                    onClick={() => onClick(folder)}
                  >
                    {`${folderName}`}<span className="is-size-7">{` ${read}`}{unread && <b>{unread}</b>}</span>
                  </a>
                </li>
              );
            }
          })
        }
      </ul>
    </div>
  );
}