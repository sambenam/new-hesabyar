let contentEditorState = {
  itemId: null,
  blocks: [],
  downloads: [],
};

let contentAdminInitialized = false;

function initContentAdmin() {
  if (contentAdminInitialized) {
    return;
  }

  contentAdminInitialized = true;
  const searchInput = document.getElementById("contentTableSearch");
  const form = document.getElementById("editContentForm");

  if (searchInput) {
    searchInput.addEventListener("input", function (event) {
      filterContentTable(event.target.value);
    });
  }

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      saveEditedContent();
    });
  }

  const resetButton = document.getElementById("resetContentBtn");
  if (resetButton) {
    resetButton.addEventListener("click", resetEditedContent);
  }

  document.querySelectorAll("[data-add-block]").forEach(function (button) {
    button.addEventListener("click", function () {
      addContentBlock(button.getAttribute("data-add-block"));
    });
  });

  const addDownloadBtn = document.getElementById("addDownloadBtn");
  if (addDownloadBtn) {
    addDownloadBtn.addEventListener("click", addDownloadRow);
  }

  const videoEnabled = document.getElementById("contentVideoEnabled");
  if (videoEnabled) {
    videoEnabled.addEventListener("change", toggleVideoFields);
  }

  renderContentTable();
}

function renderContentTable() {
  const tbody = document.getElementById("siteContentTableBody");
  if (!tbody) {
    return;
  }

  if (typeof getAllSiteItems !== "function") {
    tbody.innerHTML =
      '<tr><td colspan="5">اطلاعات محتوا بارگذاری نشده است. صفحه را دوباره بارگذاری کنید.</td></tr>';
    return;
  }

  const items = getAllSiteItems();

  if (!items.length) {
    tbody.innerHTML =
      '<tr><td colspan="5">هنوز آیتمی برای ویرایش پیدا نشد.</td></tr>';
    return;
  }

  tbody.innerHTML = items
    .map(function (row) {
      const statusBadge = row.hasOverride
        ? '<span class="status success">ذخیره ادمین</span>'
        : row.hasBlocks
          ? '<span class="status pending">بلوک‌بندی</span>'
          : '<span class="status cancelled">پیش‌فرض</span>';

      return (
        "<tr>" +
        "<td><code>" +
        row.id +
        "</code></td>" +
        "<td>" +
        row.title +
        "</td>" +
        "<td>" +
        row.categoryTitle +
        "</td>" +
        "<td>" +
        statusBadge +
        "</td>" +
        "<td>" +
        '<button type="button" class="btn-secondary content-edit-btn" data-item-id="' +
        row.id +
        '">ویرایش محتوا</button>' +
        "</td>" +
        "</tr>"
      );
    })
    .join("");

  tbody.querySelectorAll(".content-edit-btn").forEach(function (button) {
    button.addEventListener("click", function () {
      openContentEditor(button.getAttribute("data-item-id"));
    });
  });
}

function filterContentTable(query) {
  const normalized = query.trim().toLowerCase();

  document.querySelectorAll("#siteContentTableBody tr").forEach(function (row) {
    row.style.display = row.textContent.toLowerCase().includes(normalized)
      ? ""
      : "none";
  });
}

function openContentEditor(itemId) {
  const found = findSiteItem(itemId);
  if (!found) {
    showToast("آیتم پیدا نشد", "error");
    return;
  }

  const item = found.item;
  contentEditorState.itemId = itemId;
  contentEditorState.blocks = getContentBlocks(item);
  contentEditorState.downloads = getEditableDownloads(item);

  document.getElementById("editContentItemId").value = itemId;
  document.getElementById("editContentTitle").textContent = item.title;
  document.getElementById("editContentCategory").textContent =
    found.categoryTitle;
  document.getElementById("editContentExcerpt").value = item.excerpt || "";

  const content =
    item.content && typeof item.content === "object" ? item.content : {};
  const video = content.video || {};
  const videoEnabled = Boolean(video.enabled && video.url);

  document.getElementById("contentVideoEnabled").checked = videoEnabled;
  document.getElementById("contentVideoUrl").value = video.url || "";
  document.getElementById("contentVideoProvider").value =
    video.provider || "youtube";
  document.getElementById("contentVideoTitle").value = video.title || "";

  renderBlocksEditor();
  renderDownloadsEditor();
  toggleVideoFields();

  openModal("editContentModal");
}

