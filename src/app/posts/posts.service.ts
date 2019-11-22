import { Post } from '../shared/models/post.model';
import { Subject, Observable } from 'rxjs';

export class PostsService {
    private posts: Post[] = [];
    private postsUpdated: Subject<Post[]> = new Subject<Post[]>();

    public getPosts(): Post[] {
        return [...this.posts];
    }

    public get postUpdatedListener(): Observable<Post[]> {
        return this.postsUpdated.asObservable();
    }

    public addPost(title: string, content: string): void {
        const post: Post = {title: title, content: content};
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
    }
}