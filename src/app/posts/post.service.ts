import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Post } from './post.model';
import { environment } from "../../environments/environment";
import { PostSocketService } from './post-socket.service';
import { AuthService } from '../auth/auth.service';

const BACKEND_URL = environment.apiUrl + '/posts/'

@Injectable({providedIn: 'root'})
export class PostsService {

    isLoading=false;
    private posts: Post[] = [];
    private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

    constructor(
        private http: HttpClient, 
        private router: Router,
        // private postSocketService: PostSocketService,
        // private authService: AuthService,
        
        ) {

        }


    getPosts(postsPerPage: number, currentPage: number) {
        const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
        this.http.get<{message: string, posts: any, maxPosts: number}>(BACKEND_URL + queryParams)
        .pipe(map(postData => {
            return { posts: postData.posts.map(post => {
                return {
                    title: post.title,
                    content: post.content,
                    id: post._id,
                    imagePath: post.imagePath,
                    creator: post.creator
                };
            }), maxPosts: postData.maxPosts};
        }))
        .subscribe(transformedPostData => {
            console.log(transformedPostData);
            this.posts = transformedPostData.posts
            this.postsUpdated.next({posts: [...this.posts],
            postCount: transformedPostData.maxPosts})
        })
    }

    getPostUpdateListener(){
        return this.postsUpdated.asObservable();
    }

    getPost(id: string) {
        return this.http.get<{
            _id: string;
            title:string; 
            content: string;
            imagePath: string; 
            creator:string
        }>(BACKEND_URL + id)
    }

    addPost(title: string, content: string, image: File) {
        const postData = new FormData();
        postData.append("title", title);
        postData.append("content", content);
        postData.append("image", image, title);
        this.http
        .post<{message: string, post: Post}>(
            BACKEND_URL, 
            postData
            )
        .subscribe(responseData => {
            this.router.navigate(["/"])
            // this.postSocketService.emitCreatePostSocket(postData);
        })
    }

    updatePost(id: string, title:string, content:string, image: File | string) {
        let postData: Post | FormData;
        if(typeof(image) === 'object') {
            postData = new FormData();
            postData.append("id", id);
            postData.append("title", title);
            postData.append("content", content);
            postData.append("image", image, title);
        } else {
            postData = {
                id: id,
                title: title,
                content: content,
                imagePath: image,
                creator: null
            }

        }
        this.http.put(BACKEND_URL + id, postData)
        .subscribe(response => {
            this.router.navigate(["/"]);
            // this.postSocketService.emitUpdatePostSocket(postData)
        })
    }

    deletePost(postId: string) {

        return this.http.delete(BACKEND_URL + postId)

    }

    // private observePostSocket() {
    //     this.postSocketService.receiveCreatePostSocket()
    //     .subscribe((post: any) => {
    //       console.log(`Create ${post.id} Post socket received`);
    //       this.refreshPosts(post);
    //     });
       
    //     this.postSocketService.receiveUpdatePostSocket()
    //     .subscribe((post: any) => {
    //       console.log(`Update ${post.id} Post socket received`);
    //       this.refreshPosts(post);
    //     });
       
    //     this.postSocketService.receiveDeletePostSocket()
    //     .subscribe((post: any) => {
    //       console.log(`Delete ${post.id} Post socket received`);
    //       this.refreshPosts(post);
    //     });
    //   }
       
    //   private refreshPosts(post: any) {
    //     if (post.creator != this.authService.getUserId()) {
    //       this.getPosts(...);
    //     }
    //   }
}