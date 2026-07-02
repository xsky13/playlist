import { useState } from "react";
import './dialog.css';
import AddFromUrl from "../Adders/AddFromUrl";
import AddFromVideo from "../Adders/AddFromVideo";
export default function Dialog() {
	const [open, setOpen] = useState(false);
	const [section, setSection] = useState<'url' | 'search'>("url");

	return (
		<>
			<button onClick={() => setOpen(true)} className="button" id="dialog-opener">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "1.7rem", height: "1.7rem" }}>
					<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
				</svg>
			</button>
			<div
				id="overlay"
				onClick={() => setOpen(false)}
				className={open ? "open" : "closed"}
			></div>
			<div
				id="dialog"
				className={open ? "open" : "closed"}
			>
				<h2>Add song</h2>
				<div className="tabs">
					<span
						className={section == "url" ? "active" : ""}
						onClick={() => setSection("url")}
					>
						URL
					</span>
					<span
						className={section == "search" ? "active" : ""}
						onClick={() => setSection("search")}
					>
						Search youtube
					</span>
				</div>
				{
					section == "url" ?
						<AddFromUrl closeDialog={() => setOpen(false)} />
						:
						<AddFromVideo closeDialog={() => setOpen(false)} />
				}
			</div>
		</>
	);
}
