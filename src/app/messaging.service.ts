import { Injectable, NgZone } from '@angular/core';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppUser } from './models/AppUser';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  constructor(
    private afAuth: AngularFireAuth,
    private afd: AngularFireDatabase,
    private afs: AngularFirestore,
    private afMessaging: AngularFireMessaging,
    private httpClient: HttpClient,
    private snackBar: MatSnackBar,
    private zone: NgZone
  ) {
    this.afMessaging.messaging.subscribe((messaging: any) => {
      messaging._next = (payload: any) => {
        console.log(payload);
        this.openSnackBar(
          payload.notification.body,
          payload.notification.title
        );
      };
      messaging.onTokenRefresh = messaging.onTokenRefresh.bind(messaging);
    });
  }

  getPermission() {
    this.afMessaging.requestPermission
      .pipe(mergeMapTo(this.afMessaging.tokenChanges))
      .subscribe(
        token => {
          console.log('Permission granted!', token);
          this.openSnackBar('Permission granted!', '');
          this.saveToken(token);
        },
        error => {
          this.openSnackBar('Permission denied!!!', '');
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
    this.afAuth.authState.pipe(take(1)).subscribe((user: User) => {
      if (!user) {
        return;
      }
      const userRef = this.afs.collection('users').doc(user.uid);
      const fcmTokensRef = userRef.collection('fcmTokens');
      fcmTokensRef
        .valueChanges()
        .pipe(take(1))
        .subscribe(tokens => {
          console.log(tokens);
          if (!tokens.find(t => t.token === token)) {
            this.openSnackBar('Token saved to the server', '');
            fcmTokensRef.add({
              token
            });
          } else {
            this.openSnackBar('token already exists in database!', '');
            console.log('token already exists in database!');
          }
        });
    });
  }

  receiveMessages() {
    console.log('receive message function called');
    this.afMessaging.messages.subscribe((payload: any) => {
      console.log('Message received. ', payload);
      this.openSnackBar(payload.notification.body, payload.notification.title);
    });
  }

  openSnackBar(message: string, action: string, timeout = 5000) {
    console.log(message, action);
    this.zone.run(() => {
      this.snackBar.open(message, action, {
        duration: timeout
      });
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
