import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/services/auth/shared/shared.service';
import { postRequest } from 'src/app/models/post-request';
import { PostService } from 'src/app/services/post/post.service';
import { userModel } from 'src/app/models/user-model';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit {

  @Input() id : string;

  public charCount: number = 0;

  public selectedFile : File;

  public imgFiles : any[] = [];
  public imgFilesLoad : File[] = [];

  public imgCount : number = 0;

  public tooManyImg : boolean = false;

  public currentUser : userModel;

  public postId : string | null;

  public postText : string = "";

  public postForm = new FormGroup({
    postText : new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(250)])
  })

  constructor(private sharedService : SharedService, 
    private postService : PostService, private activatedRoute : ActivatedRoute) {
  }

  ngOnInit(): void {
    this.sharedService.getCurrentUser().subscribe((resUser)=> this.currentUser = resUser);
    
    this.postId = this.activatedRoute.snapshot.paramMap.get("id");
  }

  public onFileChanged(event : any) : void{
    if(this.imgCount >= 2){
      this.tooManyImg = true;
      return ;
    }

    this.selectedFile = event.target.files[0];
    this.imgFilesLoad.push(this.selectedFile);
    
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (event2) => {
      this.imgFiles.push(reader.result);
      this.imgCount++;
    }
  }

  public auto_grow() {
    let element = document.getElementById('input-form');

    element.style.height = "0";
    if(this.postForm.get("postText").value == null){
      element.style.height = 44 + "px";
      return ;
    }
    this.charCount = this.postForm.get("postText").value.length;
    element.style.height = element.scrollHeight + "px";
  } 

  public deletePhotoAtIndex(i : number){
    this.imgFiles.splice(i, 1);
    this.imgFilesLoad.splice(i, 1);
    this.imgCount -= 1;
  }

  public sendPost(){

    if(!this.postForm.valid) return ;

    let formData = new FormData();
    let postReq = new postRequest();
    
    for(let image of this.imgFilesLoad){
      formData.append('images', image);
    }

    postReq.message = this.postForm.value.postText;

    formData.append('jsonString', JSON.stringify(postReq));

    this.charCount = 0;
    this.postForm.reset();
    this.auto_grow();
    this.imgCount = 0;
    this.imgFiles = [];
    this.imgFilesLoad = [];

    if(this.id){
      this.postService.replyToPost(postReq, this.id);
      
      return ;
    }

    this.postService.uploadPost(formData);
  }
}
