export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface StickyNote {
  id: string;
  content: string;
  color: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  date?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface DrawingPath {
  id: string;
  points: { x: number; y: number }[];
  color: string;
  width: number;
}

export interface WhiteboardState {
  paths: DrawingPath[];
  notes: StickyNote[];
}

export type ViewMode = 'todo' | 'notes' | 'calendar' | 'whiteboard';
export type CalendarView = 'month' | 'week';
export type Theme = 'light' | 'dark';