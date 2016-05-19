import {Page, Loading, NavController, ActionSheet} from 'ionic-angular';
import {Camera} from 'ionic-native';

@Page({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {

  srcImage: string;

  constructor(private nav: NavController) { }

  presentActionSheet() {
    let actionSheet = ActionSheet.create({
      buttons: [
        {
          text: 'Choose Photo',
          handler: () => {
            this.getPicture(0); // 1 == Library
          }
        },
        {
          text: 'Take Photo',
          handler: () => {
            this.getPicture(1); // 1 == Camera
          }
        },
        {
          text: 'Demo Photo',
          handler: () => {
            this.srcImage = 'demo.png';
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    this.nav.present(actionSheet);
  }

  getPicture (sourceType: number) {
    // You can check the values here:
    // https://github.com/driftyco/ionic-native/blob/master/src/plugins/camera.ts
    Camera.getPicture({
      quality: 100,
      destinationType: 0, // DATA_URL
      sourceType: sourceType,
      allowEdit: true,
      saveToPhotoAlbum: false,
      correctOrientation: true
    }).then(imageData => {
      this.srcImage = `data:image/jpeg;base64,${imageData}`;
    }, error => {
        console.log(`ERROR -> ${JSON.stringify(error)}`);
    });
  }

  analyze () {
    let loading = Loading.create();
    this.nav.present(loading);
    OCRAD(document.getElementById('image'), text => {
      loading.dismiss();
      console.log(text);
      alert(text);
    });
  }

  restart () {
    this.srcImage = '';
    this.presentActionSheet();
  }

}
