import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { Post, BackendPost } from 'src/app/shared/models/post.model';

import { PostsService } from '../posts.service';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {
    public enteredTitle: string = '';
    public enteredContent: string = '';
    private mode: 'create' | 'edit' = 'create';
    public isLoading: boolean = false;
    private postId: string;
    public post: Post;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public postsService: PostsService
    ) {}

    ngOnInit() {
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if(paramMap.has('postId')) {
                this.mode = 'edit';
                this.postId = paramMap.get('postId');
                this.isLoading = true;
                this.postsService.getPost(this.postId).subscribe((postData: BackendPost) => {
                    this.post = { id: postData._id, title: postData.title, content: postData.content };
                    this.isLoading = false;
                });
            } else {
                this.mode = 'create';
                this.postId = null;
            }
        });
    }

    public async onSavePost(form: NgForm): Promise<void> {
        if(form.invalid) {
            return;
        }
        this.isLoading = true;
        if(this.mode === 'create') {
            await this.postsService.addPost(form.value.title, form.value.content);
        } else {
            await this.postsService.updatePost(this.postId, form.value.title, form.value.content);
        }
        this.router.navigate(['/']);
        form.resetForm();
    }
}