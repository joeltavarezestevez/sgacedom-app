import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule, NgFor } from '@angular/common';
import { NewsService, WordpressPost } from '../../services/news.service';
import { SgHeaderComponent } from '../../components/sg-header/sg-header.component';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule, CommonModule, NgFor, SgHeaderComponent],
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss'],
})

export class HomePage implements OnInit {
  posts: WordpressPost[] = [];
  loading = false;

  constructor(private newsService: NewsService) {}

  ngOnInit() {
    this.loading = true;
    this.newsService.getPosts().subscribe({
      next: (data) => {
        this.posts = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando noticias:', err);
        this.loading = false;
      }
    });
  }

  async open(link: string) {
    if (!link) return;

    await Browser.open({
      url: link,
      presentationStyle: 'fullscreen'
    });
  }
}