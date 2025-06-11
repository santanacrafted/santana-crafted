import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  Firestore,
  collectionData,
  collection,
  deleteDoc,
  doc,
} from '@angular/fire/firestore';
import { httpsCallable } from '@angular/fire/functions';
import { Functions } from '@angular/fire/functions';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.component.html',
})
export class AdminUsersComponent implements OnInit {
  private firestore = inject(Firestore);
  private functions = inject(Functions);

  activeTab: 'pending' | 'approved' = 'pending';
  pendingUsers$?: Observable<any[]>;
  approvedUsers$?: Observable<any[]>;

  allRoles = ['admin', 'gallery-manager', 'analytics'];
  userRolesMap: { [email: string]: string[] } = {};
  originalRolesMap: { [email: string]: string[] } = {}; // for change tracking

  ngOnInit() {
    const colPending = collection(this.firestore, 'pendingUsers');
    const colApproved = collection(this.firestore, 'approvedUsers');

    this.pendingUsers$ = collectionData(colPending, { idField: 'email' });
    this.approvedUsers$ = collectionData(colApproved, { idField: 'email' });

    this.pendingUsers$.subscribe((users) => {
      users.forEach((user) => {
        const roles = Array.isArray(user.roles)
          ? user.roles
          : typeof user.roles === 'string'
          ? [user.roles]
          : [];
        this.userRolesMap[user.email] = [...roles];
        this.originalRolesMap[user.email] = [...roles];
      });
    });

    this.approvedUsers$.subscribe((users) => {
      users.forEach((user) => {
        const roles = Array.isArray(user.roles)
          ? user.roles
          : typeof user.roles === 'string'
          ? [user.roles]
          : [];
        this.userRolesMap[user.email] = [...roles];
        this.originalRolesMap[user.email] = [...roles];
      });
    });
  }

  toggleRole(email: string, role: string) {
    const roles = this.userRolesMap[email] || [];
    const index = roles.indexOf(role);
    if (index > -1) {
      roles.splice(index, 1); // remove
    } else {
      roles.push(role); // add
    }
    this.userRolesMap[email] = [...roles];
  }

  rolesChanged(email: string): boolean {
    const current = this.userRolesMap[email] || [];
    const original = this.originalRolesMap[email] || [];
    return current.sort().join(',') !== original.sort().join(',');
  }

  async saveRoles(email: string) {
    const updateFn = httpsCallable(this.functions, 'updateUserRoles');
    const roles = this.userRolesMap[email] || [];
    try {
      await updateFn({ email, roles });
      alert(`Roles updated for ${email}`);
      this.originalRolesMap[email] = [...roles];
    } catch (err) {
      console.error('Error updating roles:', err);
      alert('Failed to update roles.');
    }
  }

  async approve(email: string, selectedRoles: string[]) {
    const approveFn = httpsCallable(this.functions, 'approveUser');
    try {
      await approveFn({ email, roles: selectedRoles });
      alert(`${email} approved with roles: ${selectedRoles.join(', ')}`);
    } catch (err) {
      console.error('Approve error:', err);
      alert('Failed to approve user.');
    }
  }

  async reject(email: string) {
    const docRef = doc(this.firestore, 'pendingUsers', email);
    await deleteDoc(docRef);
    alert(`${email} rejected`);
  }

  deleteUser(email: string) {
    if (confirm(`Are you sure you want to delete ${email}?`)) {
      const fn = httpsCallable(this.functions, 'deleteUser');
      fn({ email }).then(() => alert(`${email} deleted`));
    }
  }
}
