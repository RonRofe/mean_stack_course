import { Component } from '@angular/core';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html'
})
export class PostCreateComponent {
    private newPost = 'NO CONTENT';

    public onAddPost(): void {
        this.newPost = "The user\'s post";
    }
}