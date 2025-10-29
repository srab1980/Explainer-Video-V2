from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("http://localhost:3000")
    page.fill('textarea[placeholder="Paste your explainer video script here..."]', "This is a test script.")
    page.click('button:has-text("Generate Storyboard")')
    page.wait_for_selector('.bg-card.border-l-4', timeout=60000)
    page.screenshot(path="jules-scratch/verification/verification.png")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
