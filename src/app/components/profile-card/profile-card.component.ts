import { Component, Input, OnInit } from '@angular/core';
import { userModel } from 'src/app/models/user-model';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent implements OnInit {
  @Input() profile : userModel;
  
  constructor() { }

  ngOnInit(): void {
  }

}
