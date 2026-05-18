import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import api from "../api/axios";

import { Lead } from "../types/lead.types";

import {
  useAuthStore,
} from "../store/authStore";

import toast from "react-hot-toast";

function DashboardPage() {
  const [leads, setLeads] =
    useState<Lead[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [
    debouncedSearch,
    setDebouncedSearch,
  ] = useState("");

  const [status, setStatus] =
    useState("");

  const [source, setSource] =
    useState("");

  const [sort, setSort] =
    useState("latest");

  const [page, setPage] =
    useState(1);

  const [
    totalPages,
    setTotalPages,
  ] = useState(1);

  const [showModal,
    setShowModal] =
    useState(false);

  const [editingLead,
    setEditingLead] =
    useState<Lead | null>(
      null
    );

  const [leadForm,
    setLeadForm] =
    useState({
      name: "",
      email: "",
      status: "New",
      source: "Website",
    });

  const navigate =
    useNavigate();

  const { logout, user } =
    useAuthStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(
        search
      );
    }, 500);

    return () =>
      clearTimeout(timer);
  }, [search]);

  const fetchLeads =
    async () => {
      try {
        setLoading(true);

        const response =
          await api.get(
            `/leads?page=${page}&search=${debouncedSearch}&status=${status}&source=${source}&sort=${sort}`
          );

        setLeads(
          response.data.leads
        );

        setTotalPages(
          response.data.totalPages
        );
      } catch (error: any) {
        toast.error(
          error.response?.data
            ?.message ||
            "Failed to fetch leads"
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchLeads();
  }, [
    page,
    debouncedSearch,
    status,
    source,
    sort,
  ]);

  const handleExportCSV =
    async () => {
      try {
        const response =
          await api.get(
            "/leads/export/csv",
            {
              responseType:
                "blob",
            }
          );

        const url =
          window.URL.createObjectURL(
            new Blob([
              response.data,
            ])
          );

        const link =
          document.createElement(
            "a"
          );

        link.href = url;

        link.setAttribute(
          "download",
          "leads.csv"
        );

        document.body.appendChild(
          link
        );

        link.click();

        link.remove();
      } catch (error) {
        toast.error(
          "Failed to export CSV"
        );
      }
    };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement
    >
  ) => {
    setLeadForm({
      ...leadForm,
      [e.target.name]:
        e.target.value,
    });
  };

  const resetForm = () => {
    setLeadForm({
      name: "",
      email: "",
      status: "New",
      source: "Website",
    });

    setEditingLead(null);
  };

  const handleSubmitLead =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      try {
        if (editingLead) {
          await api.put(
            `/leads/${editingLead._id}`,
            leadForm
          );

          toast.success(
            "Lead updated"
          );
        } else {
          await api.post(
            "/leads",
            leadForm
          );

          toast.success(
            "Lead created"
          );
        }

        fetchLeads();

        setShowModal(false);

        resetForm();
      } catch (
        error: any
      ) {
        toast.error(
          error.response?.data
            ?.message ||
            "Operation failed"
        );
      }
    };

  const handleEdit = (
    lead: Lead
  ) => {
    setEditingLead(lead);

    setLeadForm({
      name: lead.name,
      email: lead.email,
      status: lead.status,
      source: lead.source,
    });

    setShowModal(true);
  };

  const handleDelete =
    async (id: string) => {
      try {
        await api.delete(
          `/leads/${id}`
        );

        toast.success(
          "Lead deleted"
        );

        fetchLeads();
      } catch (
        error: any
      ) {
        toast.error(
          error.response?.data
            ?.message ||
            "Delete failed"
        );
      }
    };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
<div>
  <h1 className="text-3xl font-bold">
    Leads Dashboard
  </h1>

  <p className="text-gray-600 mt-1">
    Welcome, {user?.name} (
    {user?.role})
  </p>
