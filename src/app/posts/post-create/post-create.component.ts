import { Component, EventEmitter, Output } from '@angular/core';

import { Post } from '../../shared/models/post.model';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent {
    public enteredTitle: string = '';
    public enteredContent: string = '';
    @Output() public postCreated: EventEmitter<Post> = new EventEmitter<Post>();

    public onAddPost(): void {
        const post: Post = {
            title: this.enteredTitle,
            content: this.enteredContent
        };
        this.postCreated.emit(post);
    }
}