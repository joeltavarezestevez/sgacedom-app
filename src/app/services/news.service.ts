import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface WordpressPost {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  link: string;
  date: string;
  featuredImage?: string; // ← agrega esto
}


@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private apiUrl = 'https://sgacedom.org/wp-json/wp/v2/posts?_embed';

  constructor(private http: HttpClient) {}

  getPosts(): Observable<WordpressPost[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(posts => posts.map(post => ({
        id: post.id,
        title: post.title,
        excerpt: {
          rendered: this.stripHtml(post.excerpt.rendered)
        },
        content: post.content,
        date: post.date,
        link: post.link,
        featuredImage: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null
      })))
    );
  }



  private stripHtml(html: string): string {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }
}
