import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent {
    public enteredTitle: string = '';
    public enteredContent: string = '';
    @Output() public postCreated: EventEmitter<{title: string, content: string}> = new EventEmitter<{title: string, content: string}>();

    public onAddPost(): void {
        const post = {
            title: this.enteredTitle,
            content: this.enteredContent
        };
        this.postCreated.emit(post);
    }
}