import api from '../../lib/api';
import { Note } from './note.entity';

export interface NotesResponse {
  notes: Note[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface CreateNoteParams {
  title?: string;
  content?: string;
  labelIds?: string[];
  imageFile?: File;
}

interface UpdateNoteParams {
  title?: string;
  content?: string;
  labelIds?: string[];
  imageFile?: File;
}

export const noteRepository = {
  async getNotes(
    page: number = 1,
    limit: number = 15,
    query: string = ''
  ): Promise<NotesResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (query) {
      params.append('q', query);
    }

    const result = await api.get(`/notes?${params.toString()}`);
    return {
      notes: result.data.notes.map((note: any) => new Note(note)),
      pagination: result.data.pagination,
    };
  },

  async createNote(params: CreateNoteParams): Promise<Note> {
    const formData = new FormData();

    if (params.title) formData.append('title', params.title);
    if (params.content) formData.append('content', params.content);
    if (params.labelIds && params.labelIds.length > 0) {
      formData.append('labelIds', JSON.stringify(params.labelIds));
    }
    if (params.imageFile) {
      formData.append('image', params.imageFile);
    }

    const result = await api.post('/notes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return new Note(result.data);
  },

  async updateNote(id: string, params: UpdateNoteParams): Promise<Note> {
    const formData = new FormData();

    if (params.title) formData.append('title', params.title);
    if (params.content) formData.append('content', params.content);
    if (params.labelIds) {
      formData.append('labelIds', JSON.stringify(params.labelIds));
    }
    if (params.imageFile) {
      formData.append('image', params.imageFile);
    }

    const result = await api.put(`/notes/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return new Note(result.data);
  },

  async deleteNote(id: string): Promise<void> {
    await api.delete(`/notes/${id}`);
  },
};
