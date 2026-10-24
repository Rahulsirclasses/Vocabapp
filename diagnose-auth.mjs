import dbConnect from './lib/db.js'
import User from './lib/models/User.js'

async function diagnoseAuth() {
    try {
        console.log('🔍 Connecting to MongoDB...')
        await dbConnect()
        console.log('✅ Connected to MongoDB\n')

        console.log('📊 Checking user data...\n')

        const users = await User.find({})
            .select('email isEmailVerified isActive emailVerificationToken emailVerificationExpiry created_at')
            .limit(10)
            .lean()

        console.log(`Found ${users.length} users:\n`)

        users.forEach((user, index) => {
            console.log(`${index + 1}. ${user.email}`)
            console.log(`   ✉️  Email Verified: ${user.isEmailVerified ? '✅ YES' : '❌ NO'}`)
            console.log(`   🔓 Active: ${user.isActive ? '✅ YES' : '❌ NO'}`)
            console.log(`   🔑 Has Token: ${user.emailVerificationToken ? 'YES' : 'NO'}`)
            if (user.emailVerificationExpiry) {
                const isExpired = new Date(user.emailVerificationExpiry) < new Date()
                console.log(`   ⏰ Token Expired: ${isExpired ? 'YES (expired)' : 'NO (valid)'}`)
            }
            console.log(`   📅 Created: ${user.created_at}`)
            console.log('')
        })

        // Check for common issues
        const unverifiedUsers = users.filter(u => !u.isEmailVerified)
        const inactiveUsers = users.filter(u => !u.isActive)

        console.log('\n📋 Summary:')
        console.log(`   Total users: ${users.length}`)
        console.log(`   Unverified emails: ${unverifiedUsers.length}`)
        console.log(`   Inactive accounts: ${inactiveUsers.length}`)

        if (unverifiedUsers.length > 0) {
            console.log('\n⚠️  ISSUE: Users with unverified emails cannot log in!')
            console.log('   These users will be blocked by the auth system.')
        }

        process.exit(0)
    } catch (error) {
        console.error('❌ Error:', error)
        process.exit(1)
    }
}

diagnoseAuth()
