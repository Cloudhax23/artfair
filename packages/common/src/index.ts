export type Activity = 'art-collab' | 'con-artist' | 'canvas-swap' | 'art-dealer' | 'art-critic';

export interface ChatMessage {
  sender: string;
  content: string;
}

export interface Point {
  x: number;
  y: number;
}

export interface Vector {
  x: number;
  y: number;
}

export interface Artist {
  name: string;
  avatarIndex: number;
}

export interface User {
  name: string;
  roomname: string;
  avatarIndex: number;
}

export interface Room {
  name: string;
  members: Artist[];
  hostname: string;
  activity: Activity;
}

export interface JoinRoomData {
  artist: Artist;
  room: Room;
}

export interface StrokeBeginData {
  strokeId: string;
  strokeColor: string;
  strokeThickness: number;
  point: Point;
}

export interface StrokeContinueData {
  strokeId: string;
  point: Point;
}

export interface StrokeEndData {
  strokeId: string;
  point: Point;
}
