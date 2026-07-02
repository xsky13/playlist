import { useContext } from "react";
import { openDatabase } from "../../db/db";
import type { PlaylistItemType } from "../../types/PlaylistItemType";
import { PlaylistContext } from "../../context/PlaylistContext";

export default function PlaylistItem(props: { item: PlaylistItemType, audioElement: React.RefObject<HTMLAudioElement | null>, loadSong: (songTitle: string, blob: Blob) => void }) {
	const playlistContext = useContext(PlaylistContext);
	if (!playlistContext) {
		alert("Internal error");
		return;
	}

	const toggleFavorite = () => playlistContext.toggleFavorite(props.item.id);

	const openSong = async () => {
		const db = await openDatabase();

		const tx = db.transaction('file', "readonly");
		const fileStore = tx.objectStore("file");

		const req = fileStore.get(props.item.id);
		req.onsuccess = () => {
			const file = req.result;
			props.loadSong(props.item.title, file.blob);
		};
	};

	const deleteSong = () => {
		if (confirm("Are you sure you want to remove this song?")) {
			playlistContext.removeItem(props.item.id)
		}
	};

	return (
		<div className="playlist-item" id={props.item.id}>
			<div className="playlist-start">
				<img src="/play.png" style={{ cursor: "pointer" }} onClick={openSong} width="50" />
				<div className="details">
					<h3>{props.item.title}</h3>
					<span className="subtitle" id={`${props.item.id}-subtitle`}>
						{
							props.item.size != null ?
								`${props.item.size}MB`
								:
								props.item.loading ?
									<img src="/loader.svg" className="loading-img" width="25" />
									: `${props.item.percentage}%`
						}
					</span>
				</div>
			</div>
			<div className="playlist-details">
				<span className="subtitle">{props.item.duration}</span>
				<div className="pl-actions">
					<div className="favorite" onClick={toggleFavorite}>
						{
							props.item.favorite ?
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: "1.1rem", height: "1.1rem" }}>
									<path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
								</svg>

								:
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "1.1rem", height: "1.1rem" }}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
								</svg>
						}
					</div>
					<div className="delete-icon" onClick={deleteSong}>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: "1rem", height: "1rem" }}>
							<path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
						</svg>

					</div>
				</div>
			</div>
		</div>
	)
}
