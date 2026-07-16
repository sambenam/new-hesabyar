const pageTitle = document.getElementById("page-title");
const postsList = document.getElementById("posts-list");

const categoryKey = new URLSearchParams(window.location.search).get("cat");

function renderPosts(posts) {
  posts.forEach(function (item) {
    const li = document.createElement("li");
    li.className = "list-page_item";

    li.innerHTML =
      "<div class='list-page_item_body'>" +
      "<h2 class='list-page_item_title'>" +
      item.title +
      "</h2>" +
      "<p class='list-page_item_text'>" +
      item.excerpt +
      "</p>" +
      "<a href='single-post.html?id=" +
      item.id +
      "' class='list-page_item_btn'>توضیحات بیشتر و ادامه مطلب</a>" +
      "</div>" +
      "<img src='" +
      item.image +
      "' alt='" +
      item.title +
      "' class='list-page_item_img' />";

    postsList.appendChild(li);
  });
}

function loadListPage() {
  if (!categoryKey) {
    pageTitle.textContent = "دسته پیدا نشد";
    postsList.innerHTML =
      "<li class='list-page_item'><p class='list-page_item_text'>پارامتر cat در آدرس وجود ندارد.</p></li>";
    return;
  }

  const category = siteData[categoryKey];

  if (!category) {
    pageTitle.textContent = "دسته پیدا نشد";
    postsList.innerHTML =
      "<li class='list-page_item'><p class='list-page_item_text'>دسته مورد نظر پیدا نشد.</p></li>";
    return;
  }

  document.title = category.title + " | آی آر حسابداران";
  pageTitle.textContent = category.title;
  renderPosts(category.items);
}

loadListPage();
