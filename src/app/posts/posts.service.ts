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
                        content: post.content,
                        imagePath: post.imagePath
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
        return this.http.get<BackendPost>(
            'http://localhost:3000/api/posts/' + id
        );
    }

    public addPost(title: string, content: string, image: File): void {
        const postData = new FormData();
        postData.append('title', title);
        postData.append('content', content);
        postData.append('image', image, title);

        this.http.post<{ message: string, post: BackendPost }>(
            'http://localhost:3000/api/posts',
            postData
        ).subscribe((responseData: { message: string, post: BackendPost }) => {
                const post: Post = {
                    id: responseData.post._id,
                    title,
                    content,
                    imagePath: responseData.post.imagePath
                };
                this.posts.push(post);
                this.postsUpdated.next([...this.posts]);
        });
    }
    
    public updatePost(id: string, title: string, content: string, image: File | string): void {
        let postData: FormData | Post;
        if(typeof(image) === 'object') {
            postData = new FormData();
            postData.append('id', id);
            postData.append('title', title);
            postData.append('content', content);
            postData.append('image', image, title);
        } else {
            postData = {
                id,
                title,
                content,
                imagePath: image
            };
        }
        this.http.patch('http://localhost:3000/api/posts/' + id, postData)
            .subscribe((response: BackendPost) => {
                const updatedPosts = [...this.posts];
                const oldPostIndex = updatedPosts.findIndex((p: Post) => p.id === id);
                const post: Post = {
                    id,
                    title,
                    content,
                    imagePath: response.imagePath
                };
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