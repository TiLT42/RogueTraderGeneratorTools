// Test that xenos generation sources are automatically checked when books are enabled
// This tests the fix for: "Automatic enabling of xenos generation sources"
(function() {
    console.log('[SETTINGS-AUTO-ENABLE-TEST] Starting settings checkbox auto-enable validation...');
    
    // Simulate the updateXenosOptions function from modals.js
    function simulateUpdateXenosOptions(starsChecked, bestiaryChecked, xenosStarsCheckbox, xenosBestiaryCheckbox) {
        xenosStarsCheckbox.disabled = !starsChecked;
        if (!starsChecked) {
            xenosStarsCheckbox.checked = false;
        } else {
            xenosStarsCheckbox.checked = true;
        }

        xenosBestiaryCheckbox.disabled = !bestiaryChecked;
        if (!bestiaryChecked) {
            xenosBestiaryCheckbox.checked = false;
        } else {
            xenosBestiaryCheckbox.checked = true;
        }
    }
    
    // Test 1: Enabling Stars of Inequity should auto-enable its xenos source
    console.log('[SETTINGS-AUTO-ENABLE-TEST] Test 1: Enable Stars of Inequity book');
    let xenosStars = { disabled: true, checked: false };
    let xenosBestiary = { disabled: true, checked: false };
    
    simulateUpdateXenosOptions(true, false, xenosStars, xenosBestiary);
    
    if (xenosStars.disabled === false && xenosStars.checked === true) {
        console.log('[SETTINGS-AUTO-ENABLE-TEST] PASS: Stars of Inequity xenos source is enabled and checked');
    } else {
        console.error('[SETTINGS-AUTO-ENABLE-TEST] FAIL: Stars of Inequity xenos source - disabled:', xenosStars.disabled, 'checked:', xenosStars.checked);
    }
    
    if (xenosBestiary.disabled === true && xenosBestiary.checked === false) {
        console.log('[SETTINGS-AUTO-ENABLE-TEST] PASS: Koronus Bestiary xenos source remains disabled and unchecked');
    } else {
        console.error('[SETTINGS-AUTO-ENABLE-TEST] FAIL: Koronus Bestiary xenos source - disabled:', xenosBestiary.disabled, 'checked:', xenosBestiary.checked);
    }
    
    // Test 2: Enabling The Koronus Bestiary should auto-enable its xenos source
    console.log('[SETTINGS-AUTO-ENABLE-TEST] Test 2: Enable The Koronus Bestiary book');
    xenosStars = { disabled: true, checked: false };
    xenosBestiary = { disabled: true, checked: false };
    
    simulateUpdateXenosOptions(false, true, xenosStars, xenosBestiary);
    
    if (xenosStars.disabled === true && xenosStars.checked === false) {
        console.log('[SETTINGS-AUTO-ENABLE-TEST] PASS: Stars of Inequity xenos source remains disabled and unchecked');
    } else {
        console.error('[SETTINGS-AUTO-ENABLE-TEST] FAIL: Stars of Inequity xenos source - disabled:', xenosStars.disabled, 'checked:', xenosStars.checked);
    }
    
    if (xenosBestiary.disabled === false && xenosBestiary.checked === true) {
        console.log('[SETTINGS-AUTO-ENABLE-TEST] PASS: Koronus Bestiary xenos source is enabled and checked');
    } else {
        console.error('[SETTINGS-AUTO-ENABLE-TEST] FAIL: Koronus Bestiary xenos source - disabled:', xenosBestiary.disabled, 'checked:', xenosBestiary.checked);
    }
    
    // Test 3: Enabling both books should auto-enable both xenos sources
    console.log('[SETTINGS-AUTO-ENABLE-TEST] Test 3: Enable both books');
    xenosStars = { disabled: true, checked: false };
    xenosBestiary = { disabled: true, checked: false };
    
    simulateUpdateXenosOptions(true, true, xenosStars, xenosBestiary);
    
    if (xenosStars.disabled === false && xenosStars.checked === true) {
        console.log('[SETTINGS-AUTO-ENABLE-TEST] PASS: Stars of Inequity xenos source is enabled and checked');
    } else {
        console.error('[SETTINGS-AUTO-ENABLE-TEST] FAIL: Stars of Inequity xenos source - disabled:', xenosStars.disabled, 'checked:', xenosStars.checked);
    }
    
    if (xenosBestiary.disabled === false && xenosBestiary.checked === true) {
        console.log('[SETTINGS-AUTO-ENABLE-TEST] PASS: Koronus Bestiary xenos source is enabled and checked');
    } else {
        console.error('[SETTINGS-AUTO-ENABLE-TEST] FAIL: Koronus Bestiary xenos source - disabled:', xenosBestiary.disabled, 'checked:', xenosBestiary.checked);
    }
    
    // Test 4: Disabling a book should disable and uncheck its xenos source
    console.log('[SETTINGS-AUTO-ENABLE-TEST] Test 4: Disable Stars of Inequity book');
    xenosStars = { disabled: false, checked: true };
    xenosBestiary = { disabled: false, checked: true };
    
    simulateUpdateXenosOptions(false, true, xenosStars, xenosBestiary);
    
    if (xenosStars.disabled === true && xenosStars.checked === false) {
        console.log('[SETTINGS-AUTO-ENABLE-TEST] PASS: Stars of Inequity xenos source is disabled and unchecked');
    } else {
        console.error('[SETTINGS-AUTO-ENABLE-TEST] FAIL: Stars of Inequity xenos source - disabled:', xenosStars.disabled, 'checked:', xenosStars.checked);
    }
    
    if (xenosBestiary.disabled === false && xenosBestiary.checked === true) {
        console.log('[SETTINGS-AUTO-ENABLE-TEST] PASS: Koronus Bestiary xenos source remains enabled and checked');
    } else {
        console.error('[SETTINGS-AUTO-ENABLE-TEST] FAIL: Koronus Bestiary xenos source - disabled:', xenosBestiary.disabled, 'checked:', xenosBestiary.checked);
    }
    
    console.log('[SETTINGS-AUTO-ENABLE-TEST] Complete');
})();
