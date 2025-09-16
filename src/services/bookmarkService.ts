/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Bookmark {
  id: string;
  type: "roadmap" | "interview" | "chat";
  title: string;
  description: string;
  data: any;
  tags: string[];
  createdAt: Date;
  starred: boolean;
}

export class BookmarkService {
  private static STORAGE_KEY = "career_advisor_bookmarks";

  static addBookmark(
    type: "roadmap" | "interview" | "chat",
    title: string,
    description: string,
    data: any,
    tags: string[] = []
  ): string {
    const bookmarks = this.getBookmarks();
    const id = Date.now().toString();

    const bookmark: Bookmark = {
      id,
      type,
      title,
      description,
      data,
      tags,
      createdAt: new Date(),
      starred: false,
    };

    bookmarks.push(bookmark);
    this.saveBookmarks(bookmarks);
    return id;
  }

  static toggleStar(id: string) {
    const bookmarks = this.getBookmarks();
    const bookmark = bookmarks.find((b) => b.id === id);
    if (bookmark) {
      bookmark.starred = !bookmark.starred;
      this.saveBookmarks(bookmarks);
    }
  }

  static removeBookmark(id: string) {
    const bookmarks = this.getBookmarks();
    const filtered = bookmarks.filter((b) => b.id !== id);
    this.saveBookmarks(filtered);
  }

  static getBookmarks(): Bookmark[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  static getBookmarksByType(
    type: "roadmap" | "interview" | "chat"
  ): Bookmark[] {
    return this.getBookmarks().filter((b) => b.type === type);
  }

  static searchBookmarks(query: string): Bookmark[] {
    const bookmarks = this.getBookmarks();
    const searchTerm = query.toLowerCase();

    return bookmarks.filter(
      (bookmark) =>
        bookmark.title.toLowerCase().includes(searchTerm) ||
        bookmark.description.toLowerCase().includes(searchTerm) ||
        bookmark.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
    );
  }

  private static saveBookmarks(bookmarks: Bookmark[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(bookmarks));
  }
}