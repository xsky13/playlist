import { openDatabase } from "./db";

export default async function toggleFavoriteItem(id: string) {
	const db = await openDatabase();

	const tx = db.transaction('song', "readwrite");
	const store = tx.objectStore('song');

	const req = store.get(id);

	req.onsuccess = () => {
		const song = req.result;
		if (!song) return;

		song.favorite = !song.favorite;

		store.put(song);
	};

	return new Promise<void>((resolve, reject) => {
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
		tx.onabort = () => reject(tx.error);
	});
}
