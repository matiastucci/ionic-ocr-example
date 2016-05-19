import {Platform, Page, NavController, ActionSheet} from 'ionic-angular';

@Page({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  constructor(private platform: Platform, private nav: NavController) { }

  presentActionSheet() {
    let actionSheet = ActionSheet.create({
      buttons: [
        {
          text: 'Choose Photo',
          handler: () => {
            console.log('Choose Photo');
          }
        },
        {
          text: 'Take Photo',
          handler: () => {
            console.log('Take Photo');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    this.nav.present(actionSheet);
  }

}
