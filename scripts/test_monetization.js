#!/usr/bin/env node

/**
 * ASF App - Monetization Test Suite
 * Tests all monetization features without external dependencies
 */

const fs = require('fs');
const path = require('path');

// Test counters
let passed = 0;
let failed = 0;

function test(name, condition) {
  if (condition) {
    console.log(`✅ ${name}`);
    passed++;
  } else {
    console.log(`❌ ${name}`);
    failed++;
  }
}

// Read index.html
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

console.log('\n🧪 ASF Monetization Test Suite\n');
console.log('=' .repeat(50));

// 1. Structure Tests
console.log('\n📦 Structure Tests:\n');

test('Has Loja section', html.includes('id="loja"'));
test('Has affiliate-store container', html.includes('id="affiliate-store"'));
test('Has premium-modal', html.includes('id="premium-modal"'));
test('Has newsletter-email input', html.includes('id="newsletter-email"'));
test('Has WhatsApp button', html.includes('contactWhatsApp'));
test('Has showPremiumModal function', html.includes('function showPremiumModal()'));
test('Has hidePremiumModal function', html.includes('function hidePremiumModal()'));
test('Has subscribeNewsletter function', html.includes('function subscribeNewsletter()'));
test('Has openAffiliateLink function', html.includes('function openAffiliateLink('));
test('Has renderAffiliateStore function', html.includes('function renderAffiliateStore()'));

// 2. Products Tests
console.log('\n🛒 Products Tests:\n');

test('Has AFFILIATE_PRODUCTS array', html.includes('const AFFILIATE_PRODUCTS = ['));
test('Product: Prancha Soft Caril', html.includes('prancha-soft-caril'));
test('Product: Lycra DryFit', html.includes('lycra-termica-dryfit'));
test('Product: Wax FCS', html.includes('wax-fcs'));
test('Product: Poncho Microfibra', html.includes('poncho-microfibra'));
test('Mercado Livre URLs present', html.includes('mercadolivre.com.br'));
test('6 products in array', (html.match(/id:/g) || []).length >= 6);

// 3. Navigation Tests
console.log('\n🧭 Navigation Tests:\n');

test('Loja nav button exists', html.includes('aria-label="Loja e ofertas"'));
test('Premium nav button exists', html.includes('aria-label="Tornar-se Premium"'));
test('Loja nav has correct onclick', html.includes("handleNavTap(this, 'loja')"));
test('Premium nav calls showPremiumModal', html.includes("onclick=\"showPremiumModal()\""));

// 4. Tracking Tests
console.log('\n📊 Analytics Tests:\n');

test('GA4 script present', html.includes("gtag('config', 'G-"));
test('trackEvent function', html.includes('function trackEvent('));
test('getMonetizationStats function', html.includes('function getStats()'));
test('ASFMonetization global object', html.includes('window.ASFMonetization'));
test('LocalStorage tracking key', html.includes("'asf-monetization-stats'"));
test('Affiliate clicks tracking', html.includes("'asf-affiliate-clicks'"));

// 5. GA4 Events
console.log('\n🎯 GA4 Event Tests:\n');

test('affiliate_click event', html.includes("'affiliate_click'"));
test('newsletter_signup event', html.includes("'newsletter_signup'"));
test('premium_modal_view event', html.includes("'premium_modal_view'"));
test('payment_start event', html.includes("'payment_start'"));
test('contact_whatsapp event', html.includes("'contact_whatsapp'"));

// 6. UI/UX Tests
console.log('\n🎨 UI/UX Tests:\n');

test('Toast notification function', html.includes('function showToast('));
test('Toast animation CSS', html.includes('@keyframes toastIn'));
test('Modal animation CSS', html.includes('@keyframes modalBounce'));
test('Premium CTA banner', html.includes('Apoie a ASF - Vire Premium'));
test('Newsletter section', html.includes('id="monetization-cta"'));
test('How it works explanation', html.includes('Como funciona'));

// 7. Content Tests
console.log('\n📝 Content Tests:\n');

test('Botão "Ver oferta" text', html.includes('🛒 Ver oferta'));
test('Premium price displayed', html.includes('R$ 19,90'));
test('7 days free mention', html.includes('7 dias grátis'));
test('Mercado Pago mention', html.includes('Mercado Pago'));
test('WhatsApp number correct', html.includes('5511954346288'));
test('Email privacy notice', html.includes('seu email está seguro'));

// 8. Responsive & Mobile
console.log('\n📱 Responsive Tests:\n');

test('Viewport meta', html.includes('viewport'));
test('Outfit font family', html.includes("'Outfit'"));
test('CSS custom properties', html.includes('--primary'));
test('Grid layout for products', html.includes('grid-template-columns'));

// Summary
console.log('\n' + '=' .repeat(50));
console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('\n🎉 All tests passed! Monetization is ready.\n');
} else {
  console.log('\n⚠️  Some features may need attention.\n');
  process.exit(1);
}

// Additional info
console.log('💡 Next steps:');
console.log('   1. Get Google AdSense approval (ca-pub-XXXX)');
console.log('   2. Set up Mercado Pago API keys');
console.log('   3. Configure MailerLite API');
console.log('   4. Test manually: https://acarolmourad-commits.github.io/asf-app/');
console.log('   5. Verify GA4 real-time events\n');
