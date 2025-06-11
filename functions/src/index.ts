import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import * as nodemailer from 'nodemailer';
import * as logger from 'firebase-functions/logger';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

const gmailUser = defineSecret('EMAIL_USER');
const gmailPass = defineSecret('EMAIL_PASS');

export const sendContactEmail = onCall(
  {
    secrets: [gmailUser, gmailPass],
    region: 'us-central1',
  },
  async (request) => {
    const { name, email, message } = request.data;

    logger.info('Preparing transporter...');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser.value(),
        pass: gmailPass.value(),
      },
    });

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: 'dsantanam2@gmail.com',
      subject: 'United Missions Contact Form',
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    try {
      logger.info('Sending email...');
      await transporter.sendMail(mailOptions);
      logger.info('Email sent successfully.');
      return { success: true };
    } catch (error: any) {
      logger.error('Failed to send email', error);
      throw new Error('Failed to send email: ' + error.message);
    }
  }
);

export const addTemplate = onCall(
  {
    region: 'us-central1',
  },
  async (request) => {
    const {
      templateId,
      templateName,
      description,
      tiers,
      demoLink,
      tutorialLink,
      coverPhotoUrl,
      category,
    } = request.data;

    if (!templateId || !templateName) {
      throw new HttpsError(
        'invalid-argument',
        'templateId and templateName are required.'
      );
    }

    try {
      const albumRef = db.collection('santanaCraftedTemplates').doc(templateId);

      await albumRef.set({
        name: templateName || '',
        description: description || '',
        tiers: tiers || [],
        demoLink: demoLink || '',
        tutorialLink: tutorialLink || '',
        coverImage: coverPhotoUrl,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        category: category || '',
      });

      console.log('Album created with ID:', templateId);

      return {
        success: true,
        templateId,
        templateName,
        description,
        coverPhotoUrl,
      };
    } catch (error: any) {
      console.error('Firestore error:', error);
      throw new HttpsError('internal', 'Failed to add template.');
    }
  }
);

export const deleteTemplate = onCall(
  { region: 'us-central1' },
  async (request) => {
    const { templateId } = request.data;
    if (!templateId) throw new Error('TemplateId ID is required.');

    const folderPath = `santana-crafted-templates/${templateId}/`;
    const bucket = admin.storage().bucket(); // 👈 FIXED

    // 🔥 Delete all images in the album folder
    const [files] = await bucket.getFiles({ prefix: folderPath });
    const deletePromises = files.map((file) => file.delete());
    await Promise.all(deletePromises);

    // 🔥 Delete album metadata
    await db.doc(`santanaCraftedTemplates/${templateId}`).delete();

    return { success: true, deletedCount: files.length };
  }
);

export const updateTemplate = onCall(
  { region: 'us-central1' },
  async (request) => {
    const {
      templateId,
      updatedTitle,
      updatedDescription,
      updatedTiers,
      demoLink,
      tutorialLink,
      newCoverPhotoUrl,
      category,
    } = request.data;

    if (!templateId) {
      throw new HttpsError('invalid-argument', 'Template ID is required.');
    }

    try {
      const albumRef = db.collection('santanaCraftedTemplates').doc(templateId);

      const updateData: any = {
        name: updatedTitle || '',
        description: updatedDescription || '',
        tiers: updatedTiers || [],
        demoLink: demoLink || '',
        tutorialLink: tutorialLink || '',
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        category: category || '',
      };

      if (newCoverPhotoUrl) {
        updateData.coverImage = newCoverPhotoUrl;
      }

      await albumRef.update(updateData);

      return {
        success: true,
        ...(newCoverPhotoUrl && { coverImage: newCoverPhotoUrl }),
      };
    } catch (error: any) {
      console.error('Error updating template:', error);
      throw new HttpsError('internal', 'Failed to update template.');
    }
  }
);

// 🔐 Initialize Google Analytics Data API Client
import { GoogleAuth } from 'google-auth-library';
import { analyticsCredentials } from './secrets/analytics-credentials';

const fetch = async (url: string, init?: any): Promise<any> => {
  const mod = await import('node-fetch');
  return mod.default(url, init);
};

const auth = new GoogleAuth({
  credentials: analyticsCredentials,
  scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
});

export const getAnalyticsSummary = onCall(
  { region: 'us-central1' },
  async () => {
    console.log('[🧪 LOG] getAnalyticsSummary called');

    try {
      const client = await auth.getClient();
      const accessToken = await client.getAccessToken();
      console.log('[✅] Got access token');

      const response = await fetch(
        'https://analyticsdata.googleapis.com/v1beta/properties/490895302:runReport',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
            metrics: [{ name: 'activeUsers' }, { name: 'screenPageViews' }],
            dimensions: [{ name: 'date' }],
          }),
        }
      );

      const data = await response.json();
      console.log('[📊] GA API response:', JSON.stringify(data, null, 2));

      return { success: true, data };
    } catch (error: any) {
      console.error('[❌ ERROR] getAnalyticsSummary failed:', error);
      throw new Error('Failed to fetch analytics: ' + error.message);
    }
  }
);

export const getAnalyticsDashboards = onCall(
  { region: 'us-central1' },
  async (request) => {
    const startDate = request.data?.startDate || '7daysAgo';

    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();
    const token = accessToken.token;

    const runReport = async (dimensions: any[], metrics: any[]) => {
      const response = await fetch(
        'https://analyticsdata.googleapis.com/v1beta/properties/490895302:runReport',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            dateRanges: [{ startDate, endDate: 'today' }],
            dimensions,
            metrics,
          }),
        }
      );
      return response.json();
    };

    try {
      const [geo, source, device, userType, engagement, pages, events] =
        await Promise.all([
          runReport([{ name: 'country' }], [{ name: 'activeUsers' }]),
          runReport([{ name: 'sessionSourceMedium' }], [{ name: 'sessions' }]),
          runReport(
            [{ name: 'platform' }, { name: 'deviceCategory' }],
            [{ name: 'activeUsers' }]
          ),
          runReport([{ name: 'newVsReturning' }], [{ name: 'activeUsers' }]),
          runReport(
            [],
            [{ name: 'userEngagementDuration' }, { name: 'engagedSessions' }]
          ),
          runReport([{ name: 'pagePath' }], [{ name: 'screenPageViews' }]),
          runReport([{ name: 'eventName' }], [{ name: 'eventCount' }]),
        ]);

      return {
        success: true,
        geo,
        source,
        device,
        userType,
        engagement,
        pages,
        events,
      };
    } catch (error: any) {
      console.error('❌ Failed to fetch analytics:', error);
      throw new Error('Analytics error: ' + error.message);
    }
  }
);
