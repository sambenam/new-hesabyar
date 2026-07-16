const postTitle = document.getElementById("post-title");
const postImage = document.getElementById("post-image");
const postContent = document.getElementById("post-content");
const backLink = document.getElementById("back-link");

const postId = new URLSearchParams(window.location.search).get("id");

function loadSinglePost() {
  if (!postId) {
    postTitle.textContent = "مطلب پیدا نشد";
    postImage.style.display = "none";
    postContent.textContent = "شناسه مطلب در آدرس وجود ندارد.";
    backLink.textContent = "بازگشت به صفحه اصلی";
    backLink.href = "home.html";
    return;
  }

  for (const slug in siteData) {
    const category = siteData[slug];
    const post = category.items.find(function (item) {
      return item.id === postId;
    });

    if (post) {
      document.title = post.title + " | آی آر حسابداران";
      postTitle.textContent = post.title;
      postImage.src = post.image;
      postImage.alt = post.title;
      // the bottom line => if you want change the content with backtick use -- postContent.innerHtml = post.content -- instead of -- postContent.textContent = post.content --
      postContent.textContent = post.content;
      //
      backLink.textContent = "بازگشت به " + category.title;
      backLink.href = "list-page.html?cat=" + slug;
      return;
    }
  }

  postTitle.textContent = "مطلب پیدا نشد";
  postImage.style.display = "none";
  postContent.textContent = "مطلب مورد نظر پیدا نشد.";
  backLink.textContent = "بازگشت به صفحه اصلی";
  backLink.href = "home.html";
}

loadSinglePost();
