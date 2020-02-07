import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { AngularFireAuth } from '@angular/fire/auth';
import { take, mergeMapTo } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/database';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { User } from 'firebase';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  constructor(
    private afAuth: AngularFireAuth,
    private afd: AngularFireDatabase,
    private afs: AngularFirestore,
    private afMessaging: AngularFireMessaging,
    private httpClient: HttpClient
  ) {
    // this.afMessaging.messaging.subscribe(
    //     (messaging) => {
    //       messaging.onMessage = messaging.onMessage.bind(messaging);
    //       messaging.onTokenRefresh = messaging.onTokenRefresh.bind(messaging);
    //     }
    //   )
  }

  getPermission() {
    this.afMessaging.requestPermission
      .pipe(mergeMapTo(this.afMessaging.tokenChanges))
      .subscribe(
        token => {
          console.log('Permission granted! Save to the server!', token);
        },
        error => {
          console.error(error);
        }
      );
  }

  // Listen for token refresh
  // monitorRefresh() {
  //   this.afMessaging.tokenChanges.subscribe(
  //     () => {
  //       console.log('token changed.');
  //       this.afMessaging.requestToken.subscribe(
  //         token => {
  //           console.log('token refreshed ', token);
  //           this.saveToken(token);
  //         },
  //         error => {
  //           console.error(error);
  //         }
  //       );
  //     },
  //     error => {
  //       console.error(error);
  //     }
  //   );
  // }

  saveToken(token: string) {
    this.afAuth.authState.pipe(take(1)).subscribe((user: any) => {
      if (!user) {
        return;
      }
      const currentTokens = user.fcmTokens || {};
      console.log(currentTokens, token);

      // If token does not exist in firestore, update db
      if (!currentTokens[token]) {
        const userRef = this.afs.collection('users').doc(user.uid);
        const tokens = { ...currentTokens, [token]: true };
        userRef.update({ fcmTokens: tokens });
      }
      // const data = {
      //     token,
      //     uid: user.uid
      // };

      // this.afs.collection('fcmTokens').add(data);
    });
  }

  receiveMessages() {
    console.log('receive message function called');
    this.afMessaging.messages.subscribe(payload => {
      console.log('Message received. ', payload);
    });
  }

  // Sending the payload with fcm url
  // this requires server token
  sendPushMessage(title, message) {
    const data: any = {
      notification: {
        title,
        body: message,
        click_action: 'http://localhost:3000/',
        icon: 'http://url-to-an-icon/icon.png',
        sound: 'default'
      },
      to:
        ''
    };

    const postData = JSON.stringify(data);
    const url = 'https://fcm.googleapis.com/fcm/send';
    this.httpClient
      .post(url, postData, {
        headers: new HttpHeaders()
          // put the server key here
          .set(
            'Authorization',
            'key='
          )
          .set('Content-Type', 'application/json')
      })
      .subscribe(
        (response: Response) => {
          console.log(response);
        },
        (error: Response) => {
          console.log(error);
          console.log('error' + error);
        }
      );
  }
}
