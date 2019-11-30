import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
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
    public isLoading: boolean = false;
    public totalPosts: number = 10;
    public postsPerPage: number = 2;
    public currentPage: number = 1;
    public pageSizeOptions: number[] = [1, 2, 5, 10];
    private postsSubscription: Subscription;

    constructor(
        public postsService: PostsService
    ) {}

    ngOnInit() {
        this.isLoading = true;
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
        this.postsSubscription = this.postsService.postUpdatedListener.subscribe(
            (posts: Post[]) => {
                this.isLoading = false;
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

    public onChangePage(pageData: PageEvent) {
        this.isLoading = true;
        this.currentPage = pageData.pageIndex + 1;
        this.postsPerPage = pageData.pageSize;
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
    }

    public onDelete(postId: string): void {
        this.postsService.deletePost(postId);
    }
}