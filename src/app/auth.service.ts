import { Injectable, NgZone } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { User, auth } from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { Router } from '@angular/router';

import { switchMap } from 'rxjs/operators';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FirebaseAuth } from '@angular/fire';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private zone: NgZone,
    private snackBar: MatSnackBar
  ) {
    // Get the auth state, then fetch the Firestore user document or return null
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        // Logged in
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          // Logged out
          return of(null);
        }
      })
    );
  }

  async googleSignin() {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    return this.updateUserData(credential.user);
  }

  async gitHubSignin() {
    const provider = new auth.GithubAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    return this.updateUserData(credential.user);
  }

  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${user.uid}`
    );

    const data: any = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };

    return userRef.set(data, { merge: true });
  }

  async signOut() {
    await this.afAuth.auth.signOut();
    this.openSnackBar('signed out successfully', '');
    this.router.navigate(['/']);
  }

  async signIn({ email, password }) {
    try {
      const credential = await this.afAuth.auth.signInWithEmailAndPassword(
        email,
        password
      );
      if (credential.user) {
        this.openSnackBar('signed in successfully', '');
      }
      return this.updateUserData(credential.user);
    } catch (error) {
      this.openSnackBar(error.message, '');
      console.log(error);
    }
  }

  openSnackBar(message: string, action: string, timeout = 5000) {
    console.log(message, action);
    this.zone.run(() => {
      this.snackBar.open(message, action, {
        duration: timeout
      });
    });
  }
}
