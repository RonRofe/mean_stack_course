import { Component, Input } from '@angular/core';

import { Post } from '../../shared/models/post.model';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.scss']
})
export class PostListComponent {
    // public posts: {title: string, content: string}[] = [
    //     {title: 'First Post', content: 'This is the first post\'s content'},
    //     {title: 'First Post', content: 'This is the first post\'s content'},
    //     {title: 'First Post', content: 'This is the first post\'s content'}
    // ];

    @Input() public posts: Post[] = [];

    public get showPosts(): boolean {
        return this.posts.length > 0;
    }
}