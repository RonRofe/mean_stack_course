import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { PostsService } from '../posts.service';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent {
    public enteredTitle: string = '';
    public enteredContent: string = '';

    constructor(public postsService: PostsService) {}

    public onAddPost(form: NgForm): void {
        if(form.invalid) {
            return;
        }
        this.postsService.addPost(form.value.title, form.value.content);
        form.resetForm();
    }
}