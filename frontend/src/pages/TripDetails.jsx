import React, { useEffect, useState } from "react";
import { useTripStore } from "@/store/useTripStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "@/api";
import { toast } from "react-toastify";
import TripChat from "@/components/TripChat";

const TripDetails = () => {
  const { tripId } = useParams();
  const { trip, fetchTripById, addTodo, toggleTodo, deleteTodo } = useTripStore();
  const { authUser } = useAuthStore();
  const [inviteEmail, setInviteEmail] = useState("");
  const [newTodo, setNewTodo] = useState("");
  const [memberDetails, setMemberDetails] = useState([]); 
  const navigate = useNavigate();

  useEffect(() => {
    if (tripId) {
      fetchTripById(tripId);
    }
  }, [tripId]);

  // Fetch member details when trip is loaded
  useEffect(() => {
    const fetchMemberDetails = async () => {
      if (trip?.members && Array.isArray(trip.members)) {
        try {
          // Check if members are already populated (have name property)
          const firstMember = trip.members[0];
          if (firstMember && typeof firstMember === 'object' && firstMember.name) {
            // Members are already populated
            setMemberDetails(trip.members);
            return;
          }

          // Members are just IDs, need to fetch details
          const response = await axiosInstance.post('/users/by-ids', {
            userIds: trip.members
          });
          setMemberDetails(response.data);
        } catch (error) {
          console.error('Error fetching member details:', error);
          setMemberDetails([]);
        }
      }
    };

    fetchMemberDetails();
  }, [trip]);

  if (!trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-slate-200">
          <div className="text-6xl mb-4">✈️</div>
          <h2 className="text-2xl font-semibold text-slate-700 mb-2">Loading Trip...</h2>
          <p className="text-slate-500">Please wait while we load your trip details</p>
        </div>
      </div>
    );
  }

  const sendInvite = async () => {
    try {
      if (!inviteEmail) return toast.error("Please enter email");
      await axiosInstance.post("/email/invite", {
        tripId: trip._id,
        receiverEmail: inviteEmail,
      });
      toast.success("Invite sent!");
      setInviteEmail("");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Failed to send invite");
    }
  };

  const handleAddTodo = async () => {
    if (!newTodo.trim()) return toast.warn("Enter a todo");
    await addTodo(trip._id, newTodo.trim());
    setNewTodo("");
  };

  const handleToggleTodo = async (todoId) => {
    await toggleTodo(trip._id, todoId);
  };

  const handleDeleteTodo = async (todoId) => {
    await deleteTodo(trip._id, todoId);
  };

  // Check if createdBy is populated or just an ID
  const isCreator = authUser && (
    (trip.createdBy._id && authUser._id === trip.createdBy._id) ||
    (typeof trip.createdBy === 'string' && authUser._id === trip.createdBy)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="flex h-screen">
        {/* Left Side - Chat (1/3) */}
        <div className="w-1/3 bg-white border-r border-slate-200 shadow-lg">
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-purple-600">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <span className="text-2xl">💬</span>
                Trip Chat
              </h2>
              <p className="text-blue-100 text-sm mt-1">Stay connected with your travel companions</p>
            </div>
            <div className="flex-1 overflow-hidden">
              <TripChat />
            </div>
          </div>
        </div>

        {/* Right Side - Trip Details (2/3) */}
        <div className="w-2/3 overflow-y-auto">
          <div className="p-8">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">🌍</span>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {trip.name}
                </h1>
              </div>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
            </div>

            <div className="grid gap-6">
              {/* Trip Information Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-4 border-b border-slate-200">
                  <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                    <span className="text-2xl">📋</span>
                    Trip Overview
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                      <span className="text-2xl">📍</span>
                      <div>
                        <p className="text-sm font-medium text-slate-600">Destination</p>
                        <p className="text-lg font-semibold text-slate-800">{trip.destination}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                       <span className="text-2xl">👥</span>
                       <div>
                         <p className="text-sm font-medium text-slate-600">Total Members</p>
                        <p className="text-lg font-semibold text-slate-800">{trip.members?.length || 1}</p>
                       </div>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                    <span className="text-2xl">📅</span>
                    <div>
                      <p className="text-sm font-medium text-slate-600">Travel Dates</p>
                      <p className="text-lg font-semibold text-slate-800">
                        {new Date(trip.startDate).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })} - {new Date(trip.endDate).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => navigate(`/trip/${trip._id}/expenses`)}
                  className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-2 border-transparent hover:border-blue-300"
                >
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-3xl group-hover:scale-110 transition-transform">💰</span>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold">Manage Expenses</h3>
                      <p className="text-blue-100 text-sm">Track and split costs</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => navigate(`/trip/${trip._id}/itinerary`)}
                  className="group bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-2 border-transparent hover:border-purple-300"
                >
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-3xl group-hover:scale-110 transition-transform">🗓️</span>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold">View Itinerary</h3>
                      <p className="text-purple-100 text-sm">Plan your schedule</p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Invite Section */}
              {isCreator ? (
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-slate-50 to-green-50 px-6 py-4 border-b border-slate-200">
                    <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                      <span className="text-2xl">✉️</span>
                      Invite Friends
                    </h2>
                    <p className="text-slate-600 text-sm mt-1">Share this amazing trip with others</p>
                  </div>
                  <div className="p-6">
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <input
                          type="email"
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors text-slate-700 placeholder-slate-400"
                          placeholder="Enter email address to invite"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                        />
                      </div>
                      <button
                        onClick={sendInvite}
                        className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold flex items-center gap-2"
                      >
                        <span>📤</span>
                        Send Invite
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-4 border-b border-slate-200">
                    <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                      <span className="text-2xl">👥</span>
                      Trip Members
                    </h2>
                    <p className="text-slate-600 text-sm mt-1">Only the trip creator can invite new members</p>
                  </div>
                  <div className="p-6">
                    <p className="text-slate-500 text-center py-4">
                      Contact the trip organizer to invite more people to this trip.
                    </p>
                  </div>
                </div>
              )}

              {/* Todos Section */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-slate-50 to-green-50 px-6 py-4 border-b border-slate-200">
                  <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                    <span className="text-2xl">✅</span>
                    Trip Todos
                  </h2>
                </div>
                <div className="p-6">
                  {/* Add Todo Input */}
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors text-slate-700 placeholder-slate-400"
                      placeholder="Add a new task..."
                      value={newTodo}
                      onChange={(e) => setNewTodo(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
                    />
                    <button
                      onClick={handleAddTodo}
                      className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:shadow-lg font-semibold flex items-center gap-2"
                    >
                      Add
                    </button>
                  </div>

                  {trip.todos?.length === 0 ? (
                    <div className="text-center py-8">
                      <span className="text-6xl block mb-4">📝</span>
                      <p className="text-slate-500 text-lg">No tasks yet.</p>
                      <p className="text-slate-400 text-sm mt-2">Add some todos to stay organized!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {trip.todos?.map((todo) => (
                        <div
                          key={todo._id}
                          className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${todo.done
                            ? "bg-green-50 border-green-200 text-green-700"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300"
                            }`}
                        >
                          <div
                            className="flex items-center gap-3 cursor-pointer"
                            onClick={() => handleToggleTodo(todo._id)}
                          >
                            <span className="text-xl">
                              {todo.done ? "✅" : "⭕"}
                            </span>
                            <span className={`${todo.done ? "line-through" : ""}`}>
                              {todo.task}
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTodo(todo._id);
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetails;
