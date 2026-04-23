// EmailServices/createTimetableEmail.js

import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

// Product Database (Dubois Beauty)
const productDatabase = {
  // Example structure (replace with your real data)
  cleansers: {
    dry: { product: 'Hydrating Cleanser', instructions: 'Gently cleanse morning & evening' },
    oily: { product: 'Foaming Cleanser', instructions: 'Use morning & evening' },
    combination: { product: 'Balancing Cleanser', instructions: 'Use morning & evening' },
    normal: { product: 'Gentle Cleanser', instructions: 'Use daily' },
    sensitive: { product: 'Soothing Cleanser', instructions: 'Use morning & evening' }
  },
  toners: {
    dry: { product: 'Hydrating Toner', instructions: 'Apply with cotton pad' },
    oily: { product: 'Clarifying Toner', instructions: 'Apply morning & evening' },
    combination: { product: 'Balancing Toner', instructions: 'Apply daily' },
    normal: { product: 'Refreshing Toner', instructions: 'Use as needed' },
    sensitive: { product: 'Soothing Toner', instructions: 'Use morning & evening' }
  },
  moisturizers: {
    dry: { product: 'Rich Moisturizer', instructions: 'Apply generously' },
    oily: { product: 'Lightweight Gel', instructions: 'Apply morning & evening' },
    combination: { product: 'Balancing Cream', instructions: 'Apply to dry areas' },
    normal: { product: 'Daily Moisturizer', instructions: 'Apply daily' },
    sensitive: { product: 'Barrier Cream', instructions: 'Apply morning & evening' }
  },
  sunscreens: {
    dry: { product: 'Hydrating SPF50', instructions: 'Apply every morning' },
    oily: { product: 'Mattifying SPF50', instructions: 'Apply every morning' },
    combination: { product: 'SPF50 Lotion', instructions: 'Apply daily' },
    normal: { product: 'Daily SPF50', instructions: 'Apply morning' },
    sensitive: { product: 'Soothing SPF50', instructions: 'Apply every morning' }
  },
  serums: {
    acne: { product: 'BHA Serum', instructions: 'Apply on affected areas' },
    aging: { product: 'Retinol Serum', instructions: 'Apply at night' },
    darkSpots: { product: 'Vitamin C Serum', instructions: 'Apply in the morning' }
  }
};

// Generate personalized skincare routine
export const generateSkincareRoutine = (skinType, concerns, morningTime, eveningTime) => {
  const routine = {
    skinType,
    concerns,
    schedule: { morning: morningTime, evening: eveningTime },
    products: {},
    weeklySchedule: {},
    instructions: {},
    personalizedTips: []
  };

  routine.products.cleanser = productDatabase.cleansers[skinType];
  routine.products.toner = productDatabase.toners[skinType];
  routine.products.moisturizer = productDatabase.moisturizers[skinType];
  routine.products.sunscreen = productDatabase.sunscreens[skinType];
  routine.products.serums = concerns.map(c => productDatabase.serums[c]).filter(Boolean);

  routine.weeklySchedule = generateWeeklySchedule(skinType, concerns);
  routine.instructions = generateDetailedInstructions(routine.products);
  routine.personalizedTips = generatePersonalizedTips(skinType, concerns);

  return routine;
};

// Weekly schedule logic
const generateWeeklySchedule = (skinType, concerns) => {
  const baseSchedule = {
    monday: { am: 'Cleanse, Tone, Moisturize, SPF', pm: 'Cleanse, Tone, Moisturize' },
    tuesday: { am: 'Cleanse, Tone, Moisturize, SPF', pm: 'Cleanse, Tone, Moisturize' },
    wednesday: { am: 'Cleanse, Tone, Moisturize, SPF', pm: 'Cleanse, Tone, Moisturize' },
    thursday: { am: 'Cleanse, Tone, Moisturize, SPF', pm: 'Cleanse, Tone, Moisturize' },
    friday: { am: 'Cleanse, Tone, Moisturize, SPF', pm: 'Cleanse, Tone, Moisturize' },
    saturday: { am: 'Cleanse, Tone, Moisturize, SPF', pm: 'Cleanse, Tone, Moisturize' },
    sunday: { am: 'Cleanse, Tone, Moisturize, SPF', pm: 'Cleanse, Tone, Moisturize' }
  };

  if (skinType === 'sensitive') {
    baseSchedule.wednesday.pm = 'Double Cleanse, Soothing Serum, Barrier Cream';
    baseSchedule.saturday.pm = 'Double Cleanse, Calming Mask, Recovery Balm';
  }
  if (concerns.includes('acne')) {
    baseSchedule.wednesday.pm = 'Double Cleanse, BHA Treatment, Oil-Free Moisturizer';
    baseSchedule.saturday.pm = 'Double Cleanse, Purifying Mask, Spot Treatment';
  }
  if (concerns.includes('aging')) {
    baseSchedule.monday.pm = 'Double Cleanse, Retinol Serum, Repair Cream';
    baseSchedule.wednesday.pm = 'Double Cleanse, AHA Treatment, Peptide Serum';
  }

  return baseSchedule;
};