</div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Lead
          </button>

          <button
            onClick={
              handleExportCSV
            }
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Export CSV
          </button>

          <button
            onClick={() => {
              logout();
              navigate(
                "/login"
              );
            }}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search by name/email"
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="border p-3 rounded"
        />

        <select
          value={status}
          onChange={(e) =>
            setStatus(
              e.target.value
            )
          }
          className="border p-3 rounded"
        >
          <option value="">
            All Status
          </option>

          <option value="New">
            New
          </option>

          <option value="Contacted">
            Contacted
          </option>

          <option value="Qualified">
            Qualified
          </option>

          <option value="Lost">
            Lost
          </option>
        </select>

        <select
          value={source}
          onChange={(e) =>
            setSource(
              e.target.value
            )
          }
          className="border p-3 rounded"
        >
          <option value="">
            All Sources
          </option>

          <option value="Website">
            Website
          </option>

          <option value="Instagram">
            Instagram
          </option>

          <option value="Referral">
            Referral
          </option>
        </select>

        <select
          value={sort}
          onChange={(e) =>
            setSort(
              e.target.value
            )
          }
          className="border p-3 rounded"
        >
          <option value="latest">
            Latest
          </option>

          <option value="oldest">
            Oldest
          </option>
        </select>
      </div>

      {loading ? (
        <p>Loading leads...</p>
      ) : leads.length === 0 ? (
        <p>No leads found</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">
                  Name
                </th>

                <th className="p-4 text-left">
                  Email
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

                <th className="p-4 text-left">
                  Source
                </th>

                <th className="p-4 text-left">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {leads.map(
                (lead) => (
                  <tr
                    key={
                      lead._id
                    }
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-4">
                      {
                        lead.name
                      }
                    </td>

                    <td className="p-4">
                      {
                        lead.email
                      }
                    </td>

                    <td className="p-4">
                      {
                        lead.status
                      }
                    </td>

                    <td className="p-4">
                      {
                        lead.source
                      }
                    </td>

                    <td className="p-4 flex gap-2">
                      <button
                        onClick={() =>
                          handleEdit(
                            lead
                          )
                        }
                        className="bg-yellow-500 hover:bg-yellow-600 transition text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>

                      {user?.role ===
                        "admin" && (
                        <button
                    onClick={() => {
                        const confirmed =
                            window.confirm(
                            "Are you sure you want to delete this lead?"
                        );

                    if (confirmed) {
                        handleDelete(
                            lead._id
                        );
                    }
                }}
                          className="bg-red-500 hover:bg-red-600 transition text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-center gap-4 mt-6">
        <button
          disabled={page === 1}
          onClick={() =>
            setPage(
              page - 1
            )
          }
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="font-semibold">
          Page {page} of{" "}
          {totalPages}
        </span>

        <button
          disabled={
            page ===
            totalPages
          }
          onClick={() =>
            setPage(
              page + 1
            )
          }
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              {editingLead
                ? "Edit Lead"
                : "Add Lead"}
            </h2>

            <form
              onSubmit={
                handleSubmitLead
              }
            >
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={
                  leadForm.name
                }
                onChange={
                  handleInputChange
                }
                className="w-full border p-3 rounded mb-4"
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={
                  leadForm.email
                }
                onChange={
                  handleInputChange
                }
                className="w-full border p-3 rounded mb-4"
              />

              <select
                name="status"
                value={
                  leadForm.status
                }
                onChange={
                  handleInputChange
                }
                className="w-full border p-3 rounded mb-4"
              >
                <option value="New">
                  New
                </option>

                <option value="Contacted">
                  Contacted
                </option>

                <option value="Qualified">
                  Qualified
                </option>

                <option value="Lost">
                  Lost
                </option>
              </select>

              <select
                name="source"
                value={
                  leadForm.source
                }
                onChange={
                  handleInputChange
                }
                className="w-full border p-3 rounded mb-4"
              >
                <option value="Website">
                  Website
                </option>

                <option value="Instagram">
                  Instagram
                </option>

                <option value="Referral">
                  Referral
                </option>
              </select>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {editingLead
                    ? "Update"
                    : "Create"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setShowModal(
                      false
                    )
                  }
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;