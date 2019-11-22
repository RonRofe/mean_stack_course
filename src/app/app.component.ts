import { Component } from '@angular/core';

import { Post } from './shared/models/post.model'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public storedPosts: Post[] = [];
  
  public onPostAdded(post: {title: string, content: string}) {
    this.storedPosts.push(post);
  }
}