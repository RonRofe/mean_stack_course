import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';

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

    public onAddPost(form: NgForm): void {
        if(form.invalid) {
            return;
        }
        const post: Post = {
            title: form.value.title,
            content: form.value.content
        };
        this.postCreated.emit(post);
    }
}