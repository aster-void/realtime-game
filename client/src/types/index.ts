export interface Player {
  id: string;
  name: string;
  isHost?: boolean;
  // Add other player properties as needed
}

export interface Room {
  id: string;
  name: string;
  status: 'waiting' | 'playing' | 'finished';
  players: Player[];
  // Add other room properties as needed
}

export interface RoomState {
  room: Room | null;
  status: string;
  // Add other state properties as needed
}
