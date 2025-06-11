import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video-embed',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full aspect-video relative rounded-lg overflow-hidden">
      <iframe
        *ngIf="embedUrl"
        [attr.src]="embedUrl"
        frameborder="0"
        allowfullscreen
        class="absolute top-0 left-0 w-full h-full"
      ></iframe>
    </div>
  `,
})
export class VideoEmbedComponent implements OnChanges {
  @Input() videoUrl!: string;
  embedUrl: SafeResourceUrl | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges() {
    const url = this.getEmbedUrl(this.videoUrl);
    this.embedUrl = url
      ? this.sanitizer.bypassSecurityTrustResourceUrl(url)
      : null;
  }

  getEmbedUrl(url: string): string {
    if (!url) return '';

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
      return `https://www.youtube.com/embed/${videoId}`;
    }

    if (url.includes('vimeo.com')) {
      const videoId = url.split('/').pop();
      return `https://player.vimeo.com/video/${videoId}`;
    }

    if (url.includes('facebook.com')) {
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
        url
      )}&show_text=false&width=560`;
    }

    return '';
  }
}
