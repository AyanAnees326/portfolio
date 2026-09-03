/**
 * Screenshot capture for the case-study evidence images.
 *
 * Manual tool, deliberately not in `npm run check`. Every target is an HTTP URL,
 * so one browser covers the dev servers, the Nimir tray app and save-syncer alike.
 *
 *   node scripts/capture-shots.mjs <target>
 *
 * Covers are clipped to 4:3 because HoverPreview hard-crops to aspect-[4/3];
 * letting the CSS decide what gets cut is how you lose the subject of the shot.
 * Gallery images render about 720 CSS px wide inside max-w-3xl, so a 1440-wide
 * capture at deviceScaleFactor 2 is exactly right.
 */
import { chromium } from '@playwright/test';
import { mkdirSync, rmSync, statSync } from 'node:fs';
import { join } from 'node:path';

const OUT = 'C:/projects/_shots/out';
const VIEWPORT = { width: 1440, height: 900 };
const MAX_BYTES = 400_000;

/** target -> list of shots. Each shot: { name, url, wait?, act?, clip?, viewport? } */
const TARGETS = {
  'cs-pseudo': [
    {
      name: 'cs-pseudo-ide',
      url: 'http://localhost:5183/',
      wait: '.cm-content',
      viewport: { width: 1440, height: 620 },
      act: async (page) => {
        await typeProgram(page, [
          '// Class marks tally',
          'DECLARE Marks : ARRAY[1:5] OF INTEGER',
          'DECLARE i : INTEGER',
          'DECLARE Total : INTEGER',
          'DECLARE Passed : INTEGER',
          'DECLARE ClassName : STRING',
          'OUTPUT "Which class?"',
          'INPUT ClassName',
          'Total <- 0',
          'Passed <- 0',
          '',
          'FOR i <- 1 TO 5',
          '   Marks[i] <- (i * 17) MOD 61 + 35',
          '   Total <- Total + Marks[i]',
          '   IF Marks[i] >= 40 THEN',
          '      Passed <- Passed + 1',
          '   ENDIF',
          'NEXT i',
          '',
          'OUTPUT "Class: ", ClassName',
          'OUTPUT "Average: ", Total / 5',
          'OUTPUT "Passed: ", Passed, " of 5"',
        ]);
        await page.getByRole('button', { name: 'Run', exact: true }).click();
        const input = page.getByLabel('Program input');
        await input.waitFor({ timeout: 15_000 });
        await input.fill('Year 11 Blue');
        await input.press('Enter');
        await page.waitForTimeout(1200);
      },
    },
    {
      name: 'cs-pseudo-sql',
      url: 'http://localhost:5183/library',
      wait: 'textarea',
      viewport: { width: 1440, height: 760 },
      act: async (page) => {
        const box = page.getByPlaceholder('SELECT ... FROM Books ...').first();
        await box.scrollIntoViewIfNeeded();
        await box.fill(
          "SELECT Title, Author, Price FROM Books WHERE Genre = 'Fiction' AND Price < 15 ORDER BY Price",
        );
        await page.getByRole('button', { name: 'Run query' }).first().click();
        await page.waitForTimeout(600);
        // Anchor on the card heading, not the textarea: a sticky top bar covers
        // the first 55px, so scrollIntoViewIfNeeded parks the title underneath it.
        await page
          .getByText('SELECT with a condition')
          .first()
          .evaluate((el) => el.scrollIntoView({ block: 'start' }));
        await page.mouse.wheel(0, -80);
      },
    },
    {
      name: 'cs-pseudo-library',
      url: 'http://localhost:5183/library',
      wait: 'text=Practice Library',
    },
  ],
  savesync: [
    {
      // The status card and the conflict resolver sit one above the other, so a
      // single 760-tall frame carries both without a seam.
      name: 'savesync-conflict',
      url: 'http://127.0.0.1:8790/?token=shots',
      wait: 'text=Untitled RPG',
      viewport: { width: 1200, height: 760 },
      act: async (page) => page.waitForTimeout(900),
    },
    {
      name: 'savesync-history',
      url: 'http://127.0.0.1:8790/?token=shots',
      wait: 'text=Untitled RPG',
      viewport: { width: 1200, height: 500 },
      act: async (page) => {
        await page.waitForTimeout(900);
        // Expanding backups first also gives the page enough height below
        // HISTORY for the scroll anchor to actually reach the top.
        await page.getByRole('button', { name: /Show \(/ }).click();
        await page.waitForTimeout(400);
        await page
          .getByText('HISTORY')
          .first()
          .evaluate((el) => el.scrollIntoView({ block: 'start' }));
        await page.mouse.wheel(0, -24);
      },
    },
  ],
  vaughn: (() => {
    const url = 'http://localhost:5184/';
    /**
     * Steps 1 and 2 are gated by validation, so the ticket shot has to walk the
     * whole form. Filling every step also means step 1 is already dressed when
     * the second shot needs it, but each shot reloads, so it is repeated.
     */
    const openQuote = async (page) => {
      await page.waitForTimeout(1200);
      await page.getByRole('button', { name: 'Get a Quote' }).first().click();
      await page.waitForTimeout(900);
    };
    const fillStepSign = async (page) => {
      await page.getByRole('button', { name: 'Pylon / Pole' }).click();
      await page.getByRole('radio', { name: 'Front-lit' }).click();
      await page.getByLabel('Width in feet').fill('10');
      await page.getByLabel('Height in feet').fill('24');
      await page.waitForTimeout(500);
    };
    return [
      {
        name: 'vaughn-hero',
        url,
        wait: '#sign-text',
        viewport: { width: 1440, height: 1280 },
        act: async (page) => {
          await page.locator('#sign-text').fill('BLUE BAYOU');
          await page.getByRole('button', { name: 'Ice Blue' }).click();
          // Off the swatch, or its hover scale reads as a second selected state.
          await page.mouse.move(1420, 12);
          // Focusing the controls scrolls the neon out of frame, and the hero
          // fades the sign out as you scroll, so go back to the top.
          await page.evaluate(() => window.scrollTo(0, 0));
          await page.waitForTimeout(1400);
        },
      },
      {
        // The panel is max-w-2xl, so a 1440 frame would be mostly backdrop.
        name: 'vaughn-quote',
        url,
        wait: '#sign-text',
        viewport: { width: 880, height: 800 },
        act: async (page) => {
          await openQuote(page);
          await fillStepSign(page);
          // The height field keeps focus after fill, and a focused number input
          // draws spinner arrows that read as a rendering artifact.
          await page.evaluate(() => document.activeElement?.blur());
          await page.mouse.move(870, 10);
          await page.waitForTimeout(400);
        },
      },
      {
        name: 'vaughn-ticket',
        url,
        wait: '#sign-text',
        viewport: { width: 880, height: 900 },
        act: async (page) => {
          await page.locator('#sign-text').fill('BLUE BAYOU');
          await openQuote(page);
          await fillStepSign(page);
          await page.getByRole('dialog').getByRole('button', { name: /Next/ }).click();
          await page.waitForTimeout(600);
          await page.locator('#q-location').fill('4400 Navigation Blvd, 77011');
          await page.getByLabel('Property type').selectOption('freestanding');
          await page.getByRole('radio', { name: '3–6 months' }).click();
          await page.getByRole('radio', { name: '$15–50k' }).click();
          await page.getByRole('dialog').getByRole('button', { name: /Next/ }).click();
          await page.waitForTimeout(600);
          await page.locator('#q-name').fill('Dana Whitlock');
          await page.locator('#q-phone').fill('7135550142');
          await page.locator('#q-email').fill('dana@bluebayou.example');
          await page.getByRole('radio', { name: 'Text' }).click();
          await page.locator('input[type="checkbox"]').check();
          await page.getByRole('button', { name: 'Send it to the shop' }).click();
          // The RECEIVED stamp springs in on a 0.35s delay and overshoots.
          await page.waitForTimeout(2200);
          await page.mouse.move(870, 10);
        },
      },
    ];
  })(),
  nimir: (() => {
    const url = 'http://127.0.0.1:8765/';
    // A welcome splash covers the app until it is clicked, and the sidebar is
    // the only way between views, so every shot repeats both steps.
    const view = (name, label, height) => ({
      name,
      url,
      wait: 'body',
      viewport: { width: 1440, height },
      act: async (page) => {
        await page.waitForTimeout(1200);
        await page.mouse.click(720, height / 2);
        await page.waitForSelector('text=Dashboard', { timeout: 15_000 });
        await page.waitForTimeout(800);
        if (label !== 'Dashboard') {
          await page.getByText(label, { exact: true }).first().click();
          await page.waitForTimeout(1000);
        }
        // Park the cursor off every card, or whatever it last landed on keeps
        // its hover glow and reads as a selected state that nobody selected.
        await page.mouse.move(1420, 12);
        await page.waitForTimeout(400);
      },
    });
    return [
      view('nimir-dashboard', 'Dashboard', 560),
      view('nimir-pending', 'Pending', 500),
      view('nimir-history', 'History', 460),
    ];
  })(),
  'nimir-hr': [
    {
      name: 'nimir-hr-ask',
      url: 'http://127.0.0.1:8770/',
      wait: 'text=HR Policy Assistant',
      viewport: { width: 1280, height: 620 },
      act: async (page) => page.waitForTimeout(1500),
    },
    {
      name: 'nimir-hr-sources',
      url: 'http://127.0.0.1:8770/',
      wait: 'text=HR Policy Assistant',
      viewport: { width: 1280, height: 520 },
      act: async (page) => {
        await page.waitForTimeout(1200);
        await page.getByRole('button', { name: 'Manage Policies' }).click();
        await page.waitForTimeout(800);
        // The document list is behind the admin token. This one is a throwaway
        // set for the capture run, not a credential.
        await page.getByPlaceholder('Admin token').fill('scratch-token-not-a-credential');
        await page.getByRole('button', { name: 'Unlock' }).click();
        await page.waitForTimeout(1500);
        await page
          .getByText('Policy Documents', { exact: true })
          .last()
          .evaluate((el) => el.scrollIntoView({ block: 'start' }));
        await page.mouse.wheel(0, -28);
        await page.mouse.move(1260, 10);
      },
    },
  ],
};

/**
 * CodeMirror 6 ignores fill(), and defaultKeymap's Enter carries the previous
 * line's indentation forward, so typing a pre-indented block compounds it.
 * Selecting to line start before each line means the carried indent is replaced
 * rather than added to. Escape at the end kills the autocomplete popup, which
 * otherwise sits over the last line in the shot.
 */
async function typeProgram(page, lines) {
  const editor = page.locator('.cm-content');
  await editor.click();
  await page.keyboard.press('Control+a');
  await page.keyboard.press('Delete');
  for (const [i, line] of lines.entries()) {
    if (i > 0) {
      await page.keyboard.press('Enter');
      await page.keyboard.press('Shift+Home');
    }
    if (line) await page.keyboard.type(line, { delay: 8 });
  }
  await page.keyboard.press('Escape');
  await page.locator('body').click({ position: { x: 5, y: 5 } });
  await page.keyboard.press('Escape');
}

async function shoot(page, shot) {
  if (shot.viewport) await page.setViewportSize(shot.viewport);
  else await page.setViewportSize(VIEWPORT);
  await page.goto(shot.url, { waitUntil: 'networkidle', timeout: 60_000 });
  if (shot.wait) await page.waitForSelector(shot.wait, { timeout: 30_000 });
  if (shot.act) await shot.act(page);
  await page.waitForTimeout(600);

  const file = join(OUT, `${shot.name}.png`);
  await page.screenshot({ path: file, clip: shot.clip });

  if (statSync(file).size > MAX_BYTES) {
    const jpg = join(OUT, `${shot.name}.jpg`);
    await page.screenshot({ path: jpg, type: 'jpeg', quality: 82, clip: shot.clip });
    rmSync(file);
    console.log(`  ${shot.name}: png over budget, wrote jpg`);
  } else {
    console.log(`  ${shot.name}: ok`);
  }
}

const target = process.argv[2];
const shots = TARGETS[target];
if (!shots) {
  console.error(`unknown target "${target}". known: ${Object.keys(TARGETS).join(', ')}`);
  process.exit(1);
}

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: VIEWPORT,
  deviceScaleFactor: 2,
  reducedMotion: 'reduce',
  colorScheme: 'light',
});
const page = await context.newPage();

console.log(`capturing ${target}`);
for (const shot of shots) {
  try {
    await shoot(page, shot);
  } catch (err) {
    console.error(`  ${shot.name}: FAILED ${err.message.split('\n')[0]}`);
  }
}
await browser.close();
