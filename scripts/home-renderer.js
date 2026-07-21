(function () {
  if (typeof siteData === "undefined") {
    console.warn("home-renderer.js: siteData تعریف نشده است.");
    return;
  }

  // 1. POPULAR COURSES
  const popularContainer = document.querySelector(".popular-courses_items");
  if (popularContainer && siteData.popularCourses && Array.isArray(siteData.popularCourses.items)) {
    const popularItems = siteData.popularCourses.items;
    if (popularItems.length > 0) {
      popularContainer.innerHTML = popularItems.slice(0, 3).map(item => `
        <li class="popular-courses_item">
          <div class="popular-courses_banner">
            <img src="${item.image || '../images/ravin.png'}" class="popular-courses_img" alt="${item.title}" />
          </div>
          <span class="popular-courses_badge"> محبوب </span>
          <div class="popular-courses_content">
            <h3 class="course-title">${item.title}</h3>
            <p class="course-description">${item.excerpt || "توضیحی برای این آیتم ثبت نشده است."}</p>
            <a href="single-post.html?id=${encodeURIComponent(item.id)}" class="popular-courses_link">
              مشاهده توضیحات <i class="fas fa-arrow-left"></i>
            </a>
          </div>
        </li>
      `).join("");
    }
  }

  // 2. NEW COURSES
  const newCoursesContainer = document.querySelector(".new-courses_items");
  if (newCoursesContainer && siteData.newCourses && Array.isArray(siteData.newCourses.items)) {
    const newItems = siteData.newCourses.items;
    if (newItems.length > 0) {
      newCoursesContainer.innerHTML = newItems.slice(0, 3).map(item => `
        <li class="new-courses_item">
          <div class="new-courses_banner">
            <img src="${item.image || '../images/ravin.png'}" class="new-courses_img" alt="${item.title}" />
          </div>
          <span class="new-courses_badge"> جدید </span>
          <div class="new-courses_content">
            <h3 class="course-title">${item.title}</h3>
            <p class="course-description">${item.excerpt || "توضیحی برای این آیتم ثبت نشده است."}</p>
            <a href="single-post.html?id=${encodeURIComponent(item.id)}" class="new-courses_link">
              مشاهده توضیحات <i class="fas fa-arrow-left"></i>
            </a>
          </div>
        </li>
      `).join("");
    }
  }

  // 3. FEATURED CONTENT (specials)
  const featuredGrid = document.querySelector(".featured-grid");
  if (featuredGrid && siteData.specials && Array.isArray(siteData.specials.items)) {
    const items = siteData.specials.items;
    if (items.length > 0) {
      const mainItem = items[0];
      const smallItems = items.slice(1, 3);
      
      let smallHtml = '';
      if (smallItems.length > 0) {
        smallHtml = `
          <div class="featured-small">
            ${smallItems.map(item => `
              <article class="featured-card">
                <a href="single-post.html?id=${encodeURIComponent(item.id)}" class="featured-content">
                  <span class="content-tag">ویژه</span>
                  <h3 class="featured-title">${item.title}</h3>
                </a>
              </article>
            `).join("")}
          </div>
        `;
      }

      featuredGrid.innerHTML = `
        <article class="featured-card large">
          <div class="featured-image">
            <img src="${mainItem.image || '../images/ravin.png'}" loading="lazy" />
            <span class="featured-badge">پیشنهادی</span>
          </div>
          <div class="featured-content">
            <span class="content-tag">ویژه</span>
            <a href="single-post.html?id=${encodeURIComponent(mainItem.id)}" class="featured-title">
              ${mainItem.title}
            </a>
            <p class="featured-desc">
              ${mainItem.excerpt || "توضیحی برای این آیتم ثبت نشده است."}
            </p>
          </div>
        </article>
        ${smallHtml}
      `;
    }
  }

  // 4. LATEST ARTICLES
  const articleContainer = document.querySelector(".article-items");
  if (articleContainer && siteData.articles && Array.isArray(siteData.articles.items)) {
    const articleItems = siteData.articles.items;
    if (articleItems.length > 0) {
      articleContainer.innerHTML = articleItems.slice(0, 3).map(item => `
        <li class="article-item">
          <div class="article-image">
            <img src="${item.image || '../images/ravin.png'}" alt="${item.title}" />
          </div>
          <div class="article-content">
            <span class="article-category"> حسابداری </span>
            <h3 class="article-title">
              <a href="single-post.html?id=${encodeURIComponent(item.id)}">
                ${item.title}
              </a>
            </h3>
            <p class="article-desc">
              ${item.excerpt || "توضیحی برای این آیتم ثبت نشده است."}
            </p>
            <a href="single-post.html?id=${encodeURIComponent(item.id)}" class="article-read-more">
              ادامه مطالعه <i class="fas fa-arrow-left"></i>
            </a>
            <div class="article-meta">
              <span>
                <i class="far fa-calendar"></i>
                ۲۶ تیر ۱۴۰۵
              </span>
              <span>
                <i class="far fa-clock"></i>
                ۵ دقیقه مطالعه
              </span>
            </div>
          </div>
        </li>
      `).join("");
    }
  }

  // 5. EXAMS
  const examsContainer = document.querySelector(".exam-news_items");
  if (examsContainer && siteData.exams && Array.isArray(siteData.exams.items)) {
    const examItems = siteData.exams.items;
    if (examItems.length > 0) {
      examsContainer.innerHTML = examItems.slice(0, 3).map(item => `
        <li class="exam-news_item">
          <div class="exam-news_content">
            <h3 class="exam-news_title">${item.title}</h3>
            <a href="single-post.html?id=${encodeURIComponent(item.id)}" class="exam-news_link">
              ادامه مطالعه <i class="fas fa-arrow-left"></i>
            </a>
            <div class="exam-news_meta">
              <span>
                <i class="far fa-calendar"></i>
                ۲۸ تیر ۱۴۰۵
              </span>
              <span>
                <i class="far fa-clock"></i>
                ۳ دقیقه مطالعه
              </span>
            </div>
          </div>
        </li>
      `).join("");
    }
  }
})();
