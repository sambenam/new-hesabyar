const pageTitle = document.getElementById("page-title");
const postsList = document.getElementById("posts-list");

if (!pageTitle || !postsList) {
  console.warn("list-page.js توی صفحه اشتباه لود شده");
} else {
  const categoryKey = new URLSearchParams(window.location.search)
    .get("cat")
    ?.trim();

  function renderPosts(posts) {
    postsList.innerHTML = "";
    posts.forEach((item) => {
      const li = document.createElement("li");
      li.className = "list-page_item";
      li.innerHTML = `<div class='list-page_item_body'>
        <h2 class='list-page_item_title'>${item.title}</h2>
        <p class='list-page_item_text'>${item.excerpt}</p>
        <a href='single-post.html?id=${encodeURIComponent(item.id)}' class='list-page_item_btn'>توضیحات بیشتر</a>
        </div><img src='${item.image}' alt='${item.title}' class='list-page_item_img' />`;
      postsList.appendChild(li);
    });
  }

  function loadListPage() {
    if (typeof siteData === "undefined") {
      console.error("❌ siteData تعریف نشده! ترتیب اسکریپت‌ها اشتباهه");
      return;
    }
    const category = siteData[categoryKey];
    if (!category) {
      pageTitle.textContent = "دسته پیدا نشد: " + categoryKey;
      return;
    }
    document.title = category.title + " | حسابیار";
    pageTitle.textContent = category.title;
    renderPosts(category.items);
  }
  loadListPage();
}
