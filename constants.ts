import { EmailType } from './types';

export const DEFAULT_TEMPLATE = `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; background-color: #ffffff;">
  <div style="text-align: center; margin-bottom: 24px;">
    <img src="https://picsum.photos/100/100" alt="Logo" style="border-radius: 50%; width: 64px; height: 64px; object-fit: cover;" />
  </div>
  <h1 style="color: #111827; font-size: 24px; font-weight: bold; margin-bottom: 16px; text-align: center;">Welcome to Sirz Mail</h1>
  <p style="color: #4b5563; font-size: 16px; line-height: 1.5; margin-bottom: 16px;">
    This is your starting canvas. You can edit any text by simply clicking and typing.
  </p>
  <p style="color: #4b5563; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
    <b>New:</b> Click on any image (like the logo above) to replace it with your own upload or a URL!
  </p>
  <div style="text-align: center;">
    <a href="#" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 500;">Get Started</a>
  </div>
  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
  <p style="color: #9ca3af; font-size: 12px; text-align: center;">
    © 2024 Sirz Mail. All rights reserved.<br/>
    123 Innovation Dr, Tech City
  </p>
</div>
`;

export const EMAIL_TYPES_LIST = Object.values(EmailType);