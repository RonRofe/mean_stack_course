import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../../shared/models/post.model';

import { PostsService } from '../posts.service';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {
    private posts: Post[] = [];
    private postsSubscription: Subscription;

    constructor(
        public postsService: PostsService
    ) {}

    ngOnInit() {
        this.posts = this.postsService.getPosts();
        this.postsSubscription = this.postsService.postUpdatedListener.subscribe(
            (posts: Post[]) => {
                this.posts = posts;
            }
        );
    }

    ngOnDestroy() {
        this.postsSubscription.unsubscribe();
    }

    public get showPosts(): boolean {
        return this.posts.length > 0;
    }
}