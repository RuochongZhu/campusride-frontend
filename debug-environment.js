// 检查环境变量 - 不依赖外部包

console.log('🔍 环境变量检查:');
console.log('================================');

// 检查Supabase环境变量
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

console.log('📊 Supabase配置:');
console.log('- SUPABASE_URL:', supabaseUrl ? '✅ 已设置' : '❌ 未设置');
console.log('- SUPABASE_SERVICE_KEY:', supabaseServiceKey ? '✅ 已设置' : '❌ 未设置');
console.log('- SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ 已设置' : '❌ 未设置');

// 检查Resend环境变量
const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL;
const fromName = process.env.RESEND_FROM_NAME;
const frontendUrl = process.env.FRONTEND_URL;

console.log('\n📧 Resend邮件配置:');
console.log('- RESEND_API_KEY:', resendApiKey ? '✅ 已设置' : '❌ 未设置');
console.log('- RESEND_FROM_EMAIL:', fromEmail ? `✅ ${fromEmail}` : '❌ 未设置');
console.log('- RESEND_FROM_NAME:', fromName ? `✅ ${fromName}` : '❌ 未设置');
console.log('- FRONTEND_URL:', frontendUrl ? `✅ ${frontendUrl}` : '❌ 未设置');

// 检查JWT配置
const jwtSecret = process.env.JWT_SECRET;
const jwtExpire = process.env.JWT_EXPIRE || process.env.JWT_EXPIRES_IN;

console.log('\n🔐 JWT配置:');
console.log('- JWT_SECRET:', jwtSecret ? '✅ 已设置' : '❌ 未设置');
console.log('- JWT_EXPIRE:', jwtExpire ? `✅ ${jwtExpire}` : '❌ 未设置');

// 测试Supabase连接
console.log('\n🔗 Supabase连接状态:');
if (supabaseUrl && supabaseServiceKey) {
  console.log('✅ 环境变量已设置，可以尝试连接');
} else {
  console.log('❌ Supabase环境变量缺失，无法连接');
}

console.log('\n📮 Resend API状态:');
if (resendApiKey) {
  console.log('✅ RESEND_API_KEY已设置，可以尝试发送邮件');
} else {
  console.log('❌ RESEND_API_KEY未设置，无法发送邮件');
}

console.log('\n✅ 环境变量检查完成');