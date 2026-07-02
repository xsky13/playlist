import { openDatabase } from "./db";

export default async function deleteItemFromPlaylist(songId: string) {
	const db = await openDatabase();

	const tx = db.transaction(['song', 'file'], "readwrite");
	const songStore = tx.objectStore('song');
	const fileStore = tx.objectStore('file');

	songStore.delete(songId);
	fileStore.delete(songId);

	return new Promise<void>((resolve, reject) => {
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
		tx.onabort = () => reject(tx.error);
	});
}
