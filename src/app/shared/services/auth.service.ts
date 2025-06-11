import { Injectable } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user$ = authState(this.auth);

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private functions: Functions
  ) {}

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  async register(
    email: string,
    password: string,
    displayName: string,
    roles: string[]
  ) {
    const registerUserFn = httpsCallable(this.functions, 'registerUser');

    const userCredential = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );

    if (userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
    }

    await registerUserFn({ email, displayName, role: roles });

    return userCredential;
  }

  async isUserApproved(email: string): Promise<boolean> {
    const docRef = doc(this.firestore, 'approvedUsers', email);
    const snapshot = await getDoc(docRef);
    return snapshot.exists();
  }
}
