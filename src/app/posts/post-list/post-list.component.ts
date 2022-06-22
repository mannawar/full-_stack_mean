import { Component, OnDestroy, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { Post } from '../post.model'
import { PostsService } from "../post.service";

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls:['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
    // posts =[
    //     {title:'First post', content:"This is first post"},
    //     {title:'Second post', content:"This is second post"},
    //     {title:'Third post', content:"This is third post"}
    // ]
   posts: Post[] = [];
   private postsSub: Subscription; 
   isLoading=false;
   totalPosts=0;
   postsPerPage=2;
   currentPage=1;
   pageSizeOptions=[1,2,5,10]
   private authStatusSub: Subscription;
   userIsAuthenticated = false;
   userId: string;

   constructor(public postsService: PostsService, private authService: AuthService) {}

   ngOnInit() {
    this.isLoading=true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsService.getPostUpdateListener()
    .subscribe((postData: {posts: Post[], postCount: number}) => {
        this.isLoading=false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
    })
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();

    })
   }
   
   onChangedPage(pageData: PageEvent) {
    this.isLoading=true;
    console.log(pageData)
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage)
   }

   onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
        this.postsService.getPosts(this.postsPerPage, this.currentPage)
    }, () => {
        this.isLoading = false;
    })
   }

   ngOnDestroy() {
       this.postsSub.unsubscribe()
       this.authStatusSub.unsubscribe()
   }
}