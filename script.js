let expenses = [
  { id: 1, title: "Lunch Bowl", amount: 145.5, category: "Food" },
  { id: 2, title: "Jeepney Fare", amount: 26, category: "Transport" },
  { id: 3, title: "Notebook", amount: 85, category: "Other" }
];

const expenseForm = document.getElementById("expense-form");
const titleInput = document.getElementById("expense-title");
const amountInput = document.getElementById("expense-amount");
const categoryInput = document.getElementById("expense-category");
const categoryFilter = document.getElementById("category-filter");
const expenseList = document.getElementById("expense-list");
const totalAmountEl = document.getElementById("total-amount");
const errorMessageEl = document.getElementById("error-message");

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Sums the amount of all currently visible expenses
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.amount, 0);
}

// Filters by selected category, renders the list, and updates the total
function renderExpenses() {
  const selectedCategory = categoryFilter.value;

  const filteredExpenses =
    selectedCategory === "All"
      ? expenses
      : expenses.filter((expense) => expense.category === selectedCategory);

  if (filteredExpenses.length === 0) {
    expenseList.innerHTML = `<li class="empty-state">No expenses found for "${escapeHtml(selectedCategory)}".</li>`;
  } else {
    expenseList.innerHTML = filteredExpenses
      .map((expense) => {
        const { id, title, amount, category } = expense;
        return `
          <li class="expense-item">
            <div class="expense-info">
              <span class="expense-title">${escapeHtml(title)}</span>
              <span class="expense-category">${escapeHtml(category)}</span>
            </div>
            <div class="expense-actions">
              <span class="expense-amount">₱${amount.toFixed(2)}</span>
              <button class="btn-delete" type="button" data-id="${id}" aria-label="Delete ${escapeHtml(title)}">&times;</button>
            </div>
          </li>
        `;
      })
      .join("");
  }

  totalAmountEl.textContent = calculateTotal(filteredExpenses).toFixed(2);
}

const showError = (message) => {
  errorMessageEl.textContent = message;
  errorMessageEl.classList.add("visible");
};

const clearError = () => {
  errorMessageEl.textContent = "";
  errorMessageEl.classList.remove("visible");
};

expenseForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const amount = Number(amountInput.value);
  const category = categoryInput.value;

  if (title === "") {
    showError("Please enter an expense title.");
    return;
  }

  if (Number.isNaN(amount) || amount <= 0) {
    showError("Please enter an amount greater than 0.");
    return;
  }

  clearError();

  const newExpense = {
    id: Date.now(),
    title,
    amount,
    category
  };

  expenses = [...expenses, newExpense];

  expenseForm.reset();
  titleInput.focus();
  renderExpenses();
});

categoryFilter.addEventListener("change", () => {
  renderExpenses();
});

expenseList.addEventListener("click", (event) => {
  const deleteBtn = event.target.closest(".btn-delete");
  if (deleteBtn === null) {
    return;
  }

  const targetId = Number(deleteBtn.dataset.id);
  expenses = expenses.filter((expense) => expense.id !== targetId);
  renderExpenses();
});

renderExpenses();
