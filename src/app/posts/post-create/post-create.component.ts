import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { Post, BackendPost } from 'src/app/shared/models/post.model';

import { mimeType } from 'src/app/shared/validators/mime-type.validator';

import { PostsService } from '../posts.service';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {
    public enteredTitle: string = '';
    public enteredContent: string = '';
    public isLoading: boolean = false;
    public post: Post;
    public form: FormGroup;
    public imagePreview: string = null;

    private mode: 'create' | 'edit' = 'create';
    private postId: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public postsService: PostsService
    ) {}

    ngOnInit() {
        this.form = new FormGroup({
            'title': new FormControl(null, {
                validators: [
                    Validators.required,
                    Validators.minLength(3)
                ]
            }),
            'content': new FormControl(null, {
                validators: [
                    Validators.required
                ]
            }),
            'image': new FormControl(null, {
                validators: [Validators.required],
                asyncValidators: [mimeType]
            })
        });

        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if(paramMap.has('postId')) {
                this.mode = 'edit';
                this.postId = paramMap.get('postId');
                this.isLoading = true;
                this.postsService.getPost(this.postId).subscribe((postData: BackendPost) => {
                    this.post = {
                        id: postData._id,
                        title: postData.title,
                        content: postData.content
                    };
                    this.isLoading = false;
                    this.form.setValue({
                        'title': this.post.title,
                        'content': this.post.content
                    });
                });
            } else {
                this.mode = 'create';
                this.postId = null;
            }
        });
    }

    public async onSavePost(): Promise<void> {
        if(this.form.invalid) {
            return;
        }
        this.isLoading = true;
        if(this.mode === 'create') {
            await this.postsService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
        } else {
            await this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content);
        }
        this.router.navigate(['/']);
        this.form.reset();
    }

    public onImagePicked(event: Event) {
        const file: File = (event.target as HTMLInputElement).files[0];
        this.form.patchValue({ image: file });
        this.form.get('image').updateValueAndValidity();
        const reader: FileReader = new FileReader();
        reader.onload = () => {
            this.imagePreview = (reader.result as string);
        }
        reader.readAsDataURL(file);
    }

    public get previewImage(): boolean {
        return (this.imagePreview !== '' && this.imagePreview !== null);
    }
}