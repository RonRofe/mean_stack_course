import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public storedPosts: {title: string, content: string}[] = [];
  
  public onPostAdded(post: {title: string, content: string}) {
    this.storedPosts.push(post);
  }
}