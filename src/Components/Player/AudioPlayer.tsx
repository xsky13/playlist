import React, { useState } from 'react';
import './audio.css';

export default function AudioPlayer({ audioRef, titleRef }: { audioRef: React.RefObject<HTMLAudioElement | null>, titleRef: React.RefObject<HTMLHeadingElement | null> }) {
	const [paused, setPaused] = useState(true);
	const [duration, setDuration] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);
	const [wasPlaying, setWasPlaying] = useState(false);
	const [scrubbing, setScrubbing] = useState(false);

	const startScrub = () => {
		if (scrubbing || !audioRef.current) return;
		setScrubbing(true);
		setWasPlaying(!audioRef.current.paused);
		if (!audioRef.current.paused) audioRef.current.pause();
	};

	const changeSeekBarInput = (e: React.FormEvent<HTMLInputElement>) => {
		if (!scrubbing) startScrub();
		setCurrentTime(Number(e.currentTarget.value));
	};

	const commitScrub = () => {
		if (!scrubbing || !audioRef.current) return;
		setScrubbing(false);
		audioRef.current.currentTime = currentTime;
	};


	const clickPlayBtn = () => {
		if (!audioRef.current || !audioRef.current.src) return;

		if (audioRef.current.paused) {
			void audioRef.current.play();
		} else {
			audioRef.current.pause();
		}
	};

	const loadAudioMetadata = () => {
		setDuration(audioRef.current?.duration ?? 0);
	};

	const updateAudioTime = () => {
		setCurrentTime(audioRef.current?.currentTime ?? 0);
	};

	const goBackward = () => {
		if (audioRef.current && audioRef.current.src)
			audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
	};

	const goForward = () => {
		if (audioRef.current && audioRef.current.src)
			audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current?.currentTime + 10);
	};

	const formatTime = (seconds: number) => {
		const min = Math.floor(seconds / 60);
		const sec = Math.floor(seconds % 60);
		return `${min}:${sec < 10 ? "0" : ""}${sec}`;
	}


	return (
		<div className="player">
			<h3 ref={titleRef} id="player-title">Not playing</h3>
			<div className="player-main">
				<div className="timeline">
					<span className="subtitle">{formatTime(currentTime)}</span>
					<input
						type="range"
						value={currentTime}
						min="0"
						max={duration}
						onInput={changeSeekBarInput}
						onPointerDown={startScrub}
						onPointerUp={commitScrub}
					/>
					<span className="subtitle">{formatTime(duration)}</span>
				</div>
				<div className="controls">
					<button onClick={goBackward}>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" style={{ width: "1.7rem", height: "1.7rem" }}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M21 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061A1.125 1.125 0 0 1 21 8.689v8.122ZM11.25 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061a1.125 1.125 0 0 1 1.683.977v8.122Z" />
						</svg>
					</button>

					{/* PLAY/PAUSE BUTTON */}
					<button onClick={clickPlayBtn} id="playBtn" style={{ color: "black" }}>
						{
							paused ?
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" style={{ width: "2rem", height: "2rem" }}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
								</svg>
								:
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" style={{ width: "2rem", height: "2rem" }}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
								</svg>

						}
					</button>

					<button onClick={goForward}>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" style={{ width: "1.7rem", height: "1.7rem" }}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z" />
						</svg>
					</button>
				</div>
				<audio
					ref={audioRef}
					onLoadedMetadata={loadAudioMetadata}
					onTimeUpdate={updateAudioTime}
					onPlay={() => setPaused(false)}
					onPause={() => setPaused(true)}
					onEnded={() => setPaused(true)}
					onSeeked={() => { if (wasPlaying) { audioRef.current?.play(); setWasPlaying(false); } }}
				></audio>
			</div>
		</div>
	)
}
