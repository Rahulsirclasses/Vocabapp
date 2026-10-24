// Quick test script to verify Resend email sending
import { resend } from './lib/email/resend'

async function testEmail() {
    try {
        console.log('🔍 Testing Resend API...')

        const result = await resend.emails.send({
            from: 'WordWiz <onboarding@resend.dev>',
            to: 'delivered@resend.dev', // Resend's test email
            subject: 'Test Email from WordWiz',
            html: '<p>This is a test email to verify Resend is working!</p>'
        })

        console.log('✅ Email sent successfully!')
        console.log('📧 Result:', result)
    } catch (error) {
        console.error('❌ Error sending email:', error)
    }
}

testEmail()