// Detailed instructions
const generateDetailedInstructions = (products) => ({
  general: [
    "Always perform a patch test 24 hours before using new products",
    "Introduce one new product at a time, waiting 1-2 weeks between additions",
    "Consistency is key - follow your routine daily for optimal results",
    "Maintain a healthy lifestyle with balanced diet and adequate hydration"
  ],
  morning: [
    "Start with a clean face using your cleanser",
    products.cleanser.instructions,
    "Follow with toner to balance and prepare skin",
    products.toner.instructions,
    ...(products.serums?.map(s => `Apply ${s.product}: ${s.instructions}`) || []),
    "Lock in hydration with moisturizer",
    products.moisturizer.instructions,
    "Finish with sunscreen for complete protection",
    products.sunscreen.instructions
  ],
  evening: [
    "First cleanse: Use oil-based cleanser to remove sunscreen and makeup",
    "Second cleanse: " + products.cleanser.instructions,
    "Tone to remove any residue and rebalance",
    products.toner.instructions,
    ...(products.serums?.map(s => `Evening application: ${s.instructions}`) || []),
    "Nighttime moisturizer application: " + products.moisturizer.instructions
  ],
  weekly: [
    "Wednesday: Gentle exfoliation to remove dead skin cells",
    "Friday: Intensive overnight treatment for weekend recovery",
    "Saturday: Mask treatment for deep cleansing or hydration",
    "Sunday: Focus on barrier repair and skin restoration"
  ]
});

// Personalized tips
const generatePersonalizedTips = (skinType, concerns) => {
  const tips = [];
  const skinTypeTips = {
    dry: ["Apply moisturizer to damp skin", "Use a humidifier overnight", "Avoid hot water when cleansing"],
    oily: ["Don't skip moisturizer", "Use blotting papers", "Clean your phone screen regularly"],
    combination: ["Apply different products to zones", "Lighter textures on T-zone", "Adjust for seasons"],
    normal: ["Focus on prevention", "Simplicity is best", "Regular facials maintain skin health"],
    sensitive: ["Patch test new products", "Keep a product diary", "Avoid fragrance and essential oils"]
  };

  tips.push(...(skinTypeTips[skinType] || []));

  if (concerns.includes('acne')) tips.push("Change pillowcases every 3-4 days", "Avoid touching your face");
  if (concerns.includes('aging')) tips.push("Always wear sunscreen", "Sleep on your back to prevent lines");
  if (concerns.includes('darkSpots')) tips.push("Be consistent with treatment", "Never pick at dark spots");

  return tips;
};

// Generate PDF
export const generateSkincarePDF = (userData, routine) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      const colors = {
        primary: '#8B7355', secondary: '#A8C8B8', accent: '#D4A574',
        dark: '#2C2C2C', medium: '#666666', light: '#888888',
        background: '#F8F6F2', border: '#E8DECD', highlight: '#FFF9F0'
      };

      const addWatermark = () => {
        doc.save();
        doc.translate(doc.page.width / 2, doc.page.height / 2);
        doc.rotate(-45);
        doc.fillColor(colors.light).opacity(0.03);
        doc.fontSize(72).font('Helvetica-Bold');
        doc.text('KILIFONIA BEAUTY', -350, 0, { width: 700, align: 'center' });
        doc.restore();
      };

      // Header
      doc.rect(0, 0, doc.page.width, 100).fillColor(colors.background).fill();
      addWatermark();

      let y = 45;
      doc.fillColor(colors.primary).fontSize(16).font('Helvetica-Bold').text('KILIFONIA BEAUTY', 50, y);
      y += 25;
      doc.fillColor(colors.dark).fontSize(20).font('Helvetica-Bold').text('Personalized Skincare Journey', 50, y, { align: 'center' });
      y += 25;
      doc.fillColor(colors.medium).fontSize(10).font('Helvetica').text(`Created for ${userData.name} | ${new Date().toLocaleDateString()}`, 50, y, { align: 'center' });
      y += 40;

      // Skin Profile
      doc.fillColor(colors.dark).fontSize(16).font('Helvetica-Bold').text('Skin Profile', 50, y);
      doc.moveTo(50, y + 20).lineTo(550, y + 20).strokeColor(colors.secondary).lineWidth(2).stroke();
      y += 35;
      const profile = [
        { label: 'Skin Type', value: userData.skinType },
        { label: 'Primary Concerns', value: userData.concerns.join(', ') },
        { label: 'Morning Routine', value: userData.morningTime },
        { label: 'Evening Routine', value: userData.eveningTime }
      ];
      profile.forEach((item, i) => {
        const rowY = y + i * 18;
        doc.fillColor(colors.dark).fontSize(10).font('Helvetica-Bold').text(`${item.label}:`, 50, rowY);
        doc.fillColor(colors.medium).font('Helvetica').text(item.value, 140, rowY, { width: 400 });
      });
      y += 100;

      // TODO: Add sections for Products, Serums, Weekly Schedule, Instructions, Personalized Tips
      // You can follow the same layout logic for each section as above

      doc.end();
    } catch (error) {
      console.error('Error generating PDF:', error);
      reject(error);
    }
  });
};