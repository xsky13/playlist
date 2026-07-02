import { createContext } from 'react';
import type { PlaylistContextType } from '../types/PlaylistContextType';

export const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);
