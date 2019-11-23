import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';

import { Post } from '../shared/models/post.model';

@Injectable()
export class PostsService {
    private posts: Post[] = [];
    private postsUpdated: Subject<Post[]> = new Subject<Post[]>();

    constructor(
        private http: HttpClient
    ) {}

    public getPosts(): void {
        this.http.get<{ message: string, posts: Post[] }>('http://localhost:3000/api/posts')
            .subscribe((postData: { message: string, posts: Post[] }) => {
                this.posts = postData.posts;
                this.postsUpdated.next([...this.posts]);
            });
    }

    public get postUpdatedListener(): Observable<Post[]> {
        return this.postsUpdated.asObservable();
    }

    public addPost(title: string, content: string): void {
        const post: Post = {title: title, content: content, id: null};
        this.http.post<{ message: string }>('http://localhost:3000/api/posts', post)
            .subscribe((responseData: { message: string }) => {
                console.log(responseData.message);
                this.posts.push(post);
                this.postsUpdated.next([...this.posts]);
            });
    }
}