function getEditableDownloads(item) {
  const content =
    item.content && typeof item.content === "object" ? item.content : {};
  const downloads = content.downloads || item.downloads || [];

  if (!Array.isArray(downloads)) {
    return [];
  }

  return downloads.map(function (file, index) {
    return {
      id: file.id || "download-" + (index + 1),
      title: file.title || "",
      url: file.url || "",
      type: file.type || "file",
      size: file.size || "",
    };
  });
}

function renderBlocksEditor() {
  const container = document.getElementById("contentBlocksEditor");
  if (!container) {
    return;
  }

  if (!contentEditorState.blocks.length) {
    container.innerHTML =
      '<p class="content-editor_empty">هنوز بلوکی اضافه نشده. از دکمه‌های بالا استفاده کنید.</p>';
    return;
  }

  container.innerHTML = contentEditorState.blocks
    .map(function (block, index) {
      return buildBlockEditorHtml(block, index);
    })
    .join("");

  bindBlockEditorEvents(container);
}

function buildBlockEditorHtml(block, index) {
  const labels = {
    heading: "عنوان",
    paragraph: "پاراگراف",
    list: "لیست",
    "ordered-list": "لیست شماره‌دار",
    quote: "نقل‌قول",
    link: "لینک",
    image: "تصویر",
    divider: "جداکننده",
    html: "HTML سفارشی",
  };

  let fields = "";

  if (block.type === "heading") {
    fields =
      '<label>متن عنوان</label>' +
      '<input type="text" class="form-control block-text" data-index="' +
      index +
      '" value="' +
      escapeAttr(block.text || "") +
      '">' +
      '<label style="margin-top:8px">سطح</label>' +
      '<select class="form-control block-level" data-index="' +
      index +
      '">' +
      [1, 2, 3, 4, 5, 6]
        .map(function (level) {
          return (
            '<option value="' +
            level +
            '"' +
            (block.level === level ? " selected" : "") +
            ">H" +
            level +
            "</option>"
          );
        })
        .join("") +
      "</select>";
  } else if (block.type === "paragraph") {
    fields =
      '<label>متن پاراگراف</label>' +
      '<textarea class="form-control block-text" rows="3" data-index="' +
      index +
      '">' +
      escapeHtml(block.text || "") +
      "</textarea>";
  } else if (block.type === "list" || block.type === "ordered-list") {
    const listValue = (block.items || []).join("\n");
    fields =
      '<label>آیتم‌ها (هر خط یک مورد)</label>' +
      '<textarea class="form-control block-items" rows="4" data-index="' +
      index +
      '">' +
      escapeHtml(listValue) +
      "</textarea>";
  } else if (block.type === "quote") {
    fields =
      '<label>متن نقل‌قول</label>' +
      '<textarea class="form-control block-text" rows="3" data-index="' +
      index +
      '">' +
      escapeHtml(block.text || "") +
      "</textarea>" +
      '<label style="margin-top:8px">منبع یا گوینده (اختیاری)</label>' +
      '<input type="text" class="form-control block-cite" data-index="' +
      index +
      '" value="' +
      escapeAttr(block.cite || "") +
      '">';
  } else if (block.type === "link") {
    fields =
      '<label>متن لینک</label>' +
      '<input type="text" class="form-control block-text" data-index="' +
      index +
      '" value="' +
      escapeAttr(block.text || "") +
      '">' +
      '<label style="margin-top:8px">آدرس لینک</label>' +
      '<input type="text" class="form-control block-url" data-index="' +
      index +
      '" value="' +
      escapeAttr(block.url || "") +
      '">' +
      '<label style="margin-top:8px">نحوه باز شدن</label>' +
      '<select class="form-control block-target" data-index="' +
      index +
      '">' +
      '<option value="_blank"' +
      (block.target !== "_self" ? " selected" : "") +
      ">تب جدید</option>" +
      '<option value="_self"' +
      (block.target === "_self" ? " selected" : "") +
      ">همین صفحه</option>" +
      "</select>";
  } else if (block.type === "image") {
    fields =
      '<label>آدرس تصویر</label>' +
      '<input type="text" class="form-control block-src" data-index="' +
      index +
      '" value="' +
      escapeAttr(block.src || "") +
      '">' +
      '<label style="margin-top:8px">متن جایگزین</label>' +
      '<input type="text" class="form-control block-alt" data-index="' +
      index +
      '" value="' +
      escapeAttr(block.alt || "") +
      '">' +
      '<label style="margin-top:8px">توضیح زیر تصویر (اختیاری)</label>' +
      '<input type="text" class="form-control block-caption" data-index="' +
      index +
      '" value="' +
      escapeAttr(block.caption || "") +
      '">';
  } else if (block.type === "html") {
    fields =
      '<label>کد HTML این بخش</label>' +
      '<textarea class="form-control block-html" rows="7" data-index="' +
      index +
      '" dir="ltr">' +
      escapeHtml(block.html || "") +
      "</textarea>";
  } else if (block.type === "divider") {
    fields = '<p class="content-editor_empty">یک خط جداکننده در متن نمایش داده می‌شود.</p>';
  }

  return (
    '<div class="content-block-card" data-block-index="' +
    index +
    '">' +
    '<div class="content-block-card_header">' +
    "<strong>" +
    (labels[block.type] || block.type) +
    "</strong>" +
    '<div class="content-block-card_actions">' +
    '<button type="button" class="btn-secondary block-move-up" data-index="' +
    index +
    '" title="بالا">↑</button>' +
    '<button type="button" class="btn-secondary block-move-down" data-index="' +
    index +
    '" title="پایین">↓</button>' +
    '<button type="button" class="btn-secondary block-delete" data-index="' +
    index +
    '" style="color:var(--danger)">حذف</button>' +
    "</div></div>" +
    fields +
    "</div>"
  );
}

