import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  getDocs,
} from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';
import { Template } from '../../components/templates/templates.model';
import { getDownloadURL, getStorage, listAll, ref } from 'firebase/storage';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { uploadBytes, Storage, deleteObject } from '@angular/fire/storage';

@Injectable({ providedIn: 'root' })
export class TemplateService {
  functions = inject(Functions);
  storage = inject(Storage);

  constructor(private firestore: Firestore) {}

  getTemplates(): Observable<Template[]> {
    const ref = collection(this.firestore, 'santanaCraftedTemplates');
    return from(getDocs(ref)).pipe(
      map((snapshot) => {
        return snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Template)
        );
      })
    );
  }

  getEventImages(eventId: string): Promise<string[]> {
    const storage = getStorage();
    const folderRef = ref(storage, `united-mission-gallery/${eventId}`);

    return listAll(folderRef).then(async (res) => {
      const urls = await Promise.all(
        res.items.map((itemRef) => getDownloadURL(itemRef))
      );
      return urls;
    });
  }

  async addTemplate(
    templateName: string,
    description: string,
    tiers: any[],
    coverPhotoFile: File,
    category: string
  ): Promise<{ templateId: string; coverPhotoUrl: string }> {
    console.log('here');
    const tempTemplateId = doc(
      collection(this.firestore, 'santanaCraftedTemplates')
    ).id;

    // Upload cover photo first
    const coverFilePath = `santana-crafted-templates/${tempTemplateId}/cover_${Date.now()}_${
      coverPhotoFile.name
    }`;
    const coverRef = ref(this.storage, coverFilePath);
    const coverSnapshot = await uploadBytes(coverRef, coverPhotoFile);
    const coverPhotoUrl = await getDownloadURL(coverSnapshot.ref);

    // Create album with cover URL
    const createAlbumFn = httpsCallable(this.functions, 'addTemplate');
    await createAlbumFn({
      templateId: tempTemplateId,
      templateName,
      description,
      tiers,
      coverPhotoUrl,
      category,
    });

    return { templateId: tempTemplateId, coverPhotoUrl };
  }

  async deleteTemplate(templateId: string): Promise<any> {
    const deleteFn = httpsCallable(this.functions, 'deleteTemplate');
    return deleteFn({ templateId });
  }

  async deleteImagesFromStorage(imageUrls: string[]): Promise<void> {
    const deletePromises = imageUrls.map(async (url) => {
      try {
        const path = this.extractStoragePathFromUrl(url);
        const storageRef = ref(this.storage, path);
        await deleteObject(storageRef);
      } catch (err) {
        console.error(`Error deleting ${url}:`, err);
        throw err;
      }
    });

    await Promise.all(deletePromises);
  }

  private extractStoragePathFromUrl(url: string): string {
    const match = decodeURIComponent(url).match(/\/o\/(.*?)\?/);
    if (match && match[1]) {
      return match[1]; // Path inside Firebase Storage
    } else {
      throw new Error('Invalid Firebase Storage URL');
    }
  }

  async updateTemplate(
    templateId: string,
    updatedTitle?: string,
    updatedDescription?: string,
    newCoverPhotoFile?: File,
    tiers?: any[],
    category?: string
  ): Promise<any> {
    const updateAlbumFn = httpsCallable(this.functions, 'updateTemplate');

    let newCoverPhotoUrl: string | null = null;

    // If a new cover photo was provided, upload it
    if (newCoverPhotoFile) {
      const filePath = `santana-crafted-templates/${templateId}/cover_${Date.now()}_${
        newCoverPhotoFile.name
      }`;
      const imageRef = ref(this.storage, filePath);
      const snapshot = await uploadBytes(imageRef, newCoverPhotoFile);
      newCoverPhotoUrl = await getDownloadURL(snapshot.ref);
    }

    // Call cloud function to update the album metadata
    return updateAlbumFn({
      templateId,
      updatedTitle,
      updatedDescription,
      tiers,
      newCoverPhotoUrl,
      category,
    });
  }
}
