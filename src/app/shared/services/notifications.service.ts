import { Injectable, inject } from '@angular/core';
import { Auth, authState, getIdTokenResult, User } from '@angular/fire/auth';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  updateDoc,
  arrayUnion,
  orderBy,
  query,
} from '@angular/fire/firestore';
import { switchMap, of, filter, map, Observable, from } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private authState$ = authState(this.auth); // ✅ Get user as observable

  constructor() {}

  getAdminNotifications(): Observable<any[]> {
    return this.authState$.pipe(
      filter((user): user is User => !!user),
      switchMap((user) =>
        from(user.getIdTokenResult()).pipe(
          map((tokenResult: any) => ({
            isAdmin: (tokenResult.claims?.roles || []).includes('admin'),
            uid: user.uid,
          }))
        )
      ),
      switchMap(({ isAdmin, uid }) => {
        if (!isAdmin) return of([]);
        const ref = collection(this.firestore, 'notifications');
        const q = query(ref, orderBy('createdAt', 'desc'));
        return collectionData(q, { idField: 'id' }).pipe(
          map((notifications: any[]) =>
            notifications.filter((n) => !n.seenBy?.includes(uid))
          )
        );
      })
    );
  }

  markAsSeen(notificationId: string, uid: string) {
    const ref = doc(this.firestore, 'notifications', notificationId);
    return from(
      updateDoc(ref, {
        seenBy: arrayUnion(uid),
      })
    );
  }
}
