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

    public getPost(id: string): Observable<BackendPost> {
        return this.http.get<BackendPost>('http://localhost:3000/api/posts/' + id);
    }

    public addPost(title: string, content: string, image: File): void {
        const postData = new FormData();
        postData.append('title', title);
        postData.append('content', content);
        postData.append('image', image, title);

        this.http.post<{ message: string, postId: string }>(
            'http://localhost:3000/api/posts',
            postData
        ).subscribe((responseData: { message: string, postId: string }) => {
                const post: Post = { id: responseData.postId, title, content }
                post.id = responseData.postId;
                this.posts.push(post);
                this.postsUpdated.next([...this.posts]);
        });
    }
    
    public updatePost(id: string, title: string, content: string): void {
        const post: Post = { id, title, content };
        this.http.patch('http://localhost:3000/api/posts/' + id, post)
            .subscribe(() => {
                const updatedPosts = [...this.posts];
                const oldPostIndex = updatedPosts.findIndex((p: Post) => p.id === post.id);
                updatedPosts[oldPostIndex] = post;
                this.posts = updatedPosts;
                this.postsUpdated.next(updatedPosts);
            });
    }

    public deletePost(postId: string) {
        this.http.delete('http://localhost:3000/api/posts/' + postId)
            .subscribe(() => {
                const updatedPosts = this.posts.filter(post => post.id !== postId);
                this.posts = updatedPosts;
                this.postsUpdated.next([...this.posts]);
            });
    }
}