function bindBlockEditorEvents(container) {
  container.querySelectorAll(".block-text").forEach(function (input) {
    input.addEventListener("input", function () {
      const index = Number(input.getAttribute("data-index"));
      contentEditorState.blocks[index].text = input.value;
    });
  });

  container.querySelectorAll(".block-level").forEach(function (select) {
    select.addEventListener("change", function () {
      const index = Number(select.getAttribute("data-index"));
      contentEditorState.blocks[index].level = Number(select.value);
    });
  });

  container.querySelectorAll(".block-items").forEach(function (textarea) {
    textarea.addEventListener("input", function () {
      const index = Number(textarea.getAttribute("data-index"));
      contentEditorState.blocks[index].items = textarea.value
        .split("\n")
        .map(function (line) {
          return line.trim();
        })
        .filter(Boolean);
    });
  });

  container.querySelectorAll(".block-cite").forEach(function (input) {
    input.addEventListener("input", function () {
      const index = Number(input.getAttribute("data-index"));
      contentEditorState.blocks[index].cite = input.value;
    });
  });

  container.querySelectorAll(".block-url").forEach(function (input) {
    input.addEventListener("input", function () {
      const index = Number(input.getAttribute("data-index"));
      contentEditorState.blocks[index].url = input.value;
    });
  });

  container.querySelectorAll(".block-target").forEach(function (select) {
    select.addEventListener("change", function () {
      const index = Number(select.getAttribute("data-index"));
      contentEditorState.blocks[index].target = select.value;
    });
  });

  container.querySelectorAll(".block-src").forEach(function (input) {
    input.addEventListener("input", function () {
      const index = Number(input.getAttribute("data-index"));
      contentEditorState.blocks[index].src = input.value;
    });
  });

  container.querySelectorAll(".block-alt").forEach(function (input) {
    input.addEventListener("input", function () {
      const index = Number(input.getAttribute("data-index"));
      contentEditorState.blocks[index].alt = input.value;
    });
  });

  container.querySelectorAll(".block-caption").forEach(function (input) {
    input.addEventListener("input", function () {
      const index = Number(input.getAttribute("data-index"));
      contentEditorState.blocks[index].caption = input.value;
    });
  });

  container.querySelectorAll(".block-html").forEach(function (textarea) {
    textarea.addEventListener("input", function () {
      const index = Number(textarea.getAttribute("data-index"));
      contentEditorState.blocks[index].html = textarea.value;
    });
  });

  container.querySelectorAll(".block-delete").forEach(function (button) {
    button.addEventListener("click", function () {
      const index = Number(button.getAttribute("data-index"));
      contentEditorState.blocks.splice(index, 1);
      renderBlocksEditor();
    });
  });

  container.querySelectorAll(".block-move-up").forEach(function (button) {
    button.addEventListener("click", function () {
      moveBlock(Number(button.getAttribute("data-index")), -1);
    });
  });

  container.querySelectorAll(".block-move-down").forEach(function (button) {
    button.addEventListener("click", function () {
      moveBlock(Number(button.getAttribute("data-index")), 1);
    });
  });
}

