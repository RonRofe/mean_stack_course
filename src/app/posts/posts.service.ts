import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post, BackendPost } from '../shared/models/post.model';

@Injectable()
export class PostsService {
    private posts: Post[] = [];
    private postsUpdated: Subject<Post[]> = new Subject<Post[]>();

    constructor(
        private http: HttpClient
    ) {}

    public getPosts(): void {
        this.http.get<{ message: string, posts: BackendPost[] }>('http://localhost:3000/api/posts')
            .pipe(map((postData: { message: string, posts: BackendPost[] }) => {
                return postData.posts.map((post: BackendPost) => {;
                    return {
                        id: post._id,
                        title: post.title,
                        content: post.content
                    }
                });
            }))
            .subscribe((posts: Post[]) => {
                this.posts = posts;
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