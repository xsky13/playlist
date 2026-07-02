import type { PlaylistItemType } from "../types/PlaylistItemType";
import { openDatabase } from "./db";

export default async function addItemToPlaylist(item: PlaylistItemType, blob: Blob) {
	const db = await openDatabase();

    const song = { id: item.id, title: item.title, size: item.size, duration: item.duration, favorite: false }
	const file = { songId: item.id, blob }

    const tx = db.transaction(['song', 'file'], "readwrite");
    const songStore = tx.objectStore('song');
	const fileStore = tx.objectStore('file');

    songStore.put(song);
	fileStore.put(file);

	return new Promise<void>((resolve, reject) => {
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
		tx.onabort = () => reject(tx.error);
	});
}
