import { useEffect, useRef, useState } from "react";
import Dialog from "./Components/Dialog/Dialog"
import AudioPlayer from "./Components/Player/AudioPlayer"
import { openDatabase } from "./db/db";
import { PlaylistContext } from "./context/PlaylistContext";
import type { PlaylistItemType } from "./types/PlaylistItemType";
import PlaylistItem from "./Components/Playlist/PlaylistItem";
import addItemToPlaylist from "./db/addItem";
import deleteItemFromPlaylist from "./db/deleteItem";
import toggleFavoriteItem from "./db/toggleFavoriteItem";

function App() {
	const [items, setItems] = useState<PlaylistItemType[]>([]);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const titleRef = useRef<HTMLHeadingElement | null>(null);
	const [section, setSection] = useState<'library' | 'favorites'>("library");

	async function getAll() {
		const db = await openDatabase();
		const tx = db.transaction(["song"], "readonly");
		const store = tx.objectStore("song");

		const req = store.getAll();
		req.onsuccess = () => setItems(req.result);
	}


	useEffect(() => {
		getAll();
	}, []);

	const saveItem = async (item: PlaylistItemType, blob: Blob) => {
		await addItemToPlaylist(item, blob)
	}

	const addLoadingItem = (id: string, title: string, duration: string) => {
		setItems(prevItems => [...prevItems, { id, title, duration, size: null, loading: true, favorite: false, percentage: 0 }])
	}

	const updatePercentage = (id: string, percentage: number) => {
		setItems(prev =>
			prev.map(item =>
				item.id === id
					? { ...item, loading: false, percentage }
					: item
			)
		);
	}

	const finishLoading = (id: string, size: number) => {
		setItems(prev =>
			prev.map(item => (
				item.id === id ?
					{ ...item, size, loading: false }
					: item
			))
		);
	};

	const removeItem = async (id: string) => {
		setItems(prev => prev.filter(item => item.id != id));
		await deleteItemFromPlaylist(id);
	}

	const loadSong = (songTitle: string, blob: Blob) => {
		if (audioRef.current) {
			if (audioRef.current.src) URL.revokeObjectURL(audioRef.current.src);
			audioRef.current.src = URL.createObjectURL(blob);
			audioRef.current.play();
			titleRef.current!.innerHTML = songTitle;
		}
	}

	const toggleFavorite = async (id: string) => {
		setItems(prev =>
			prev.map(item => (
				item.id === id ?
					{ ...item, favorite: !item.favorite }
					: item
			))
		);
		await toggleFavoriteItem(id);
	}

	const removeFailedListing = (id: string) => {
		setItems(prev => prev.filter(item => item.id != id));
	}

	const visibleItems =
		section === "library"
			? items
			: items.filter(item => item.favorite);


	const downloadQueueRef = useRef<Promise<void>>(Promise.resolve());
	const enqueueDownload = (task: () => Promise<void>) => {
		downloadQueueRef.current = downloadQueueRef.current
			.then(task)
			.catch(err => console.error("Queued download failed:", err));
		return downloadQueueRef.current;
	};


	return (
		<PlaylistContext value={{ items, saveItem, addLoadingItem, updatePercentage, finishLoading, removeItem, toggleFavorite, removeFailedListing, enqueueDownload }}>
			<div className="main">
				<header>
					<AudioPlayer audioRef={audioRef} titleRef={titleRef} />
					<div className="main-actions">
						<div className="tabs">
							<span className={section == "library" ? "active" : ""} onClick={() => setSection("library")}>Library</span>
							<span className={section == "favorites" ? "active" : ""} onClick={() => setSection("favorites")}>Favorites</span>
						</div>
					</div>
				</header>
				<div id="playlist" className="playlist">
					{
						visibleItems.map((item, i) =>
							<PlaylistItem
								key={i}
								item={item}
								audioElement={audioRef}
								loadSong={loadSong}
							/>
						)
					}
				</div>
			</div>
			<Dialog />
		</PlaylistContext>
	)
}

export default App
