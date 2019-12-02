import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';

import { Post } from '../../shared/models/post.model';

import { PostsService } from '../posts.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {
    public isLoading: boolean = false;
    public totalPosts: number = 0;
    public postsPerPage: number = 2;
    public currentPage: number = 1;
    public pageSizeOptions: number[] = [1, 2, 5, 10];
    public isAuthenticated: boolean = false;
    public userId: string;
    
    private posts: Post[] = [];
    private postsSubscription: Subscription;
    private authListenerSubscription: Subscription;

    constructor(
        public postsService: PostsService,
        private authService: AuthService
    ) {}

    ngOnInit() {
        this.isLoading = true;
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
        this.userId = this.authService.getUserId();
        this.postsSubscription = this.postsService.postUpdatedListener.subscribe(
            ({ posts, maxPosts }: { posts: Post[], maxPosts: number }) => {
                this.isLoading = false;
                this.totalPosts = maxPosts;
                this.posts = posts;
            }
        );
        this.isAuthenticated = this.authService.getIsAuth();
        this.authListenerSubscription = this.authService
            .getAuthStatusListener()
            .subscribe((isAuthenticated) => {
                this.isAuthenticated = isAuthenticated;
                this.userId = this.authService.getUserId();
            });
    }

    ngOnDestroy() {
        this.postsSubscription.unsubscribe();
        this.authListenerSubscription.unsubscribe();
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
        this.postsService.deletePost(postId).subscribe(() => {
            this.isLoading = true;
            this.postsService.getPosts(this.postsPerPage, this.currentPage);
        });
    }
}