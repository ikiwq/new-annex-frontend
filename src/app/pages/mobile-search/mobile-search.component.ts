import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { userModel } from 'src/app/models/user-model';
import { SearchService } from 'src/app/services/search/search.service';

@Component({
  selector: 'app-mobile-search',
  templateUrl: './mobile-search.component.html',
  styleUrls: ['./mobile-search.component.scss']
})
export class MobileSearchComponent implements OnInit {

  public UserList = new BehaviorSubject<userModel[]>([]);

  public isLoading : Boolean = false;

  public inputGroup = new FormGroup({
    mainInput: new FormControl('', [Validators.minLength(0), Validators.maxLength(32)])
  })

  constructor(private searchService: SearchService, private router : Router) { }

  ngOnInit(): void {
    this.searchService.getLoadingUsers().subscribe((bool)=> this.isLoading = bool)
  }

  searchUser(e : Event){
    let search = this.inputGroup.get('mainInput').value;
    if(search.length <=0 ) return ;

    let date = new Date().toUTCString();

    this.searchService.retrieveUsersByNick(search, date);
    this.searchService.getUsersByNick().subscribe((users)=>{this.UserList.next(users); console.log(users)})
  }

  goToSearchPage(){
    let search = this.inputGroup.get('mainInput').value;
    this.router.navigate([`/search/${search}`])
  }

}
