import { Component } from '@angular/core';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html'
})
export class PostCreateComponent {
    private newPost = 'NO CONTENT';

    public onAddPost(postInput: HTMLTextAreaElement): void {
        this.newPost = postInput.value;
    }
}