/**
 * Mock Email Service
 * 
 * For POC purposes - no real emails are sent
 * Just logs to console and stores in memory
 */

interface EmailLog {
  to: string;
  subject: string;
  body: string;
  type: 'signup' | 'approval' | 'rejection';
  sentAt: Date;
}

// In-memory store for sent emails (for POC viewing)
const emailLogs: EmailLog[] = [];

export class EmailService {
  /**
   * Mock send email - just logs to console
   */
  static async send(to: string, subject: string, body: string, type: EmailLog['type']) {
    const emailLog: EmailLog = {
      to,
      subject,
      body,
      type,
      sentAt: new Date(),
    };

    // Store in memory
    emailLogs.push(emailLog);

    // Log to console (simulating email send)
    console.log('\n========================================');
    console.log('📧 MOCK EMAIL SENT');
    console.log('========================================');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Type: ${type}`);
    console.log('----------------------------------------');
    console.log(body);
    console.log('========================================\n');

    return emailLog;
  }

  /**
   * Send welcome email on signup
   */
  static async sendWelcomeEmail(email: string, role: string) {
    const subject = 'Welcome to Tournament System!';
    const body = `
Hello!

Welcome to the Tournament System. You have successfully signed up.

Your role: ${role.toUpperCase()}

${role === 'organizer' 
  ? 'As an organizer, you can create tournaments and manage participant requests.'
  : 'As a participant, you can browse tournaments and request to join them.'}

Happy competing!
Tournament System Team
    `;

    return this.send(email, subject, body, 'signup');
  }

  /**
   * Send approval email when organizer approves join request
   */
  static async sendApprovalEmail(email: string, tournamentTitle: string) {
    const subject = `Your request to join "${tournamentTitle}" was APPROVED!`;
    const body = `
Congratulations!

Your request to join the tournament "${tournamentTitle}" has been approved by the organizer.

You are now officially a participant in this tournament.

Good luck!
Tournament System Team
    `;

    return this.send(email, subject, body, 'approval');
  }

  /**
   * Send rejection email when organizer rejects join request
   */
  static async sendRejectionEmail(email: string, tournamentTitle: string, reason?: string) {
    const subject = `Your request to join "${tournamentTitle}" was declined`;
    const body = `
Hello,

Unfortunately, your request to join the tournament "${tournamentTitle}" has been declined by the organizer.

${reason ? `Reason: ${reason}` : 'No specific reason was provided.'}

Don't be discouraged - there are many other tournaments to join!

Best regards,
Tournament System Team
    `;

    return this.send(email, subject, body, 'rejection');
  }

  /**
   * Get all sent emails (for POC/debugging)
   */
  static getEmailLogs(): EmailLog[] {
    return [...emailLogs];
  }

  /**
   * Clear email logs
   */
  static clearLogs() {
    emailLogs.length = 0;
  }
}
