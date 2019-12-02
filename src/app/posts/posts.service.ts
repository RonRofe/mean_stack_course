import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post, BackendPost } from '../shared/models/post.model';

@Injectable()
export class PostsService {
    private posts: Post[] = [];
    private postsUpdated: Subject<{ posts: Post[], maxPosts: number }> = new Subject<{ posts: Post[], maxPosts: number }>();

    constructor(
        private http: HttpClient
    ) {}

    public getPosts(postsPerPage: number, currentPage: number): void {
        const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
        this.http.get<{ message: string, posts: BackendPost[], maxPosts: number }>(
            'http://localhost:3000/api/posts' + queryParams
        ).pipe(map(
            (postData: { message: string, posts: BackendPost[], maxPosts: number }) => {
                const posts = postData.posts.map(
                    ({ _id, title, content, imagePath, creator }: BackendPost) => {
                        return { id: _id, title, content, imagePath, creator };
                    }
                );
                return { posts, maxPosts: postData.maxPosts };
            }
        )).subscribe(({ posts, maxPosts }: { posts: Post[], maxPosts: number }) => {
            this.posts = posts;
            this.postsUpdated.next({
                posts: [...this.posts],
                maxPosts
            });
        });
    }

    public get postUpdatedListener(): Observable<{ posts: Post[], maxPosts: number }> {
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
        ).subscribe();
    }
    
    public updatePost(id: string, title: string, content: string, image: File | string): void {
        let postData: FormData | Post;
        if(typeof(image) === 'object') {
            postData = new FormData();
            postData.append('id', id);
            postData.append('title', title);
            postData.append('content', content);
            postData.append('image', image, title);
            postData.append('creator', null);
        } else {
            postData = {
                id,
                title,
                content,
                imagePath: image,
                creator: null
            };
        }
        this.http.patch('http://localhost:3000/api/posts/' + id, postData).subscribe();
    }

    public deletePost(postId: string) {
        return this.http.delete('http://localhost:3000/api/posts/' + postId);
    }
}