import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { PostModel } from 'src/app/models/post-model';
import { PostService } from 'src/app/services/post/post.service';

@Component({
  selector: 'app-user-posts',
  templateUrl: './user-posts.component.html',
  styleUrls: ['./user-posts.component.scss']
})
export class UserPostsComponent implements OnInit {
  username : string;
  page : number = 0;

  openedAt : string = new Date().toUTCString();
  postList = new BehaviorSubject<PostModel[]>([]);

  isLoading : Boolean = false;

  constructor(private activatedRoute : ActivatedRoute, private postService : PostService) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params)=>{
      this.openedAt = new Date().toUTCString();
      this.username = params["username"];
      this.postService.retrievePostFromUser(this.username, this.openedAt);

      this.postService.getPostFromUser().subscribe({
        next: (posts) =>{this.postList.next(posts);}
      })

      this.postService.getLoading().subscribe({
        next: (bool) => this.isLoading = bool
      })
    })
  }

  requestPostPage() : void {
    if(this.isLoading) return ;

    this.page += 1;
    this.postService.retrievePostFromUser(this.username, this.openedAt);
    
  }

}
