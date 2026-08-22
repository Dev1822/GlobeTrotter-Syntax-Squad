import React, { useState, useEffect } from "react";
import { expensesApi } from "../../../services/api/expensesApi";
import { tripsApi } from "../../../services/api/tripsApi";
import { getErrorMessage } from "../../../services/api/client";
import Button from "../../../components/Button";
import FormField from "../../../components/FormField";
import Modal from "../../../components/Modal";
import Badge from "../../../components/Badge";
import LoadingState from "../../../components/LoadingState";
import EmptyState from "../../../components/EmptyState";
import {
  DollarSign,
  Plus,
  Trash2,
  Edit2,
  PieChart,
  Calendar,
  AlertCircle,
  TrendingUp,
  Sliders,
  CheckCircle,
  Pencil,
} from "lucide-react";

export const TripBudgetTab = ({ trip, onTripUpdated }) => {
  const tripId = trip?.id || trip?._id;
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // Budget Edit state
  const [targetBudgetInput, setTargetBudgetInput] = useState("");
  const [budgetLoading, setBudgetLoading] = useState(false);
  const [budgetError, setBudgetError] = useState("");

  const [formData, setFormData] = useState({
    amount: "",
    currency: "INR",
    category: "Food",
    description: "",
    date: trip?.startDate
      ? trip.startDate.split("T")[0]
      : new Date().toISOString().split("T")[0],
  });

  const categories = [
    "Accommodation",
    "Transportation",
    "Food",
    "Activities",
    "Shopping",
    "Other",
  ];

  const fetchExpensesData = async () => {
    if (!tripId) return;
    setLoading(true);
    setError(null);
    try {
      const [expRes, sumRes] = await Promise.all([
        expensesApi.getByTrip(tripId),
        expensesApi.getSummary(tripId),
      ]);
      setExpenses(expRes.data?.data || expRes.data || []);
      setSummary(sumRes.data || []);
    } catch (err) {
      console.error("Failed to load expenses:", err);
      setError("Unable to load budget records for this journey.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tripId) fetchExpensesData();
  }, [tripId]);

  // Open Add Modal
  const openAddModal = () => {
    setFormData({
      amount: "",
      currency: "INR",
      category: "Food",
      description: "",
      date: trip?.startDate
        ? trip.startDate.split("T")[0]
        : new Date().toISOString().split("T")[0],
    });
    setFormError("");
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (exp) => {
    setEditingExpenseId(exp.id || exp._id);
    setFormData({
      amount: exp.amount || "",
      currency: exp.currency || "INR",
      category: exp.category || "Food",
      description: exp.description || "",
      date: exp.date
        ? exp.date.split("T")[0]
        : new Date().toISOString().split("T")[0],
    });
    setFormError("");
    setIsEditModalOpen(true);
  };

  // Open Budget Edit Modal
  const openBudgetModal = () => {
    setTargetBudgetInput(trip?.budget ? String(trip.budget) : "");
    setBudgetError("");
    setIsBudgetModalOpen(true);
  };

  // Handle Target Budget Update
  const handleSaveTargetBudget = async (e) => {
    e.preventDefault();
    setBudgetError("");
    const parsedBudget = parseFloat(targetBudgetInput);
    if (isNaN(parsedBudget) || parsedBudget < 0) {
      setBudgetError("Target budget must be a non-negative number.");
      return;
    }

    setBudgetLoading(true);
    try {
      const res = await tripsApi.update(tripId, { budget: parsedBudget });
      if (onTripUpdated) {
        onTripUpdated(res.data);
      }
      setIsBudgetModalOpen(false);
    } catch (err) {
      setBudgetError(getErrorMessage(err, "Failed to update target budget."));
    } finally {
      setBudgetLoading(false);
    }
  };

  // Handle Add Expense
  const handleAddExpense = async (e) => {
    e.preventDefault();
    setFormError("");

    const parsedAmount = parseFloat(formData.amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setFormError("Amount must be a positive number.");
      return;
    }

    setFormLoading(true);
    try {
      await expensesApi.create({
        trip: tripId,
        amount: parsedAmount,
        currency: formData.currency,
        category: formData.category,
        description: formData.description.trim(),
        date: formData.date,
      });
      setIsAddModalOpen(false);
      await fetchExpensesData();
    } catch (err) {
      setFormError(getErrorMessage(err, "Failed to record expense."));
    } finally {
      setFormLoading(false);
    }
  };

  // Handle Edit Expense
  const handleEditExpense = async (e) => {
    e.preventDefault();
    setFormError("");

    const parsedAmount = parseFloat(formData.amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setFormError("Amount must be a positive number.");
      return;
    }

    setFormLoading(true);
    try {
      await expensesApi.update(editingExpenseId, {
        amount: parsedAmount,
        currency: formData.currency,
        category: formData.category,
        description: formData.description.trim(),
        date: formData.date,
      });
      setIsEditModalOpen(false);
      setEditingExpenseId(null);
      await fetchExpensesData();
    } catch (err) {
      setFormError(getErrorMessage(err, "Failed to update expense."));
    } finally {
      setFormLoading(false);
    }
  };

  // Handle Delete Expense
  const handleDeleteExpense = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense record?")) {
      return;
    }
    try {
      await expensesApi.delete(id);
      await fetchExpensesData();
    } catch (err) {
      console.error("Failed to delete expense:", err);
    }
  };

  // Calculate totals
  const totalSpent = expenses.reduce(
    (sum, item) => sum + (Number(item.amount) || 0),
    0,
  );
  const plannedBudget = Number(trip?.budget) || 0;
  const budgetRemaining = plannedBudget - totalSpent;
  const percentUsed =
    plannedBudget > 0
      ? Math.min(100, Math.round((totalSpent / plannedBudget) * 100))
      : 0;

  // Filtered expenses
  const filteredExpenses = expenses.filter((exp) => {
    if (selectedCategory === "all") return true;
    return exp.category === selectedCategory;
  });

  return (
    <div className="space-y-10">
      {/* ── 1. BUDGET METRICS CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Planned Target Budget */}
        <div className="bg-[#FFFFFF] p-6 border border-[#E5E2E1] rounded shadow-xs relative flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-[#899596]">
                Target Budget
              </span>
              <button
                type="button"
                onClick={openBudgetModal}
                className="text-[#163A3D] hover:text-[#E8895B] p-1 transition-colors flex items-center gap-1 text-xs font-semibold"
                title="Edit Target Budget"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>

            <p className="font-serif text-3xl font-bold text-[#202525] mt-2">
              ₹{plannedBudget.toLocaleString("en-IN")}
            </p>
          </div>
          <p className="text-[11px] text-[#54433A] mt-3 pt-2 border-t border-[#EDE7DF]">
            {plannedBudget > 0
              ? "Allocated target for trip"
              : "Click Edit to set target budget"}
          </p>
        </div>

        {/* Total Expended */}
        <div className="bg-[#FFFFFF] p-6 border border-[#E5E2E1] rounded shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase text-[#163A3D]">
              Total Expended
            </span>
            <p className="font-serif text-3xl font-bold text-[#163A3D] mt-2">
              ₹{totalSpent.toLocaleString("en-IN")}
            </p>

            <div className="w-full bg-[#EDE7DF] h-2 rounded-full mt-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  percentUsed > 100
                    ? "bg-[#BA1A1A]"
                    : percentUsed > 80
                    ? "bg-[#E8895B]"
                    : "bg-[#163A3D]"
                }`}
                style={{ width: `${Math.min(100, percentUsed)}%` }}
              />
            </div>
          </div>
          <p className="text-[11px] text-[#54433A] mt-3 pt-2 border-t border-[#EDE7DF]">
            {plannedBudget > 0
              ? `${percentUsed}% of budget utilized`
              : `${expenses.length} itemized expense entries`}
          </p>
        </div>

        {/* Remaining Balance */}
        <div className="bg-[#FFFFFF] p-6 border border-[#E5E2E1] rounded shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase text-[#899596]">
              Remaining Balance
            </span>
            <p
              className={`font-serif text-3xl font-bold mt-2 ${
                budgetRemaining < 0 ? "text-[#BA1A1A]" : "text-[#2E4632]"
              }`}
            >
              ₹{budgetRemaining.toLocaleString("en-IN")}
            </p>
          </div>
          <p className="text-[11px] text-[#54433A] mt-3 pt-2 border-t border-[#EDE7DF]">
            {plannedBudget === 0
              ? "Set target budget above"
              : budgetRemaining < 0
              ? `Exceeded budget limit by ₹${Math.abs(budgetRemaining).toLocaleString("en-IN")}`
              : "Within safety budget buffer"}
          </p>
        </div>
      </div>

      {/* ── 2. CATEGORY BREAKDOWN ── */}
      {summary.length > 0 && (
        <div className="bg-[#FFFFFF] p-6 sm:p-8 border border-[#E5E2E1] rounded shadow-xs space-y-6">
          <h4 className="font-serif text-xl font-bold text-[#202525] flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-[#163A3D]" />
            Expense Distribution by Category
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {summary.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedCategory(item.category)}
                className={`p-3.5 rounded border flex flex-col justify-between cursor-pointer transition-all ${
                  selectedCategory === item.category
                    ? "bg-[#202525] text-white border-[#202525] shadow-md"
                    : "bg-[#F6F3F2] text-[#202525] border-[#E5E2E1] hover:border-[#163A3D]"
                }`}
              >
                <span
                  className={`text-[11px] font-semibold uppercase tracking-wider truncate ${
                    selectedCategory === item.category
                      ? "text-[#FFDBC9]"
                      : "text-[#899596]"
                  }`}
                >
                  {item.category}
                </span>
                <span className="font-serif text-lg font-bold mt-1">
                  ₹{(item.totalAmount || 0).toLocaleString("en-IN")}
                </span>
                <span
                  className={`text-[10px] mt-0.5 ${
                    selectedCategory === item.category
                      ? "text-white/70"
                      : "text-[#54433A]"
                  }`}
                >
                  {item.count} entry{item.count === 1 ? "" : "ies"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 3. LOGGED EXPENSES SECTION ── */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E2E1]">
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#202525]">
              Expense Log ({expenses.length})
            </h3>
            <p className="text-xs text-[#54433A]">
              Itemized expenditures logged for this journey.
            </p>
          </div>

          <Button
            variant="terracotta"
            size="sm"
            onClick={openAddModal}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Record Expense
          </Button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-2">
          {["all", ...categories].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#202525] text-white"
                  : "bg-[#FFFFFF] text-[#54433A] border border-[#CBD5D6] hover:border-[#202525]"
              }`}
            >
              {cat === "all" ? "All Categories" : cat}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingState message="Auditing journey expenses..." />
        ) : filteredExpenses.length > 0 ? (
          <div className="bg-[#FFFFFF] border border-[#E5E2E1] rounded overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-[#F6F3F2] border-b border-[#E5E2E1] text-[#899596] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3.5 px-6">Date</th>
                    <th className="py-3.5 px-6">Category</th>
                    <th className="py-3.5 px-6">Description</th>
                    <th className="py-3.5 px-6 text-right">Amount</th>
                    <th className="py-3.5 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDE7DF]">
                  {filteredExpenses.map((exp) => (
                    <tr
                      key={exp.id || exp._id}
                      className="hover:bg-[#F7F4EE] transition-colors"
                    >
                      <td className="py-4 px-6 font-medium text-[#202525] whitespace-nowrap">
                        {exp.date
                          ? new Date(exp.date).toLocaleDateString("en-IN", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "—"}
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant="terracotta" size="xs">
                          {exp.category}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-[#54433A] max-w-xs truncate">
                        {exp.description || "—"}
                      </td>
                      <td className="py-4 px-6 text-right font-serif font-bold text-[#202525] whitespace-nowrap text-sm">
                        {exp.currency || "INR"}{" "}
                        {Number(exp.amount).toLocaleString("en-IN")}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(exp)}
                            className="text-[#899596] hover:text-[#163A3D] transition-colors p-1"
                            title="Edit entry"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteExpense(exp.id || exp._id)}
                            className="text-[#899596] hover:text-[#BA1A1A] transition-colors p-1"
                            title="Delete entry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <EmptyState
            icon={DollarSign}
            title="No Expenses Logged"
            description="Keep control of your travel budget by recording hotel stays, meals, souvenirs, and transit tickets."
            actionLabel="Record First Expense"
            onAction={openAddModal}
          />
        )}
      </div>

      {/* ── EDIT TARGET BUDGET MODAL ── */}
      {isBudgetModalOpen && (
        <Modal
          isOpen={isBudgetModalOpen}
          onClose={() => setIsBudgetModalOpen(false)}
          title="Update Target Budget"
          subtitle={`Set target budget limit for expedition to ${trip?.destination || trip?.name}`}
        >
          {budgetError && (
            <div className="mb-4 p-3 bg-[#FFDAD6]/50 text-xs text-[#BA1A1A] rounded">
              {budgetError}
            </div>
          )}

          <form onSubmit={handleSaveTargetBudget} className="space-y-5">
            <FormField
              label="Target Budget (INR ₹)"
              name="targetBudget"
              type="number"
              min="0"
              step="100"
              value={targetBudgetInput}
              onChange={(e) => setTargetBudgetInput(e.target.value)}
              placeholder="e.g. 50000"
              required
            />

            <div className="pt-4 border-t border-[#E5E2E1] flex justify-end space-x-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => setIsBudgetModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="terracotta"
                size="md"
                loading={budgetLoading}
              >
                Save Target Budget
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── RECORD / EDIT EXPENSE MODAL ── */}
      {(isAddModalOpen || isEditModalOpen) && (
        <Modal
          isOpen={isAddModalOpen || isEditModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setIsEditModalOpen(false);
          }}
          title={isEditModalOpen ? "Edit Expense Entry" : "Record Journey Expense"}
          subtitle={`Itemized expenditure for ${trip?.destination || trip?.name}`}
        >
          {formError && (
            <div className="mb-4 p-3 bg-[#FFDAD6]/50 text-xs text-[#BA1A1A] rounded">
              {formError}
            </div>
          )}

          <form
            onSubmit={isEditModalOpen ? handleEditExpense : handleAddExpense}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Amount"
                name="amount"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                placeholder="e.g. 1500"
                required
              />

              <div className="flex flex-col">
                <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#54433A] mb-1.5">
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) =>
                    setFormData({ ...formData, currency: e.target.value })
                  }
                  className="py-2.5 px-2 bg-transparent border-b border-[#CBD5D6] text-xs font-semibold uppercase text-[#202525] focus:outline-none focus:border-[#163A3D]"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#54433A] mb-1.5">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="py-2.5 px-2 bg-transparent border-b border-[#CBD5D6] text-xs font-semibold text-[#202525] focus:outline-none focus:border-[#163A3D]"
                  required
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <FormField
                label="Date of Expense"
                name="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </div>

            <FormField
              label="Description / Purpose"
              name="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="e.g. Dinner at hotel, taxi to airport, heritage palace ticket"
            />

            <div className="pt-4 border-t border-[#E5E2E1] flex justify-end space-x-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="terracotta"
                size="md"
                loading={formLoading}
              >
                {isEditModalOpen ? "Update Expense" : "Save Expense"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default TripBudgetTab;