function moveBlock(index, direction) {
  const target = index + direction;
  if (target < 0 || target >= contentEditorState.blocks.length) {
    return;
  }

  const blocks = contentEditorState.blocks;
  const temp = blocks[index];
  blocks[index] = blocks[target];
  blocks[target] = temp;
  renderBlocksEditor();
}

function addContentBlock(type) {
  if (type === "heading") {
    contentEditorState.blocks.push({ type: "heading", level: 2, text: "" });
  } else if (type === "paragraph") {
    contentEditorState.blocks.push({ type: "paragraph", text: "" });
  } else if (type === "list" || type === "ordered-list") {
    contentEditorState.blocks.push({ type: type, items: [""] });
  } else if (type === "quote") {
    contentEditorState.blocks.push({ type: "quote", text: "", cite: "" });
  } else if (type === "link") {
    contentEditorState.blocks.push({
      type: "link",
      text: "",
      url: "",
      target: "_blank",
    });
  } else if (type === "image") {
    contentEditorState.blocks.push({
      type: "image",
      src: "",
      alt: "",
      caption: "",
    });
  } else if (type === "divider") {
    contentEditorState.blocks.push({ type: "divider" });
  } else if (type === "html") {
    contentEditorState.blocks.push({ type: "html", html: "" });
  }

  renderBlocksEditor();
}

function renderDownloadsEditor() {
  const container = document.getElementById("contentDownloadsEditor");
  if (!container) {
    return;
  }

  if (!contentEditorState.downloads.length) {
    container.innerHTML =
      '<p class="content-editor_empty">فایل دانلودی ثبت نشده.</p>';
    return;
  }

  container.innerHTML = contentEditorState.downloads
    .map(function (file, index) {
      return (
        '<div class="content-download-row" data-download-index="' +
        index +
        '">' +
        '<input type="text" class="form-control download-title" placeholder="عنوان فایل" value="' +
        escapeAttr(file.title) +
        '">' +
        '<input type="text" class="form-control download-url" placeholder="آدرس فایل" value="' +
        escapeAttr(file.url) +
        '">' +
        '<select class="form-control download-type">' +
        buildDownloadTypeOptions(file.type) +
        "</select>" +
        '<input type="text" class="form-control download-size" placeholder="حجم (اختیاری)" value="' +
        escapeAttr(file.size) +
        '">' +
        '<button type="button" class="btn-secondary download-delete" data-index="' +
        index +
        '">حذف</button>' +
        "</div>"
      );
    })
    .join("");

  container.querySelectorAll(".download-delete").forEach(function (button) {
    button.addEventListener("click", function () {
      contentEditorState.downloads.splice(Number(button.getAttribute("data-index")), 1);
      renderDownloadsEditor();
    });
  });
}

function buildDownloadTypeOptions(selected) {
  const types = ["file", "pdf", "xlsx", "xls", "doc", "docx", "zip"];
  return types
    .map(function (type) {
      return (
        '<option value="' +
        type +
        '"' +
        (selected === type ? " selected" : "") +
        ">" +
        type +
        "</option>"
      );
    })
    .join("");
}

