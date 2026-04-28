#!/usr/bin/env python3
"""ASF Monetization Test Suite - validates HTML structure"""

import re, sys

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

passed = 0
failed = 0

def test(name, condition):
    global passed, failed
    if condition:
        print(f'✅ {name}')
        passed += 1
    else:
        print(f'❌ {name}')
        failed += 1

print('\n🧪 ASF Monetization Test Suite\n' + '='*50)

# Structure
print('\n📦 Structure:\n')
test('Loja section exists', 'id="loja"' in html)
test('affiliate-store container', 'id="affiliate-store"' in html)
test('premium-modal exists', 'id="premium-modal"' in html)
test('newsletter-email input', 'id="newsletter-email"' in html)
test('WhatsApp contact func', 'function contactWhatsApp()' in html)
test('showPremiumModal func', 'function showPremiumModal()' in html)
test('subscribeNewsletter func', 'function subscribeNewsletter()' in html)
test('openAffiliateLink func', 'function openAffiliateLink(' in html)
test('renderAffiliateStore func', 'function renderAffiliateStore()' in html)

# Products
print('\n🛒 Products:\n')
test('AFFILIATE_PRODUCTS array', 'const AFFILIATE_PRODUCTS = [' in html)
test('Product: Prancha Soft Caril', 'prancha-soft-caril' in html)
test('Product: Lycra DryFit', 'lycra-termica-dryfit' in html)
test('Product: Wax FCS', 'wax-fcs' in html)
test('Product: Poncho', 'poncho-microfibra' in html)
test('Mercado Livre URLs', 'mercadolivre.com.br' in html)
test('6+ products', html.count("id: '") >= 6)

# Navigation
print('\n🧭 Navigation:\n')
test('Loja nav button', 'aria-label="Loja e ofertas"' in html)
test('Premium nav button', 'aria-label="Tornar-se Premium"' in html)
test('Loja onclick correct', "handleNavTap(this, 'loja')" in html)
test('Premium onclick modal', 'showPremiumModal()' in html)

# Tracking
print('\n📊 Analytics:\n')
test('GA4 script present', "gtag('config', 'G-" in html)
test('trackEvent function', 'function trackEvent(' in html)
test('getStats function', 'function getStats()' in html)
test('ASFMonetization object', 'window.ASFMonetization' in html)
test('monetization-stats key', "'asf-monetization-stats'" in html)
test('affiliate-clicks key', "'asf-affiliate-clicks'" in html)

# GA4 Events
print('\n🎯 Events:\n')
test('affiliate_click event', "'affiliate_click'" in html)
test('newsletter_signup event', "'newsletter_signup'" in html)
test('premium_modal_view event', "'premium_modal_view'" in html)
test('payment_start event', "'payment_start'" in html)

# UI/UX
print('\n🎨 UI:\n')
test('Toast notifications', 'function showToast(' in html)
test('Modal animation', '@keyframes modalBounce' in html)
test('Toast animation', '@keyframes toastIn' in html)
test('Premium CTA banner', 'Apoie a ASF - Vire Premium' in html)
test('Newsletter section', 'id="monetization-cta"' in html)

# Content
print('\n📝 Content:\n')
test('"Ver oferta" button', '🛒 Ver oferta' in html)
test('Premium price R$19,90', 'R$ 19,90' in html)
test('7 days free text', '7 dias grátis' in html)
test('Mercado Pago', 'Mercado Pago' in html)
test('WhatsApp number', '5511954346288' in html)
test('Privacy notice', 'seu email está seguro' in html)

print('\n' + '='*50)
print(f'\n📊 Results: {passed} passed, {failed} failed')

if failed == 0:
    print('\n🎉 All tests passed! Monetization is ready.')
    print('\n💡 Action items:')
    print('   1. Get Google AdSense approval')
    print('   2. Set up Mercado Pago API')
    print('   3. Configure MailerLite API key')
    print('   4. Test manually: https://acarolmourad-commits.github.io/asf-app/')
    print('   5. Verify GA4 real-time events\n')
    sys.exit(0)
else:
    print('\n⚠️  Some checks failed - review implementation.\n')
    sys.exit(1)
