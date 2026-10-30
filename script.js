// WhatsApp number yahan add karna hai.
// India number example: 919876543210
// + sign ya spaces nahi lagane hain.

const CONFIG = {
  agricultureWhatsApp: "919236203577",
  furnitureWhatsApp: "919265679326"
};

const $ = id => document.getElementById(id);

const KEY = "agrowood_demo_accounts_v1";

$("year").textContent = new Date().getFullYear();

$("txDate").value = new Date().toISOString().slice(0, 10);

// Mobile menu
$("menuToggle").addEventListener("click", () => {
  $("nav").classList.toggle("open");
});

document.querySelectorAll("#nav a").forEach(a => {
  a.addEventListener("click", () => {
    $("nav").classList.remove("open");
  });
});

// Product button se order form fill karna
document.querySelectorAll(".orderProduct").forEach(button => {
  button.addEventListener("click", () => {
    $("orderBusiness").value = button.dataset.business;
    $("orderProduct").value = button.dataset.product;

    $("orders").scrollIntoView({
      behavior: "smooth"
    });
  });
});

// Customer order form
$("orderForm").addEventListener("submit", event => {
  event.preventDefault();

  const business = $("orderBusiness").value;

  const email = business === "Agriculture"
    ? "himanshuverma44363@gmail.com"
    : "indianopq7@gmail.com";

  const number = (
    business === "Agriculture"
      ? CONFIG.agricultureWhatsApp
      : CONFIG.furnitureWhatsApp
  ).replace(/\D/g, "");

  const message = [
    "AgroWood Partners - " + $("orderType").value,
    "Name: " + $("orderName").value,
    "Mobile: " + $("orderPhone").value,
    "Business: " + business,
    "Product: " + $("orderProduct").value,
    "Quantity: " + $("orderQty").value,
    "Details: " + $("orderMessage").value
  ].join("\n");

  if (number) {
    window.open(
      "https://wa.me/" + number +
      "?text=" + encodeURIComponent(message),
      "_blank",
      "noopener"
    );

    $("orderStatus").textContent =
      "WhatsApp message prepared. Review and press Send.";

  } else {
    location.href =
      "mailto:" + email +
      "?subject=" + encodeURIComponent("AgroWood " + business + " enquiry") +
      "&body=" + encodeURIComponent(message);

    $("orderStatus").textContent =
      "WhatsApp number not configured; opened email instead.";
  }
});

// Dashboard data
function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch (error) {
    return [];
  }
}

function save(entries) {
  localStorage.setItem(KEY, JSON.stringify(entries));
}

// HTML safety
function esc(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));
}

// Rupees format
function money(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(amount || 0);
}

// Dashboard display
function render() {
  const filter = $("accountBusiness").value;

  const entries = read().filter(entry =>
    filter === "All" || entry.business === filter
  );

  function total(type) {
    return entries
      .filter(entry => entry.type === type)
      .reduce((sum, entry) => sum + entry.amount, 0);
  }

  const investment = total("investment");
  const income = total("income");
  const expense = total("expense");

  $("totalInvestment").textContent = money(investment);
  $("totalIncome").textContent = money(income);
  $("totalExpense").textContent = money(expense);
  $("totalProfit").textContent = money(income - expense);

  const body = $("transactionRows");

  if (entries.length === 0) {
    body.innerHTML =
      '<tr><td colspan="6">No entries yet.</td></tr>';
    return;
  }

  body.innerHTML = entries
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(entry => `
      <tr>
        <td>${esc(entry.date)}</td>
        <td>${esc(entry.business)}</td>
        <td>${esc(entry.type)}</td>
        <td>${esc(entry.note)}</td>
        <td>${money(entry.amount)}</td>
        <td>
          <button class="delete" data-id="${esc(entry.id)}">
            Delete
          </button>
        </td>
      </tr>
    `).join("");

  body.querySelectorAll(".delete").forEach(button => {
    button.addEventListener("click", () => {
      if (confirm("Delete this entry from this browser?")) {
        save(read().filter(entry =>
          entry.id !== button.dataset.id
        ));

        render();
      }
    });
  });
}

// Add new account entry
$("transactionForm").addEventListener("submit", event => {
  event.preventDefault();

  const amount = Number($("txAmount").value);

  if (!(amount > 0)) {
    alert("Enter an amount greater than zero.");
    return;
  }

  const entries = read();

  entries.push({
    id: Date.now() + "-" + Math.random(),
    business: $("txBusiness").value,
    type: $("txType").value,
    amount: amount,
    date: $("txDate").value,
    note: $("txNote").value.trim()
  });

  save(entries);

  $("transactionForm").reset();

  $("txDate").value = new Date().toISOString().slice(0, 10);

  render();
});

// Account filter
$("accountBusiness").addEventListener("change", render);

// Export CSV
$("exportCsv").addEventListener("click", () => {
  const entries = read().filter(entry =>
    $("accountBusiness").value === "All" ||
    entry.business === $("accountBusiness").value
  );

  const rows = [
    ["Date", "Business", "Type", "Description", "Amount"],
    ...entries.map(entry => [
      entry.date,
      entry.business,
      entry.type,
      entry.note,
      entry.amount
    ])
  ];

  const csv = rows.map(row =>
    row.map(value =>
      '"' + String(value).replace(/"/g, '""') + '"'
    ).join(",")
  ).join("\n");

  const url = URL.createObjectURL(
    new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8"
    })
  );

  const link = document.createElement("a");

  link.href = url;
  link.download = "agrowood-accounts.csv";
  link.click();

  URL.revokeObjectURL(url);
});

// Clear dashboard entries
$("clearAccounts").addEventListener("click", () => {
  if (confirm("Clear every account entry stored in this browser?")) {
    localStorage.removeItem(KEY);
    render();
  }
});

// First dashboard display
render();
const imageViewer = document.getElementById("imageViewer");
const fullImage = document.getElementById("fullImage");
const closeViewer = document.getElementById("closeViewer");

document.querySelectorAll("img").forEach(img => {
  if (img.id !== "fullImage") {
    img.style.cursor = "zoom-in";

    img.addEventListener("click", () => {
      fullImage.src = img.src;
      imageViewer.style.display = "flex";
    });
  }
});

closeViewer.addEventListener("click", () => {
  imageViewer.style.display = "none";
});

imageViewer.addEventListener("click", (e) => {
  if (e.target === imageViewer) {
    imageViewer.style.display = "none";
  }
});