function addDownloadRow() {
  contentEditorState.downloads.push({
    id: "download-" + Date.now(),
    title: "",
    url: "",
    type: "file",
    size: "",
  });
  renderDownloadsEditor();
}

function toggleVideoFields() {
  const enabled = document.getElementById("contentVideoEnabled").checked;
  const fields = document.getElementById("contentVideoFields");
  if (fields) {
    fields.hidden = !enabled;
  }
}

function collectDownloadsFromForm() {
  const rows = document.querySelectorAll(".content-download-row");
  const downloads = [];

  rows.forEach(function (row, index) {
    const title = row.querySelector(".download-title").value.trim();
    const url = row.querySelector(".download-url").value.trim();
    const type = row.querySelector(".download-type").value;
    const size = row.querySelector(".download-size").value.trim();

    if (!title || !url) {
      return;
    }

    downloads.push({
      id: contentEditorState.downloads[index]?.id || "download-" + (index + 1),
      title: title,
      url: url,
      type: type,
      size: size,
    });
  });

  return downloads;
}

function saveEditedContent() {
  if (!contentEditorState.itemId) {
    return;
  }

  const blocks = contentEditorState.blocks
    .map(function (block) {
      return typeof normalizeBlock === "function" ? normalizeBlock(block) : block;
    })
    .filter(function (block) {
      if (!block) {
        return false;
      }
      if (block.type === "heading" || block.type === "paragraph" || block.type === "quote") {
        return Boolean(block.text);
      }
      if (block.type === "list" || block.type === "ordered-list") {
        return block.items.length > 0;
      }
      if (block.type === "link") {
        return Boolean(block.text && block.url);
      }
      if (block.type === "image") {
        return Boolean(block.src);
      }
      if (block.type === "html") {
        return Boolean(block.html.trim());
      }
      return block.type === "divider";
    });

  const content = { blocks: blocks };
  const excerpt = document.getElementById("editContentExcerpt").value.trim();
  const videoEnabled = document.getElementById("contentVideoEnabled").checked;
  const videoUrl = document.getElementById("contentVideoUrl").value.trim();

  if (videoEnabled && videoUrl) {
    content.video = {
      enabled: true,
      url: videoUrl,
      provider: document.getElementById("contentVideoProvider").value,
      title: document.getElementById("contentVideoTitle").value.trim(),
    };
  }

  const downloads = collectDownloadsFromForm();
  if (downloads.length) {
    content.downloads = downloads;
  }

  saveContentOverride(contentEditorState.itemId, {
    content: content,
    excerpt: excerpt,
  });
  if (typeof appApi !== "undefined" && appApi.content) {
    appApi.content
      .update(contentEditorState.itemId, { content: content, excerpt: excerpt })
      .catch(function (error) {
        console.warn("admin-content: همگام‌سازی API انجام نشد", error);
      });
  }

  const found = findSiteItem(contentEditorState.itemId);
  if (found) {
    found.item.content = content;
    found.item.excerpt = excerpt;
  }

  closeModal("editContentModal");
  renderContentTable();
  showToast("محتوای «" + contentEditorState.itemId + "» ذخیره شد", "success");
}

function resetEditedContent() {
  if (!contentEditorState.itemId || typeof removeContentOverride !== "function") {
    return;
  }

  if (!confirm("محتوای ذخیره‌شده حذف و نسخه پیش‌فرض نمایش داده شود؟")) {
    return;
  }

  removeContentOverride(contentEditorState.itemId);
  if (typeof appApi !== "undefined" && appApi.content) {
    appApi.content.remove(contentEditorState.itemId).catch(function (error) {
      console.warn("admin-content: حذف از API انجام نشد", error);
    });
  }
  window.location.reload();
}

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function bootContentAdmin() {
  if (document.getElementById("view-site-content")) {
    initContentAdmin();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootContentAdmin);
} else {
  bootContentAdmin();
}
