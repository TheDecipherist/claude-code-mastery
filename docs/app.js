(function () {
  'use strict';

  // Configuration
  const GUIDE_PATHS = [
    '../GUIDE.md', // Local development
    'https://raw.githubusercontent.com/TheDecipherist/claude-code-mastery/main/GUIDE.md' // Fallback
  ];

  // Theme toggle
  function initTheme() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }

  // Mobile menu toggle
  function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('mobile-menu-overlay');

    if (!menuToggle || !mobileMenu || !overlay) return;

    function openMenu() {
      menuToggle.classList.add('active');
      menuToggle.setAttribute('aria-expanded', 'true');
      mobileMenu.classList.add('active');
      overlay.classList.add('active');
      document.body.classList.add('menu-open');
    }

    function closeMenu() {
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('active');
      overlay.classList.remove('active');
      document.body.classList.remove('menu-open');
    }

    function toggleMenu() {
      if (mobileMenu.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    }

    // Toggle on button click
    menuToggle.addEventListener('click', toggleMenu);

    // Close on overlay click
    overlay.addEventListener('click', closeMenu);

    // Close on link click (after navigation)
    mobileMenu.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        closeMenu();
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        closeMenu();
      }
    });
  }

  // Configure marked.js
  function configureMarked() {
    const renderer = new marked.Renderer();

    // Wrap tables for responsive scrolling
    renderer.table = function (header, body) {
      return '<div class="table-container"><table>' + header + body + '</table></div>';
    };

    // Add IDs to headings for anchor links
    const headingCount = {};
    renderer.heading = function (text, level) {
      // Extract text content, removing HTML tags
      const textContent = text.replace(/<[^>]*>/g, '');
      let slug = textContent
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special chars except hyphens
        .replace(/\s+/g, '-') // Spaces to hyphens
        .replace(/-+/g, '-') // Collapse multiple hyphens
        .replace(/^-|-$/g, ''); // Trim hyphens

      // Handle duplicate headings by adding suffix
      if (headingCount[slug]) {
        headingCount[slug]++;
        slug = slug + '-' + headingCount[slug];
      } else {
        headingCount[slug] = 1;
      }

      return '<h' + level + ' id="' + slug + '">' + text + '</h' + level + '>';
    };

    marked.setOptions({
      renderer: renderer,
      gfm: true,
      breaks: false
    });
  }

  // Build table of contents from rendered headings
  function buildTOC() {
    const headings = document.querySelectorAll('#content h2, #content h3');
    const toc = document.getElementById('toc');
    const mobileToc = document.getElementById('mobile-toc');

    if (headings.length === 0) return;

    // Helper to populate a TOC container
    function populateTOC(container) {
      if (!container) return;

      // Clear existing links (keep header)
      const header = container.querySelector('.toc-header');
      container.innerHTML = '';
      if (header) container.appendChild(header);

      headings.forEach(h => {
        if (!h.id) return;

        const link = document.createElement('a');
        link.href = '#' + h.id;
        link.textContent = h.textContent;
        link.setAttribute('data-level', h.tagName.charAt(1));
        container.appendChild(link);
      });
    }

    // Populate both desktop and mobile TOCs
    populateTOC(toc);
    populateTOC(mobileToc);
  }

  // Scroll spy - highlight current section in TOC
  function initScrollSpy() {
    const desktopLinks = document.querySelectorAll('#toc a[href^="#"]');
    const mobileLinks = document.querySelectorAll('#mobile-toc a[href^="#"]');
    const sections = document.querySelectorAll('#content h2[id], #content h3[id]');

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Remove active from all links (desktop and mobile)
            desktopLinks.forEach(link => link.classList.remove('active'));
            mobileLinks.forEach(link => link.classList.remove('active'));

            // Add active to matching links in both TOCs
            const selector = 'a[href="#' + entry.target.id + '"]';
            const activeDesktopLink = document.querySelector('#toc ' + selector);
            const activeMobileLink = document.querySelector('#mobile-toc ' + selector);

            if (activeDesktopLink) {
              activeDesktopLink.classList.add('active');

              // Scroll desktop TOC to keep active link visible
              const toc = document.getElementById('toc');
              if (toc && activeDesktopLink.offsetTop > toc.clientHeight) {
                toc.scrollTop = activeDesktopLink.offsetTop - toc.clientHeight / 2;
              }
            }

            if (activeMobileLink) {
              activeMobileLink.classList.add('active');
            }
          }
        });
      },
      {
        rootMargin: '-10% 0px -85% 0px',
        threshold: 0
      }
    );

    sections.forEach(section => observer.observe(section));
  }

  // Fetch guide content with fallback
  async function fetchGuide() {
    for (const url of GUIDE_PATHS) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          return await response.text();
        }
      } catch (e) {
        console.warn('Failed to fetch from ' + url + ':', e.message);
      }
    }
    throw new Error('Could not load guide from any source');
  }

  // Load and render the guide
  async function loadGuide() {
    const content = document.getElementById('content');
    if (!content) return;

    try {
      const markdown = await fetchGuide();

      // Parse markdown to HTML
      const rawHtml = marked.parse(markdown);

      // Sanitize HTML
      const cleanHtml = DOMPurify.sanitize(rawHtml, {
        ADD_TAGS: ['iframe'],
        ADD_ATTR: ['target', 'rel']
      });

      content.innerHTML = cleanHtml;

      // Syntax highlighting
      if (window.Prism) {
        Prism.highlightAll();
      }

      // Build navigation
      buildTOC();

      // Initialize scroll spy after short delay for DOM to settle
      setTimeout(initScrollSpy, 100);

      // Handle initial hash in URL
      if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
          setTimeout(() => target.scrollIntoView(), 150);
        }
      }

    } catch (error) {
      console.error('Error loading guide:', error);
      content.innerHTML =
        '<div class="error">' +
        '<h2>Error Loading Guide</h2>' +
        '<p>Could not load the guide content. Please try:</p>' +
        '<ul>' +
        '<li><a href="https://github.com/TheDecipherist/claude-code-mastery/blob/main/GUIDE.md">View on GitHub</a></li>' +
        '<li>Refresh the page</li>' +
        '</ul>' +
        '</div>';
    }
  }

  // Initialize app
  function init() {
    initTheme();
    initMobileMenu();
    configureMarked();
    loadGuide();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
