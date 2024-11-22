import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
import {
  Users,
  UserPlus,
  CheckCircle,
  Trash2,
  PenSquare,
  ChevronRight,
  Menu,
  X,
  Save,
  ChartBarIcon,
} from "lucide-react";
import Stats from '../components/Stats';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("addTeacher");
  const [teachers, setTeachers] = useState([]);
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [pendingStudents, setPendingStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    email: "",
    department: "",
    password: "",
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [deletingTeacherId, setDeletingTeacherId] = useState(null);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data } = await customFetch.get("/auth/check-auth");
        if (data.user.role !== "admin") {
          toast.error("Unauthorized access");
          navigate("/login");
        }
      } catch (error) {
        navigate("/login");
      }
    };

    const fetchData = async () => {
      try {
        const [teachersRes, pendingTeachersRes, pendingStudentsRes] =
          await Promise.all([
            customFetch.get("/admin/teachers"),
            customFetch.get("/admin/pending-teachers"),
            customFetch.get("/admin/pending-students"),
          ]);

        setTeachers(teachersRes.data.teachers);
        setPendingTeachers(pendingTeachersRes.data.teachers);
        setPendingStudents(pendingStudentsRes.data.students);
      } catch (error) {
        toast.error("Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
    fetchData();
  }, [navigate]);

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    try {
      const { data } = await customFetch.post("/admin/add-teacher", newTeacher);
      setTeachers([...teachers, data.teacher]);
      toast.success("Teacher added successfully");
      setNewTeacher({
        name: "",
        email: "",
        department: "",
        password: "",
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add teacher");
    }
  };

  const handleDeleteTeacher = async (teacherId) => {
    try {
      await customFetch.delete(`/admin/teachers/${teacherId}`);
      setTeachers((prev) => prev.filter((t) => t._id !== teacherId));
      toast.success("Teacher deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete teacher");
    }
  };

  const handleApproveRegistration = async (userId, type) => {
    try {
      const endpoint =
        type === "teacher"
          ? `/admin/approve-teacher/${userId}`
          : `/admin/approve-student/${userId}`;

      await customFetch.patch(endpoint);

      if (type === "teacher") {
        setPendingTeachers((prev) => prev.filter((t) => t._id !== userId));
      } else {
        setPendingStudents((prev) => prev.filter((s) => s._id !== userId));
      }

      toast.success(
        `${type === "teacher" ? "Teacher" : "Student"} registration approved`
      );
    } catch (error) {
      toast.error("Failed to approve registration");
    }
  };

  const handleRejectRegistration = async (userId, type) => {
    try {
      const endpoint =
        type === "teacher"
          ? `/admin/reject-teacher/${userId}`
          : `/admin/reject-student/${userId}`;

      await customFetch.delete(endpoint);

      if (type === "teacher") {
        setPendingTeachers((prev) => prev.filter((t) => t._id !== userId));
      } else {
        setPendingStudents((prev) => prev.filter((s) => s._id !== userId));
      }

      toast.success(
        `${type === "teacher" ? "Teacher" : "Student"} registration rejected`
      );
    } catch (error) {
      toast.error("Failed to reject registration");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleEditTeacher = (teacher) => {
    console.log("Editing teacher:", teacher);
    setEditingTeacher({
      _id: teacher._id,
      name: teacher.name,
      email: teacher.email,
      department: teacher.department,
      isApproved: teacher.isApproved,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await customFetch.patch(
        `/admin/teachers/${editingTeacher._id}`,
        {
          name: editingTeacher.name,
          department: editingTeacher.department,
          isApproved: editingTeacher.isApproved,
        }
      );

      if (data.success) {
        setTeachers((prev) =>
          prev.map((t) => (t._id === editingTeacher._id ? data.teacher : t))
        );
        setEditingTeacher(null);
        toast.success("Teacher updated successfully");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error?.response?.data?.message || "Failed to update teacher");
    }
  };

  const handleConfirmDelete = async (teacherId) => {
    try {
      await customFetch.delete(`/admin/teachers/${teacherId}`);
      setTeachers(teachers.filter((teacher) => teacher._id !== teacherId));
      setDeletingTeacherId(null);
      toast.success("Teacher deleted successfully");
    } catch (error) {
      toast.error("Failed to delete teacher");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 pt-20 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-16 left-4 z-50 sm:hidden bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
      >
        {isSidebarOpen ? (
          <X className="h-6 w-6 text-gray-600" />
        ) : (
          <Menu className="h-6 w-6 text-gray-600" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 sm:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg pt-20 z-40 transition-transform duration-300 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
      >
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your application</p>
        </div>
        <nav className="mt-6 px-4">
          <button
            className={`w-full mb-3 px-4 py-3 text-left flex items-center space-x-3 rounded-lg transition-all duration-200 ${
              activeTab === "addTeacher"
                ? "bg-blue-50 text-blue-600 shadow-sm"
                : "hover:bg-gray-50"
            }`}
            onClick={() => {
              setActiveTab("addTeacher");
              setIsSidebarOpen(false); // Close sidebar on mobile after selection
            }}
          >
            <UserPlus className="h-5 w-5" />
            <span>Add Teacher</span>
            <ChevronRight
              className={`h-5 w-5 ml-auto transition-transform ${
                activeTab === "addTeacher" ? "rotate-90" : ""
              }`}
            />
          </button>
          <button
            className={`w-full mb-3 px-4 py-3 text-left flex items-center space-x-3 rounded-lg transition-all duration-200 ${
              activeTab === "manageTeachers"
                ? "bg-blue-50 text-blue-600 shadow-sm"
                : "hover:bg-gray-50"
            }`}
            onClick={() => {
              setActiveTab("manageTeachers");
              setIsSidebarOpen(false); // Close sidebar on mobile after selection
            }}
          >
            <Users className="h-5 w-5" />
            <span>Manage Teachers</span>
            <ChevronRight
              className={`h-5 w-5 ml-auto transition-transform ${
                activeTab === "manageTeachers" ? "rotate-90" : ""
              }`}
            />
          </button>
          <button
            className={`w-full mb-3 px-4 py-3 text-left flex items-center space-x-3 rounded-lg transition-all duration-200 ${
              activeTab === "approvals"
                ? "bg-blue-50 text-blue-600 shadow-sm"
                : "hover:bg-gray-50"
            }`}
            onClick={() => {
              setActiveTab("approvals");
              setIsSidebarOpen(false); // Close sidebar on mobile after selection
            }}
          >
            <CheckCircle className="h-5 w-5" />
            <span>Approvals</span>
            <ChevronRight
              className={`h-5 w-5 ml-auto transition-transform ${
                activeTab === "approvals" ? "rotate-90" : ""
              }`}
            />
          </button>
          <button
            className={`w-full mb-3 px-4 py-3 text-left flex items-center space-x-3 rounded-lg transition-all duration-200 ${
              activeTab === 'stats' 
                ? 'bg-blue-50 text-blue-600 shadow-sm' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => {
              setActiveTab('stats');
              setIsSidebarOpen(false);
            }}
          >
            <ChartBarIcon className="h-5 w-5" />
            <span>Statistics</span>
            <ChevronRight className={`h-5 w-5 ml-auto transition-transform ${
              activeTab === 'stats' ? 'rotate-90' : ''
            }`} />
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-0 sm:ml-64 min-h-screen p-4 sm:p-8 pt-28 md:pt-20 lg:pt-24 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {activeTab === "addTeacher" && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 sm:p-8 border-b bg-gradient-to-r from-blue-600 to-indigo-600">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Add New Teacher
                </h2>
                <p className="text-blue-100 mt-2 text-sm sm:text-base">
                  Create a new teacher account with all necessary details
                </p>
              </div>
              <div className="p-4 sm:p-8">
                <form
                  onSubmit={handleAddTeacher}
                  className="space-y-6 max-w-4xl mx-auto"
                >
                  {/* Name and Email Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="form-control w-full">
                      <label className="label mb-2">
                        <span className="label-text text-base sm:text-lg font-semibold">
                          Full Name
                        </span>
                      </label>
                      <input
                        type="text"
                        value={newTeacher.name}
                        onChange={(e) =>
                          setNewTeacher({ ...newTeacher, name: e.target.value })
                        }
                        className="input input-bordered h-12 w-full bg-gray-50 focus:bg-white transition-colors text-base"
                        placeholder="Enter teacher's full name"
                        required
                      />
                    </div>

                    <div className="form-control w-full">
                      <label className="label mb-2">
                        <span className="label-text text-base sm:text-lg font-semibold">
                          Email Address
                        </span>
                      </label>
                      <input
                        type="email"
                        value={newTeacher.email}
                        onChange={(e) =>
                          setNewTeacher({
                            ...newTeacher,
                            email: e.target.value,
                          })
                        }
                        className="input input-bordered h-12 w-full bg-gray-50 focus:bg-white transition-colors text-base"
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                  </div>

                  {/* Department Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="form-control w-full">
                      <label className="label mb-2">
                        <span className="label-text text-base sm:text-lg font-semibold">
                          Department
                        </span>
                      </label>
                      <select
                        value={newTeacher.department}
                        onChange={(e) =>
                          setNewTeacher({
                            ...newTeacher,
                            department: e.target.value,
                          })
                        }
                        className="select select-bordered h-12 w-full bg-gray-50 focus:bg-white transition-colors text-base"
                        required
                      >
                        <option value="" disabled>
                          Select a department
                        </option>
                        <option value="computer-science">
                          Computer Science
                        </option>
                        <option value="mathematics">Mathematics</option>
                        <option value="physics">Physics</option>
                        <option value="chemistry">Chemistry</option>
                      </select>
                    </div>
                  </div>

                  {/* Password Section */}
                  <div className="form-control w-full">
                    <label className="label mb-2">
                      <span className="label-text text-base sm:text-lg font-semibold">
                        Password
                      </span>
                      <span className="label-text-alt text-gray-500">
                        Must be at least 8 characters
                      </span>
                    </label>
                    <input
                      type="password"
                      value={newTeacher.password}
                      onChange={(e) =>
                        setNewTeacher({
                          ...newTeacher,
                          password: e.target.value,
                        })
                      }
                      className="input input-bordered h-12 w-full bg-gray-50 focus:bg-white transition-colors text-base"
                      placeholder="Create a strong password"
                      required
                      minLength={8}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6">
                    <button
                      type="submit"
                      className="btn w-full sm:w-auto normal-case bg-green-500  hover:bg-green-700 text-white border-none rounded-xl px-6 py-2.5 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <UserPlus size={18} />
                        <span className="text-sm font-medium">Add New Teacher</span>
                      </div>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === "manageTeachers" && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-8 border-b bg-gradient-to-r from-blue-600 to-indigo-600">
                <h2 className="text-3xl font-bold text-white">
                  Manage Teachers
                </h2>
                <p className="text-blue-100 mt-2">
                  View, update, and manage all teachers
                </p>
              </div>
              <div className="p-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div className="stat bg-blue-50 rounded-xl">
                    <div className="m-4">
                    <div className="stat-title text-blue-600">
                      Total Teachers
                    </div>
                    <div className="stat-value text-blue-600">
                      {teachers.length}
                    </div>
                    </div>
                  </div>
                  <div className="stat bg-green-50 rounded-xl ">
                   <div className="m-4">
                   <div className="stat-title text-green-600">
                      Active Teachers
                    </div>
                    <div className="stat-value text-green-600">
                      {teachers.filter((t) => t.isApproved).length}
                    </div>
                   </div>
                  </div>
                  <div className="stat bg-yellow-50 rounded-xl">
                   <div className="m-4">
                   <div className="stat-title text-yellow-600">
                      Pending Approval
                    </div>
                    <div className="stat-value text-yellow-600">
                      {pendingTeachers.length}
                    </div>
                   </div>
                  </div>
                </div>

                {/* Teachers Table */}
                <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                  <table className="table w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                        <th className="text-center py-4 px-6 font-semibold text-sm uppercase">
                          Teacher Info
                        </th>
                        <th className="text-center py-4 px-6 font-semibold text-sm uppercase">
                          Department
                        </th>
                        <th className="text-center py-4 px-6 font-semibold text-sm uppercase">
                          Status
                        </th>
                        <th className="text-center py-4 px-6 font-semibold text-sm uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {teachers.map((teacher) => (
                        <tr
                          key={teacher._id}
                          className="hover:bg-gray-50 border-b border-gray-200 transition-colors"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="avatar">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-md">
                                  <span className="text-xl font-bold text-white uppercase">
                                    {teacher.name?.[0] || 'T'}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{teacher.name}</h4>
                                <p className="text-sm text-gray-500">{teacher.email}</p>
                                <p className="text-xs text-gray-400">{teacher.department}</p>
                              </div>
                            </div>
                          </td>
                          <td className="text-center py-4 px-6">
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700">
                              {teacher.department}
                            </span>
                          </td>
                          <td className="text-center py-4 px-6">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                teacher.isApproved
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {teacher.isApproved ? "Active" : "Pending"}
                            </span>
                          </td>
                          <td className="text-center py-4 px-6">
                            <div className="flex items-center justify-center space-x-2">
                              <button
                                onClick={() => handleEditTeacher(teacher)}
                                className="btn btn-ghost btn-sm bg-blue-50 hover:bg-blue-100 text-blue-600 border-none"
                              >
                                <PenSquare className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteTeacher(teacher._id)}
                                className="btn btn-ghost btn-sm bg-red-50 hover:bg-red-100 text-red-600 border-none"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {teachers.length === 0 && (
                    <div className="text-center py-12">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Users className="h-12 w-12 mb-4 text-gray-400" />
                        <p className="text-lg font-medium">No teachers found</p>
                        <p className="text-sm text-gray-400">
                          Add teachers to see them here
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Edit Teacher Modal */}
                {editingTeacher && (
                  <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

                    <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all">
                      {/* Modal Header */}
                      <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-xl">
                        <h3 className="text-lg font-bold text-white">
                          Edit Teacher Profile
                        </h3>
                        <p className="text-xs text-blue-100 mt-1">
                          Update teacher information
                        </p>
                      </div>

                      {/* Modal Body */}
                      <div className="p-4 max-h-[70vh] overflow-y-auto">
                        <form onSubmit={handleEditSubmit} className="space-y-3">
                          {/* Name Field */}
                          <div className="form-control">
                            <label className="label py-1">
                              <span className="label-text text-sm font-medium">
                                Full Name
                              </span>
                            </label>
                            <input
                              type="text"
                              value={editingTeacher.name}
                              onChange={(e) =>
                                setEditingTeacher({
                                  ...editingTeacher,
                                  name: e.target.value,
                                })
                              }
                              className="input input-bordered input-sm w-full"
                              placeholder="Enter name"
                              required
                            />
                          </div>

                          {/* Email Field */}
                          <div className="form-control">
                            <label className="label py-1">
                              <span className="label-text text-sm font-medium">
                                Email
                              </span>
                            </label>
                            <input
                              type="email"
                              value={editingTeacher.email}
                              className="input input-bordered input-sm w-full bg-gray-50"
                              disabled
                            />
                            <label className="label">
                              <span className="label-text-alt text-xs text-gray-500">
                                Email cannot be changed
                              </span>
                            </label>
                          </div>

                          {/* Department Field */}
                          <div className="form-control">
                            <label className="label py-1">
                              <span className="label-text text-sm font-medium">
                                Department
                              </span>
                            </label>
                            <select
                              value={editingTeacher.department}
                              onChange={(e) =>
                                setEditingTeacher({
                                  ...editingTeacher,
                                  department: e.target.value,
                                })
                              }
                              className="select select-bordered select-sm w-full"
                              required
                            >
                              <option value="">Select</option>
                              <option value="computer-science">
                                Computer Science
                              </option>
                              <option value="mathematics">Mathematics</option>
                              <option value="physics">Physics</option>
                              <option value="chemistry">Chemistry</option>
                            </select>
                            <label className="label">
                              <span className="label-text-alt text-xs text-gray-500">
                                Select teacher's department
                              </span>
                            </label>
                          </div>

                          {/* Active Status Toggle */}
                          <div className="form-control border-t pt-4">
                            <label className="label cursor-pointer flex items-center gap-4">
                              <span className="label-text text-sm font-semibold">
                                Active Status
                              </span>
                              <input
                                type="checkbox"
                                checked={editingTeacher.isApproved}
                                onChange={(e) =>
                                  setEditingTeacher({
                                    ...editingTeacher,
                                    isApproved: e.target.checked,
                                  })
                                }
                                className="toggle toggle-success toggle-sm"
                              />
                            </label>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 border-t mt-3 pt-3">
                            <button
                              type="submit"
                              className="btn btn-primary btn-sm flex-1 bg-white hover:bg-gray-200 text-black border-none"
                            >
                              <div className="flex items-center">
                                <Save className="h-4 w-4 mr-1" />
                                Save
                              </div>
                            </button>
                            <button
                              type="button"
                              className="btn btn-ghost btn-sm flex-1 bg-white hover:bg-gray-200 text-black border-none"
                              onClick={() => setEditingTeacher(null)}
                            >
                              <div className="flex items-center">
                                <X className="h-4 w-4 mr-1" />
                                Cancel
                              </div>
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                )}

                {/* Delete Confirmation Modal */}
                {deletingTeacherId && (
                  <div className="modal modal-open">
                    <div className="modal-box">
                      <h3 className="font-bold text-lg">Confirm Delete</h3>
                      <p className="py-4">
                        Are you sure you want to delete this teacher? This
                        action cannot be undone.
                      </p>
                      <div className="modal-action">
                        <button
                          onClick={() => handleConfirmDelete(deletingTeacherId)}
                          className="btn btn-error"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setDeletingTeacherId(null)}
                          className="btn btn-ghost"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                    <div
                      className="modal-backdrop"
                      onClick={() => setDeletingTeacherId(null)}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "approvals" && (
            <div className="space-y-8">
              {/* Pending Teachers */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-8 border-b bg-gradient-to-r from-blue-600 to-indigo-600">
                  <h2 className="text-3xl font-bold text-white">
                    Pending Approvals
                  </h2>
                  <p className="text-blue-100 mt-2">
                    Review and manage registration requests
                  </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
                  <div className="stats shadow">
                    <div className="stat bg-yellow-50 ">
                      <div className="stat-figure text-yellow-500 ml-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          className="inline-block w-8 h-8 stroke-current"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          >
                            
                          </path>
                        </svg>
                      </div>
                      <div className="stat-title text-yellow-700 ml-4">
                        Pending Teachers
                      </div>
                      <div className="stat-value text-yellow-700 ml-4">
                        {pendingTeachers.length}
                      </div>
                      <div className="stat-desc text-yellow-600 ml-4">
                        Awaiting Approval
                      </div>
                    </div>
                  </div>

                  <div className="stats shadow">
                    <div className="stat bg-blue-50">
                      <div className="stat-figure text-blue-500 ml-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          className="inline-block w-8 h-8 stroke-current"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                      </div>
                      <div className="stat-title text-blue-700 ml-4">
                        Pending Students
                      </div>
                      <div className="stat-value text-blue-700 ml-4">
                        {pendingStudents.length}
                      </div>
                      <div className="stat-desc text-blue-600 ml-4">
                        Awaiting Approval
                      </div>
                    </div>
                  </div>
                </div>

                {/* Teachers Section */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    Teacher Requests
                  </h3>
                  <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                    <table className="table w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                          <th className="text-center py-4 px-6 font-semibold text-sm uppercase">
                            Teacher Info
                          </th>
                          <th className="text-center py-4 px-6 font-semibold text-sm uppercase">
                            Department
                          </th>
                          <th className="text-center py-4 px-6 font-semibold text-sm uppercase">
                            Email
                          </th>
                          <th className="text-center py-4 px-6 font-semibold text-sm uppercase">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingTeachers.length === 0 ? (
                          <tr>
                            <td colSpan="4" className="text-center py-8">
                              <div className="flex flex-col items-center justify-center text-gray-500">
                                <svg
                                  className="w-12 h-12 mb-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                <span>No pending teacher requests</span>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          pendingTeachers.map((teacher) => (
                            <tr
                              key={teacher._id}
                              className="hover:bg-gray-50 border-b border-gray-200 transition-colors"
                            >
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                  <div className="avatar">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-md">
                                      <span className="text-lg font-bold text-white uppercase">
                                        {teacher.name?.[0] || 'T'}
                                      </span>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-gray-900">{teacher.name}</h4>
                                    <p className="text-sm text-gray-500">{teacher.email}</p>
                                    <p className="text-xs text-gray-400">{teacher.department}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="text-center py-4 px-6">
                                <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700">
                                  {teacher.department}
                                </span>
                              </td>
                              <td className="text-center py-4 px-6">
                                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                                  {teacher.email}
                                </span>
                              </td>
                              <td className="text-center py-4 px-6">
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                                  <button
                                    onClick={() => handleApproveRegistration(teacher._id, "teacher")}
                                    className="btn w-full sm:w-auto normal-case bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-none rounded-xl px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-200"
                                  >
                                    <div className="flex items-center justify-center gap-2 min-w-[90px]">
                                      <CheckCircle size={16} />
                                      <span className="text-sm font-medium">Approve</span>
                                    </div>
                                  </button>
                                  <button
                                    onClick={() => handleRejectRegistration(teacher._id, "teacher")}
                                    className="btn w-full sm:w-auto normal-case bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-none rounded-xl px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-200"
                                  >
                                    <div className="flex items-center justify-center gap-2 min-w-[90px]">
                                      <X size={16} />
                                      <span className="text-sm font-medium">Reject</span>
                                    </div>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Students Section */}
                <div className="p-6 border-t">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    Student Requests
                  </h3>
                  <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                    <table className="table w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                          <th className="text-center py-4 px-6 font-semibold text-sm uppercase">
                            Student Info
                          </th>
                          <th className="text-center py-4 px-6 font-semibold text-sm uppercase">
                            Email
                          </th>
                          <th className="text-center py-4 px-6 font-semibold text-sm uppercase">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingStudents.length === 0 ? (
                          <tr>
                            <td colSpan="3" className="text-center py-8">
                              <div className="flex flex-col items-center justify-center text-gray-500">
                                <svg
                                  className="w-12 h-12 mb-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                <span>No pending student requests</span>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          pendingStudents.map((student) => (
                            <tr
                              key={student._id}
                              className="hover:bg-gray-50 border-b border-gray-200 transition-colors"
                            >
                              <td className="py-4 px-6">
                                <div className="flex items-center justify-center space-x-3">
                                  <div className="avatar">
                                    <div className="mask mask-squircle w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                                      <span className="text-xl font-bold text-white uppercase">
                                        {student.username
                                          .split(" ")
                                          .map((word) => word[0])
                                          .join("")}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-bold text-gray-900">
                                      {student.username}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      New Student
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="text-center py-4 px-6">
                                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                                  {student.email}
                                </span>
                              </td>
                              <td className="text-center py-4 px-6">
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                                  <button
                                    onClick={() => handleApproveRegistration(student._id, "student")}
                                    className="btn w-full sm:w-auto normal-case bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-none rounded-xl px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-200"
                                  >
                                    <div className="flex items-center justify-center gap-2 min-w-[90px]">
                                      <CheckCircle size={16} />
                                      <span className="text-sm font-medium">Approve</span>
                                    </div>
                                  </button>
                                  <button
                                    onClick={() => handleRejectRegistration(student._id, "student")}
                                    className="btn w-full sm:w-auto normal-case bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-none rounded-xl px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-200"
                                  >
                                    <div className="flex items-center justify-center gap-2 min-w-[90px]">
                                      <X size={16} />
                                      <span className="text-sm font-medium">Reject</span>
                                    </div>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <Stats teachers={teachers} students={pendingStudents} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
